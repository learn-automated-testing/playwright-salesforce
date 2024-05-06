import { test, expect } from '@playwright/test';
import LoginPage from '../pages/login.page.js';
import Setup from '../pages/setup.page.js';
import Overview from '../pages/overview.page.js';
import fs from "fs-extra";
import { config } from 'dotenv';
config();

let jsonData = ""; // npx playwright test salesforce-login.spec.js --project=chromium


test.describe('Login functionality', ()=> {
    test.beforeEach(async ({page}) => {
        // Load in the testdat.json file
        jsonData = await fs.readJson("./testdata.json");
    
        // Navigate to the website
        await page.goto("https://login.salesforce.com/?locale=nl");
        
        // Assertion on the URL
        const url = "https://login.salesforce.com/?locale=nl";

        await expect(url).toContain('login.salesforce');
      });

    
    test('Login', async ({ page }) => {

        const loginPage = new LoginPage(page);
        const setup = new Setup(page);

        // await page.goto("https://login.salesforce.com/?locale=nl"); 
    
        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/Inloggen/);
    
        await loginPage.login_Salesforce(
            process.env.SALESFORCE_USERNAME,
            process.env.SALESFORCE_PASSWORD
        );
    
        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/Lightning Experience/);

        // Click on the App Launcher
        await setup.click_AppLauncher();
 
        // Click on Service
        await setup.click_Service();

         // Verifying of the successful login
        const quarterly_performance = page.locator('[title="Quarterly Performance"]');
    
        await expect(quarterly_performance).toHaveText(
            jsonData.loggingIn.output.quarterlyPerformance
        );
    });


    test("Logging out", async ({page}) => {

        const loginPage = new LoginPage(page);
        const setup = new Setup(page);
        const overview = new Overview(page);


        // await page.goto("https://login.salesforce.com/?locale=nl"); 
    
        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/Inloggen/);
    
        await loginPage.login_Salesforce(
            process.env.SALESFORCE_USERNAME,
            process.env.SALESFORCE_PASSWORD
        );
    
        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/Lightning Experience/);
    
        // Click the View Profile button
        await setup.click_ViewProfileButton();
    
        // Select Log Out
        await setup.click_LogoutButton();
        
        // Verify the succesful logout
        const inloggen = await page.locator('[id="Login"]');
    
        await expect(inloggen).toHaveText(
          jsonData.loggingIn.output.inloggen
        )
    
      });


      test("Logging in with invalid credentials - Invalid password", async ({page}) => {

        const loginPage = new LoginPage(page);
    
        // Actual login of Salseforce trial
        await loginPage.login_Salesforce(
          process.env.SALESFORCE_USERNAME,
          jsonData.loggingIn.login.invalidPassword
         );
    
        const error = await page.locator('[id="error"]')
        
        await expect(error).toHaveText(
          jsonData.loggingIn.output.loginError
        )
    
      });
    
      test("Logging in with invalid credentials - Invalid email", async ({page}) => {

        const loginPage = new LoginPage(page);
        
        // Actual login of Salseforce trial
        await loginPage.login_Salesforce(
          jsonData.loggingIn.login.invalidEmail,
          process.env.SALESFORCE_PASSWORD
         );
    
        const error = await page.locator('[id="error"]') //Please check your username and password. If you still can't log in, contact your Salesforce administrator.
    
        await expect(error).toHaveText(
          jsonData.loggingIn.output.loginError
        )
    
      });


});