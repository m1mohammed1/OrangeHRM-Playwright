

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { chromium, Browser, BrowserContext, Page } from "playwright";
import { expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import { Project, QuoteKind, SyntaxKind } from "ts-morph";
import { Mutex } from "async-mutex";

import { CommonPage } from "@pages/CommonPage";
import { LoginPage } from "@pages/LoginPage";
import { AdminPage } from "@pages/AdminPage";
import { DashboardPage } from "@pages/DashboardPage";
import { LeavePage } from "@pages/LeavePage";
import { RecruitmentPage } from "@pages/RecruitmentPage";
import { PIMPage } from "@pages/PIMPage";
import { TimePage } from "@pages/TimePage";
import { PerformancePage } from "@pages/PerformancePage";
import { MaintenancePage } from "@pages/MaintenancePage";
import { ClaimPage } from "@pages/ClaimPage";
import { BuzzPage } from "@pages/BuzzPage";

const execAsync = promisify(exec);

const STORAGE_STATE_PATH = path.join(process.cwd(), "data/storageState.json");
const SANDBOX_DIR = path.join(process.cwd(), "selfheal-process/sandbox");
const ALLURE_RESULTS_DIR = path.join(process.cwd(), "allure-results");
const TESTS_CLEAN_DIR = path.join(process.cwd(), "tests/Clean");
const ARTIFACTS_DIR = path.join(process.cwd(), "artifacts/screenshots");

async function initializeDirectories(): Promise<void> {
    const directories = [
        SANDBOX_DIR,
        path.dirname(STORAGE_STATE_PATH),
        TESTS_CLEAN_DIR,
        ARTIFACTS_DIR
    ];

    await Promise.all(
        directories.map(dir =>
            fsPromises.mkdir(dir, { recursive: true })
                .catch(err => {
                    if (err.code !== 'EEXIST') {
                        console.error(`[Init] Failed to create ${dir}:`, err.message);
                    }
                })
        )
    );
    console.error("[Init] ✅ Directories initialized");
}

class ScreenshotManager {
    private static readonly MAX_SIZE = 2 * 1024 * 1024;
    private static readonly RETENTION_HOURS = 24;
    private static readonly MAX_STORAGE = 100 * 1024 * 1024;

    static async capture(page: Page | null, label: string = "snapshot"): Promise<{ path: string } | null> {
        if (!page || page.isClosed()) return null;

        const timestamp = Date.now();
        const filename = `${label}_${timestamp}.jpg`;
        const filePath = path.join(ARTIFACTS_DIR, filename);

        try {
            await page.screenshot({
                path: filePath,
                type: "jpeg",
                quality: 60,
                fullPage: false
            });
            const stats = await fsPromises.stat(filePath);
            if (stats.size > this.MAX_SIZE) {
                await fsPromises.unlink(filePath);
                console.warn(`[Screenshot] ${label} exceeds size limit (${stats.size} bytes)`);
                return null;
            }
            this.cleanupOldFiles().catch(err =>
                console.error("[Screenshot] Cleanup error:", err.message)
            );

            return { path: filePath };

        } catch (e: any) {
            console.error(`[Screenshot] Failed for ${label}:`, e.message);
            return null;
        }
    }

    static async readAsBase64(filePath: string): Promise<string | null> {
        try {
            const stats = await fsPromises.stat(filePath);
            if (stats.size > this.MAX_SIZE) return null;

            const buffer = await fsPromises.readFile(filePath);
            return buffer.toString("base64");
        } catch {
            return null;
        }
    }

    private static async cleanupOldFiles(): Promise<void> {
        try {
            const files = await fsPromises.readdir(ARTIFACTS_DIR);
            const threshold = Date.now() - (this.RETENTION_HOURS * 60 * 60 * 1000);
            let totalSize = 0;

            const fileInfos = await Promise.all(
                files.filter(f => f.endsWith('.jpg') || f.endsWith('.png')).map(async f => {
                    const fPath = path.join(ARTIFACTS_DIR, f);
                    try {
                        const stat = await fsPromises.stat(fPath);
                        return { path: fPath, mtime: stat.mtimeMs, size: stat.size };
                    } catch {
                        return null;
                    }
                })
            );

            const validFiles = fileInfos.filter(Boolean) as Array<{ path: string; mtime: number; size: number }>;
            validFiles.sort((a, b) => a.mtime - b.mtime);

            for (const file of validFiles) {
                totalSize += file.size;

                if (file.mtime < threshold || totalSize > this.MAX_STORAGE) {
                    await fsPromises.unlink(file.path).catch(() => { });
                    totalSize -= file.size;
                }
            }
        } catch (err) {
            console.error("[Screenshot] Cleanup scan failed:", err);
        }
    }
}

class BrowserSession {
    private browser: Browser | null = null;
    private context: BrowserContext | null = null;
    public page: Page | null = null;
    public pages: Record<string, any> = {};
    private readonly launchMutex = new Mutex();
    private launchPromise: Promise<Browser> | null = null;
    private isClosing = false;
    private _boundPageContext: Page | null = null;

    async init(): Promise<Page> {
        const release = await this.launchMutex.acquire();

        try {
            if (this.page && !this.isClosing) {
                try {
                    await Promise.race([
                        this.page.evaluate(() => document.readyState),
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Health check timeout')), 2000)
                        )
                    ]);
                    if (this.page.url() !== "about:blank") {
                        this.hydratePageObjects(this.page);
                        return this.page;
                    }
                } catch (error) {
                    console.warn("[Session] Page unhealthy, restarting...");
                    await this.closeInternal();
                }
            }
            if (!this.browser) {
                if (!this.launchPromise) {
                    console.error("[Session] Booting Chromium...");
                    this.launchPromise = chromium.launch({
                        headless: process.env.HEADLESS !== 'false',
                        args: [
                            "--start-maximized",
                            "--no-sandbox",
                            "--disable-dev-shm-usage",
                            "--disable-gpu",
                            "--disable-extensions"
                        ],
                        timeout: 30000
                    });
                }

                this.browser = await this.launchPromise;
                this.launchPromise = null;
                console.error("[Session] ✅ Chromium ready");
            }
            if (!this.context) {
                this.context = await this.createContextWithRetry();
            }
            this.page = await this.context.newPage();
            this.hydratePageObjects(this.page);

            return this.page;

        } catch (error) {
            console.error("[Session] Init failed:", error);
            await this.closeInternal();
            throw error;
        } finally {
            release();
        }
    }

    private async createContextWithRetry(maxRetries = 2): Promise<BrowserContext> {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const exists = await fsPromises.access(STORAGE_STATE_PATH)
                    .then(() => true)
                    .catch(() => false);

                if (exists) {
                    return await this.browser!.newContext({
                        storageState: STORAGE_STATE_PATH,
                        viewport: null,
                        ignoreHTTPSErrors: true
                    });
                }
            } catch (error) {
                console.warn(`[Session] Storage load failed (attempt ${attempt}):`, error);
                await fsPromises.unlink(STORAGE_STATE_PATH).catch(() => { });
            }
        }

        return await this.browser!.newContext({
            viewport: null,
            ignoreHTTPSErrors: true
        });
    }

    private hydratePageObjects(page: Page) {
        if (this._boundPageContext === page && Object.keys(this.pages).length > 0) return;

        this.pages = {
            commonPage: new CommonPage(page),
            loginPage: new LoginPage(page),
            adminPage: new AdminPage(page),
            dashboardPage: new DashboardPage(page),
            leavePage: new LeavePage(page),
            recruitmentPage: new RecruitmentPage(page),
            pimPage: new PIMPage(page),
            timePage: new TimePage(page),
            performancePage: new PerformancePage(page),
            maintenancePage: new MaintenancePage(page),
            claimPage: new ClaimPage(page),
            buzzPage: new BuzzPage(page)
        };
        this._boundPageContext = page;
    }

    private async closeInternal() {
        try {
            await this.page?.close().catch(() => { });
            await this.context?.close().catch(() => { });
            await this.browser?.close().catch(() => { });
        } catch { }

        this.browser = null;
        this.context = null;
        this.page = null;
        this.pages = {};
        this._boundPageContext = null;
        this.launchPromise = null;
    }

    async close(): Promise<void> {
        if (this.isClosing) {
            console.warn("[Session] Already closing, skipping...");
            return;
        }

        const release = await this.launchMutex.acquire();
        this.isClosing = true;

        try {
            console.error("[Session] Starting graceful shutdown...");
            if (this.context) {
                try {
                    await Promise.race([
                        this.context.storageState({ path: STORAGE_STATE_PATH }),
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Storage save timeout')), 5000)
                        )
                    ]);
                    console.error("[Session] ✅ Storage state saved");
                } catch (err) {
                    console.error("[Session] Storage save failed:", err);
                }
            }
            await Promise.allSettled([
                this.page?.close(),
                this.context?.close(),
                this.browser?.close()
            ]);

            console.error("[Session] ✅ All resources closed");

        } finally {
            this.browser = null;
            this.context = null;
            this.page = null;
            this.pages = {};
            this._boundPageContext = null;
            this.launchPromise = null;
            this.isClosing = false;

            release();
        }
    }

    async getHealthStatus(): Promise<{
        healthy: boolean;
        browserConnected: boolean;
        pageAlive: boolean;
    }> {
        return {
            healthy: !!(this.browser && this.page && !this.isClosing),
            browserConnected: this.browser?.isConnected() || false,
            pageAlive: !!(this.page && !this.page.isClosed())
        };
    }
}

