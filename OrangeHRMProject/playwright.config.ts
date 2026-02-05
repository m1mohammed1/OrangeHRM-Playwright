import { defineConfig, devices } from '@playwright/test';

// --- (نفس القوائم كما هي بدون تغيير) ---
const FOUNDATION_ORDER = [
  '**/PIM_Configuration_Test.spec.ts',
  '**/PIM_Employee_Test.spec.ts',
  '**/Admin_Qualifications_Test.spec.ts',
  '**/Admin_Job_Test.spec.ts',              
  '**/Admin_Organization_Test.spec.ts',     
  '**/Admin_User_Management_Test.spec.ts',  
  '**/Claim_Advanced_Test.spec.ts',
  '**/Claim_Configuration_Test.spec.ts',
  '**/Leave_Entitlements_Test.spec.ts',
  '**/Performance_Configuration_Test.spec.ts',
  '**/Recruitment_Vacancies_Test.spec.ts',
  '**/Time_ProjectInfo_Test.spec.ts'
];

const regression_order = [
  '**/Admin_Configuration_Test.spec.ts',
  '**/Admin_Job_Test.spec.ts',
  '**/Admin_Nationalities_Test.spec.ts',
  '**/Admin_Organization_Test.spec.ts',
  '**/Admin_Qualifications_Test.spec.ts',
  '**/Admin_User_Management_Test.spec.ts',
  '**/Smoke_Authentication_and_Navigation.spec.ts',
  '**/Claim_Advanced_Test.spec.ts',
  '**/Claim_Configuration_Test.spec.ts',
  '**/Claim_EmployeeClaims_Test.spec.ts',
  '**/Claim_Operations_Test.spec.ts',
  '**/Dashboard_Advanced_Test.spec.ts',
  '**/Dashboard_UserActions_Test.spec.ts',
  '**/Dashboard_Widgets_Test.spec.ts',
  '**/Leave_ApplyLeave_Test.spec.ts',
  '**/Leave_Configuration_Test.spec.ts',
  '**/Leave_Entitlements_Test.spec.ts',
  '**/Leave_LeaveList_Test.spec.ts',
  '**/Leave_Operations_Test.spec.ts',
  '**/Leave_Reports_Test.spec.ts',
  '**/Maintenance_AccessRecords_Test.spec.ts',
  '**/Maintenance_Authentication_Test.spec.ts',
  '**/Maintenance_PurgeRecords_Test.spec.ts',
  '**/Maintenance_Safety_Test.spec.ts',
  '**/Performance_Configuration_Test.spec.ts',
  '**/Performance_Evaluation_Test.spec.ts',
  '**/Performance_MyReviews_Test.spec.ts',
  '**/Performance_Reports_Test.spec.ts',
  '**/Performance_Reviews_Test.spec.ts',
  '**/PIM_Configuration_Test.spec.ts',
  '**/PIM_EmployeeDetails_Test.spec.ts',
  '**/PIM_Employee_Test.spec.ts',
  '**/PIM_Reports_Test.spec.ts',
  '**/Recruitment_CandidateWorkflow_Test.spec.ts',
  '**/Recruitment_Candidate_E2E_Test.spec.ts',
  '**/Recruitment_Search_And_Data_Test.spec.ts',
  '**/Recruitment_Vacancies_Test.spec.ts',
  '**/Time_Attendance_Test.spec.ts',
  '**/Time_BusinessLogic_Test.spec.ts',
  '**/Time_Configuration_Test.spec.ts',
  '**/Time_ProjectInfo_Test.spec.ts',
  '**/Time_Reports_Test.spec.ts',
  '**/Time_Timesheets_Test.spec.ts'
];

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // تعديل ذكي: لو على السيرفر استخدم وركر واحد للفاونديشن (سيتم تجاوزه في إعدادات المشروع)، لو محلي استخدم 4 للسرعة
  workers: process.env.CI ? 1 : undefined, 
  outputDir: 'selfheal-process/test-results',
  expect: { timeout: 10000 },

  reporter: [
    ['html', { outputFolder: 'selfheal-process/reports/playwright-report', open: 'never' }],
    ['line'],
    ['allure-playwright']
  ],
  
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 45000,

    headless: true,
    viewport: { width: 1920, height: 1080 },
    launchOptions: {
      args: [      
        "--remote-allow-origins=*",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ]
    }
  },

  projects: [
    // ================================================================
    // 0. Local Development (هذا هو الحل السحري لك)
    // ================================================================
    {
      name: 'Local_Dev', // اسم مميز
      testMatch: '**/*.spec.ts', // يرى كل الملفات بلا استثناء
      // لاحظ: لا يوجد grep هنا، يعني هيشغل أي حاجة
      use: { 
        ...devices['Desktop Chrome'],
        headless: false, // ميزة إضافية: يفتح المتصفح أمامك محلياً لترى المشاكل
        viewport: { width: 1500, height: 800 } 
      },
    },

    // ----------------------------------------------------------------
    // 1. Foundation Project (CI Strict Mode)
    // ----------------------------------------------------------------
    {
      name: 'Foundation',
      testMatch: FOUNDATION_ORDER,
      grep: /@foundation/,
      fullyParallel: false,
      workers: 1,
      use: { ...devices['Desktop Chrome'] },
    },

    // ----------------------------------------------------------------
    // 2. Regression Project (CI Parallel Mode)
    // ----------------------------------------------------------------
    {
      name: 'Regression',
      testMatch: regression_order,
      grep: /@regression/,
      fullyParallel: true,
      use: { ...devices['Desktop Chrome'] },
    },
    
    // ----------------------------------------------------------------
    // 3. Cleanup Project
    // ----------------------------------------------------------------
    {
      name: 'Cleanup',
      testMatch: '**/Clean/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});