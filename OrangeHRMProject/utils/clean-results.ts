import * as fs from 'fs';
import * as path from 'path';

const dirsToClean = ['test-results', 'playwright-report', 'evidence/auto-healing'];

dirsToClean.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
        console.log(`Cleaning directory: ${dir}...`);
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`Successfully cleaned ${dir}`);
    } else {
        console.log(`Directory ${dir} already empty or doesn't exist.`);
    }
});