interface TrackedOperation {
    id: string;
    name: string;
    startTime: number;
    promise: Promise<any>;
}

class OperationTracker {
    private operations = new Map<string, TrackedOperation>();
    private isShuttingDown = false;

    track<T>(name: string, promise: Promise<T>): Promise<T> {
        if (this.isShuttingDown) {
            return Promise.reject(new Error("Server is shutting down"));
        }

        const id = `${name}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const operation: TrackedOperation = { id, name, startTime: Date.now(), promise };

        this.operations.set(id, operation);

        promise.finally(() => {
            this.operations.delete(id);
        });

        return promise;
    }

    async gracefulShutdown(reason: string, graceMs = 10000): Promise<void> {
        if (this.isShuttingDown) return;
        this.isShuttingDown = true;

        console.error(`\n╔════════════════════════════════════════╗`);
        console.error(`║   GRACEFUL SHUTDOWN INITIATED          ║`);
        console.error(`╚════════════════════════════════════════╝`);
        console.error(`Reason: ${reason}`);
        console.error(`Active Operations: ${this.operations.size}`);

        if (this.operations.size > 0) {
            console.error("[Shutdown] Waiting for operations to complete...");

            for (const op of this.operations.values()) {
                const elapsed = Date.now() - op.startTime;
                console.error(`  - ${op.name} (running for ${(elapsed / 1000).toFixed(1)}s)`);
            }

            const allOps = Array.from(this.operations.values()).map(op => op.promise);
            await Promise.race([
                Promise.allSettled(allOps),
                new Promise(resolve => setTimeout(resolve, graceMs))
            ]);

            if (this.operations.size > 0) {
                console.error(`[Shutdown] ⚠️  ${this.operations.size} operations did not complete in time`);
            }
        }
    }

    getMetrics() {
        return {
            activeOperations: this.operations.size,
            isShuttingDown: this.isShuttingDown,
            operations: Array.from(this.operations.values()).map(op => ({
                name: op.name,
                duration: Date.now() - op.startTime
            }))
        };
    }
}
const session = new BrowserSession();
const tracker = new OperationTracker();
const server = new McpServer({ name: "OrangeHRM-AutoHealer-Enterprise", version: "5.0.0" });

server.tool(
    "gather_failure_intelligence",
    "Retrieves failure context from Allure results with optimized async processing.",
    {
        mode: z.enum(["auto", "live", "historical"]).default("auto"),
        failed_label: z.string().optional(),
        search_limit: z.number().min(1).max(10).default(5)
    },
    async ({ mode, failed_label, search_limit }) => {
        return tracker.track("gather_failure_intelligence", (async () => {
            const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

            try {
                let evidence: any[] = [];
                let failureFound = false;
                if (mode !== "live") {
                    const dirExists = await fsPromises.access(ALLURE_RESULTS_DIR).then(() => true).catch(() => false);

                    if (dirExists) {
                        const dirFiles = await fsPromises.readdir(ALLURE_RESULTS_DIR);
                        const jsonFiles = dirFiles.filter(f => f.endsWith("-result.json"));
                        const fileStats = await Promise.all(
                            jsonFiles.map(async f => {
                                const fullPath = path.join(ALLURE_RESULTS_DIR, f);
                                try {
                                    const stat = await fsPromises.stat(fullPath);
                                    return { path: fullPath, mtime: stat.mtime.getTime(), size: stat.size };
                                } catch {
                                    return null;
                                }
                            })
                        );

                        const validFiles = fileStats
                            .filter((f): f is NonNullable<typeof f> => f !== null)
                            .sort((a, b) => b.mtime - a.mtime)
                            .slice(0, search_limit);
                        for (const file of validFiles) {
                            try {
                                const content = JSON.parse(await fsPromises.readFile(file.path, "utf8"));

                                if (content.status !== "failed" && content.status !== "broken") continue;
                                if (failed_label && !JSON.stringify(content).toLowerCase().includes(failed_label.toLowerCase())) continue;

                                failureFound = true;

                                const errorMsg = content.statusDetails?.message || "Unknown error";
                                const testName = content.fullName || content.name || "Unknown test";
                                const needsCleanup = /already exists|duplicate|conflict/i.test(errorMsg);

                                evidence.push({
                                    type: "text",
                                    text: `╔═══ FAILURE DETECTED (HISTORICAL) ═══╗
│ Test: ${testName}
│ Status: ${content.status.toUpperCase()}
│ File: ${path.basename(file.path)}
│
│ Error Preview:
│ ${errorMsg.slice(0, 400)}${errorMsg.length > 400 ? '...' : ''}
│
│ ⚠️  Cleanup Required: ${needsCleanup ? 'YES' : 'NO'}
╚═════════════════════════════════════╝`
                                });
                                const screenshotAtt = content.attachments?.find(
                                    (a: any) => a.type?.includes("image") || a.name === "screenshot"
                                );

                                if (screenshotAtt?.source) {
                                    const imgPath = path.join(ALLURE_RESULTS_DIR, screenshotAtt.source);
                                    try {
                                        const imgStat = await fsPromises.stat(imgPath);
                                        if (imgStat.size <= MAX_IMAGE_SIZE) {
                                            const imgBuffer = await fsPromises.readFile(imgPath);
                                            evidence.push({
                                                type: "image",
                                                data: imgBuffer.toString("base64"),
                                                mimeType: screenshotAtt.type || "image/png"
                                            });
                                        }
                                    } catch { }
                                }

                                break;
                            } catch (parseErr) {
                                console.warn(`[Intelligence] Failed to parse ${file.path}`);
                            }
                        }
                    }
                }
                if (mode !== "historical" && !failureFound) {
                    try {
                        const page = await session.init();
                        await page.waitForLoadState("networkidle", { timeout: 3000 }).catch(() => { });

                        const shot = await ScreenshotManager.capture(page, "live_intelligence");

                        evidence.push({
                            type: "text",
                            text: `[LIVE CAPTURE] No historical failures found.\nURL: ${page.url()}\nTitle: ${await page.title().catch(() => 'Unknown')}`
                        });

                        if (shot) {
                            const base64 = await ScreenshotManager.readAsBase64(shot.path);
                            if (base64) {
                                evidence.push({
                                    type: "image",
                                    data: base64,
                                    mimeType: "image/jpeg"
                                });
                            }
                        }
                    } catch (pageError: any) {
                        evidence.push({
                            type: "text",
                            text: `⚠️  Live capture failed: ${pageError.message}`
                        });
                    }
                }

                return {
                    content: evidence.length > 0
                        ? evidence
                        : [{ type: "text", text: "✅ System Healthy - No failures detected." }]
                };

            } catch (e: any) {
                return {
                    isError: true,
                    content: [{
                        type: "text",
                        text: `❌ Intelligence gathering failed: ${e.message}`
                    }]
                };
            }
        })());
    }
);

server.tool(
    "smart_self_heal_locator",
    "Executes parallel heuristic search to find valid locators instantly.",
    { failing_label: z.string() },
    async ({ failing_label }) => {
        return tracker.track("smart_self_heal_locator", (async () => {
            try {
                const page = await session.init();

                const strategies = [
                    { name: "TestID (Best)", score: 100, gen: (q: string) => page.getByTestId(q), code: (q: string) => `page.getByTestId('${q}')` },
                    { name: "Role:Button", score: 90, gen: (q: string) => page.getByRole("button", { name: q }), code: (q: string) => `page.getByRole('button', { name: '${q}' })` },
                    { name: "Role:Link", score: 90, gen: (q: string) => page.getByRole("link", { name: q }), code: (q: string) => `page.getByRole('link', { name: '${q}' })` },
                    { name: "Exact Text", score: 80, gen: (q: string) => page.getByText(q, { exact: true }), code: (q: string) => `page.getByText('${q}', { exact: true })` },
                    { name: "Label", score: 75, gen: (q: string) => page.getByLabel(q), code: (q: string) => `page.getByLabel('${q}')` },
                    { name: "Placeholder", score: 70, gen: (q: string) => page.getByPlaceholder(q), code: (q: string) => `page.getByPlaceholder('${q}')` },
                    { name: "Partial Text", score: 50, gen: (q: string) => page.getByText(q, { exact: false }), code: (q: string) => `page.getByText('${q}', { exact: false })` }
                ];
                const results = await Promise.all(strategies.map(async (s) => {
                    try {
                        const loc = s.gen(failing_label);
                        const [count, visible] = await Promise.all([
                            loc.count(),
                            loc.isVisible({ timeout: 500 }).catch(() => false)
                        ]);
                        return { ...s, found: count > 0, visible, count };
                    } catch {
                        return { ...s, found: false, visible: false, count: 0 };
                    }
                }));

                const winners = results
                    .filter(r => r.found)
                    .sort((a, b) => (b.visible ? 1 : 0) - (a.visible ? 1 : 0) || b.score - a.score);

                if (!winners.length) {
                    return { content: [{ type: "text", text: `❌ No locators found for "${failing_label}"` }] };
                }

                const report = winners.map(w =>
                    `[Score: ${w.score}] ${w.name} (${w.visible ? '✅ Visible' : '⚠️  Hidden'}, Count: ${w.count})\n   → ${w.code(failing_label)}`
                ).join("\n\n");

                return { content: [{ type: "text", text: `═══ CANDIDATES FOUND ═══\n\n${report}` }] };

            } catch (e: any) {
                return { isError: true, content: [{ type: "text", text: `Error: ${e.message}` }] };
            }
        })());
    }
);

server.tool(
    "test_new_locator",
    "Verifies a locator with strict timeout.",
    { full_locator_string: z.string() },
    async ({ full_locator_string }) => {
        return tracker.track("test_new_locator", (async () => {
            try {
                const page = await session.init();
                const normalized = full_locator_string.replace(/^this\.page/, "page");
                if (!normalized.startsWith("page.")) {
                    throw new Error("Locator must start with 'page.' or 'this.page.'");
                }

                const evalFunc = new Function("page", `return ${normalized};`);
                const locator = evalFunc(page);

                await locator.waitFor({ state: "visible", timeout: 3000 });
                const count = await locator.count();

                return {
                    content: [{
                        type: "text",
                        text: `✅ Verified: Element is visible (count: ${count})`
                    }]
                };

            } catch (e: any) {
                return {
                    isError: true,
                    content: [{
                        type: "text",
                        text: `❌ Verification Failed: ${e.message}`
                    }]
                };
            }
        })());
    }
);

server.tool(
    "update_pom_selector",
    "Safely modifies Page Objects using AST with validation and rollback.",
    {
        page_name: z.string().min(1).max(50),
        element_name: z.string().min(1).max(100),
        new_selector_statement: z.string()
            .min(10, "Selector too short")
            .max(500, "Selector too long")
            .refine(
                val => !val.includes("process.") &&
                    !val.includes("require(") &&
                    !val.includes("import ") &&
                    !val.includes("eval(") &&
                    !val.includes("Function(") &&
                    !val.includes("child_process"),
                { message: "⚠️  Unsafe code patterns detected" }
            )
            .refine(
                val => val.trim().startsWith("this.page") || val.trim().startsWith("page."),
                { message: "Selector must start with 'this.page' or 'page.'" }
            )
    },
    async ({ page_name, element_name, new_selector_statement }) => {
        return tracker.track("update_pom_selector", (async () => {
            let backupPath: string | null = null;

            try {
                const pagesDir = path.join(process.cwd(), "pages");
                const files = await fsPromises.readdir(pagesDir);
                const targetFile = files.find(f =>
                    f.toLowerCase().includes(page_name.toLowerCase()) && f.endsWith('.ts')
                );

                if (!targetFile) {
                    throw new Error(`❌ Page Object file for '${page_name}' not found in pages/`);
                }

                const filePath = path.join(pagesDir, targetFile);
                backupPath = `${filePath}.backup.${Date.now()}`;
                await fsPromises.copyFile(filePath, backupPath);
                const project = new Project({
                    manipulationSettings: { quoteKind: QuoteKind.Single },
                    skipAddingFilesFromTsConfig: true
                });

                const sourceFile = project.addSourceFileAtPath(filePath);
                const classDec = sourceFile.getClasses().find(c =>
                    c.getName()?.toLowerCase() === page_name.toLowerCase()
                );

                if (!classDec) {
                    throw new Error(`❌ Class '${page_name}' not found in ${targetFile}`);
                }
                let modified = false;
                const getter = classDec.getGetAccessor(element_name);
                if (getter) {
                    getter.setBodyText(`return ${new_selector_statement};`);
                    modified = true;
                }
                if (!modified) {
                    const prop = classDec.getProperty(element_name);
                    if (prop) {
                        prop.setInitializer(new_selector_statement);
                        modified = true;
                    }
                }

                if (!modified) {
                    throw new Error(`❌ Element '${element_name}' not found in class '${page_name}'`);
                }
                const diagnostics = sourceFile.getPreEmitDiagnostics();
                if (diagnostics.length > 0) {
                    const errors = diagnostics.map(d => d.getMessageText()).join("\n");
                    throw new Error(`❌ TypeScript errors:\n${errors}`);
                }
                await sourceFile.save();
                await fsPromises.unlink(backupPath).catch(() => { });

                return {
                    content: [{
                        type: "text",
                        text: `✅ AST Update Successful\n\n📄 File: ${targetFile}\n🎯 Element: ${element_name}\n🔧 New Selector: ${new_selector_statement}`
                    }]
                };

            } catch (e: any) {
                if (backupPath) {
                    const originalPath = backupPath.replace(/\.backup\.\d+$/, '');
                    await fsPromises.copyFile(backupPath, originalPath).catch(() => { });
                    await fsPromises.unlink(backupPath).catch(() => { });
                }

                return {
                    isError: true,
                    content: [{
                        type: "text",
                        text: `❌ Code Modification Failed\n\nError: ${e.message}\n\nFile has been restored from backup.`
                    }]
                };
            }
        })());
    }
);

server.tool(
    "perform_pom_action",
    "Executes Page Object Model actions with screenshot on failure.",
    {
        action: z.enum(["navigate", "click", "type", "select", "verify", "check"]),
        page_class: z.string(),
        method_or_element: z.string(),
        args: z.array(z.string()).optional()
    },
    async ({ action, page_class, method_or_element, args }) => {
        return tracker.track("perform_pom_action", (async () => {
            try {
                await session.init();
                const normalized = page_class.charAt(0).toLowerCase() + page_class.slice(1);
                const pageObj = session.pages[normalized];

                if (!pageObj) {
                    throw new Error(`Page Object '${page_class}' not found. Available: ${Object.keys(session.pages).join(', ')}`);
                }
                if (typeof pageObj[method_or_element] === 'function') {
                    await pageObj[method_or_element](...(args || []));
                    return { content: [{ type: "text", text: `✅ Method ${method_or_element}() executed successfully` }] };
                }
                const el = pageObj[method_or_element];
                if (!el) {
                    throw new Error(`Element '${method_or_element}' not found in ${page_class}`);
                }

                switch (action) {
                    case "click":
                        await el.click();
                        break;
                    case "type":
                        await el.fill(args?.[0] || "");
                        break;
                    case "verify":
                        await expect(el).toBeVisible();
                        break;
                    case "check":
                        await el.check();
                        break;
                    case "select":
                        await el.selectOption(args?.[0] || "");
                        break;
                }

                return { content: [{ type: "text", text: `✅ Action '${action}' on '${method_or_element}' completed` }] };

            } catch (e: any) {
                const shot = await ScreenshotManager.capture(session.page, "action_fail");
                const content: any[] = [{ type: "text", text: `❌ Action Failed: ${e.message}` }];

                if (shot) {
                    const base64 = await ScreenshotManager.readAsBase64(shot.path);
                    if (base64) {
                        content.push({ type: "image", data: base64, mimeType: "image/jpeg" });
                    }
                }

                return { isError: true, content };
            }
        })());
    }
);

server.tool(
    "automatic_cleanup_and_retry",
    "Executes cleanup with fast in-process method or falls back to script.",
    { module: z.string(), entity_id: z.string() },
    async ({ module, entity_id }) => {
        return tracker.track("automatic_cleanup_and_retry", (async () => {
            const CLEANUP_TIMEOUT = 30000;

            try {
                await session.init();
                const pageObj = session.pages[`${module.toLowerCase()}Page`];
                if (pageObj && typeof pageObj.deleteEntity === 'function') {
                    await Promise.race([
                        pageObj.deleteEntity(entity_id),
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('In-process cleanup timeout')), CLEANUP_TIMEOUT)
                        )
                    ]);

                    return {
                        content: [{
                            type: "text",
                            text: `✅ FAST CLEANUP SUCCESS\n\nModule: ${module}\nEntity: ${entity_id}\nMethod: In-Process (Page Object)`
                        }]
                    };
                }
                const scriptName = `${module}_Cleaning.spec.ts`;
                const scriptPath = path.join(TESTS_CLEAN_DIR, scriptName);

                const scriptExists = await fsPromises.access(scriptPath).then(() => true).catch(() => false);
                if (!scriptExists) {
                    throw new Error(`Cleanup script not found: ${scriptName}`);
                }

                const cmd = `npx playwright test "${scriptPath}" --project=Cleanup --workers=1 --reporter=list`;
                const startTime = Date.now();

                const { stdout, stderr } = await execAsync(cmd, {
                    timeout: CLEANUP_TIMEOUT,
                    maxBuffer: 1024 * 1024
                });

                const duration = Date.now() - startTime;

                return {
                    content: [{
                        type: "text",
                        text: `✅ LEGACY CLEANUP SUCCESS\n\nModule: ${module}\nEntity: ${entity_id}\nDuration: ${(duration / 1000).toFixed(2)}s\n\nOutput:\n${stdout.slice(0, 800)}`
                    }]
                };

            } catch (e: any) {
                return {
                    isError: true,
                    content: [{
                        type: "text",
                        text: `❌ CLEANUP FAILED\n\nModule: ${module}\nEntity: ${entity_id}\n\nError: ${e.message}`
                    }]
                };
            }
        })());
    }
);

server.tool(
    "get_page_health",
    "Diagnoses page readiness: Network, DOM, and visual state.",
    {},
    async () => {
        return tracker.track("get_page_health", (async () => {
            try {
                const page = await session.init();

                let networkStatus = "IDLE";
                try {
                    await page.waitForLoadState("networkidle", { timeout: 2000 });
                } catch {
                    networkStatus = "BUSY";
                }

                const domStatus = await page.evaluate(() => {
                    if (document.querySelector(".oxd-loading-spinner")) return "SPINNER";
                    if (document.readyState !== "complete") return "LOADING";
                    return "READY";
                });

                const url = page.url();
                const title = await page.title().catch(() => "Unknown");

                const isReady = domStatus === "READY" && networkStatus === "IDLE";

                return {
                    content: [{
                        type: "text",
                        text: `═══ PAGE HEALTH ═══\n\nStatus: ${isReady ? "🟢 READY" : "🟠 BUSY"}\nNetwork: ${networkStatus}\nDOM: ${domStatus}\nURL: ${url}\nTitle: ${title}`
                    }]
                };

            } catch (e: any) {
                return {
                    isError: true,
                    content: [{ type: "text", text: `Health check failed: ${e.message}` }]
                };
            }
        })());
    }
);

server.tool(
    "cleanup_sandbox",
    "Clears the selfheal sandbox directory.",
    {},
    async () => {
        return tracker.track("cleanup_sandbox", (async () => {
            try {
                await fsPromises.rm(SANDBOX_DIR, { recursive: true, force: true });
                await fsPromises.mkdir(SANDBOX_DIR, { recursive: true });
                return { content: [{ type: "text", text: "✅ Sandbox cleared successfully" }] };
            } catch (e: any) {
                return { isError: true, content: [{ type: "text", text: `Sandbox clear failed: ${e.message}` }] };
            }
        })());
    }
);

server.tool(
    "get_server_metrics",
    "Returns server health metrics including active operations and memory usage.",
    {},
    async () => {
        const metrics = tracker.getMetrics();
        const health = await session.getHealthStatus();
        const memUsage = process.memoryUsage();

        return {
            content: [{
                type: "text",
                text: `╔═══ SERVER METRICS ═══╗

⚙️  Operations:
  - Active: ${metrics.activeOperations}
  - Shutting Down: ${metrics.isShuttingDown ? 'YES' : 'NO'}

🌐 Browser Session:
  - Healthy: ${health.healthy ? '✅' : '❌'}
  - Browser Connected: ${health.browserConnected ? '✅' : '❌'}
  - Page Alive: ${health.pageAlive ? '✅' : '❌'}

💾 Memory:
  - RSS: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB
  - Heap Used: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
  - Heap Total: ${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB

⏱️  Uptime: ${(process.uptime() / 60).toFixed(2)} minutes

${metrics.operations.length > 0 ? `\n📋 Active Operations:\n${metrics.operations.map(op => `  - ${op.name} (${(op.duration / 1000).toFixed(1)}s)`).join('\n')}` : ''}
╚═══════════════════════╝`
            }]
        };
    }
);

let isShuttingDown = false;

async function handleShutdown(signal: string): Promise<void> {
    if (isShuttingDown) {
        console.error(`[Shutdown] Already in progress, ignoring ${signal}`);
        return;
    }
    isShuttingDown = true;

    try {
        await tracker.gracefulShutdown(signal, 10000);
        await session.close();
        console.error("[Shutdown] ✅ Complete");
        process.exit(0);
    } catch (err) {
        console.error("[Shutdown] Error:", err);
        process.exit(1);
    }
}
process.on("SIGINT", () => handleShutdown("SIGINT (Ctrl+C)"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("uncaughtException", (err, origin) => {
    console.error("╔═══════════════════════════════════════╗");
    console.error("║   UNCAUGHT EXCEPTION - FATAL ERROR    ║");
    console.error("╚═══════════════════════════════════════╝");
    console.error("Origin:", origin);
    console.error("Error:", err);

    handleShutdown("UNCAUGHT_EXCEPTION").finally(() => process.exit(1));
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("╔═══════════════════════════════════════╗");
    console.error("║   UNHANDLED PROMISE REJECTION         ║");
    console.error("╚═══════════════════════════════════════╝");
    console.error("Reason:", reason);

    handleShutdown("UNHANDLED_REJECTION").finally(() => process.exit(1));
});

async function main() {
    console.error("╔═══════════════════════════════════════════════════════╗");
    console.error("║  OrangeHRM Auto-Healer MCP Server v5.0.0 (Enterprise) ║");
    console.error("╚═══════════════════════════════════════════════════════╝");
    await initializeDirectories();
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("[Server] ✅ Ready and listening for connections");
}

main().catch(err => {
    console.error("[Fatal] Startup failed:", err);
    process.exit(1);
});
