import { chromium } from 'playwright';
import fs from 'fs-extra';
import { config } from 'dotenv';
import LoginPage from "../pages/login.page.js";
import Setup from "../pages/setup.page.js";
config();

let loginPage;
let setup;


(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://login.salesforce.com/?locale=nl');

  
    loginPage = new LoginPage(page);
    setup = new Setup(page);

   // Actual login of Salesforce trial
   await loginPage.login_Salesforce(
    process.env.SALESFORCE_USERNAME,
    process.env.SALESFORCE_PASSWORD
  );


  
    // Click on the App Launcher
    await setup.click_AppLauncher();
   

  // Save storage state
  await context.storageState({ path: 'authState.json' });

  await browser.close();
})();
