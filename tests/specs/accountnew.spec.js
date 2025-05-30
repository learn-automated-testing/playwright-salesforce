import { test, expect, chromium } from '@playwright/test';
import LoginPage from "../pages/login.page.js";
import Setup from "../pages/setup.page.js";
import Overview from "../pages/overview.page.js";
import Account from "../pages/accounts.page.js";
import { fill_In_Combo } from "../functions/functions.js";
import fs from "fs-extra";
import { getSalesforceAccessToken } from '../../salesforceAuth.js';

let jsonData = "";
let loginPage;
let setup;
let overview;
let account;
let browser;
let context;
let page;
let salesforceApiCredentials;

test.describe("Testing the accounts functionality", () => {

  test.beforeAll(async () => {
    try {
      // Get Salesforce API credentials
      salesforceApiCredentials = await getSalesforceAccessToken();
      if (!salesforceApiCredentials || !salesforceApiCredentials.access_token || !salesforceApiCredentials.instance_url) {
        throw new Error('Did not receive valid Salesforce credentials for API tests.');
      }
      console.log('Salesforce API credentials obtained for Playwright tests.');

      // Load in the testdata.json file
      jsonData = await fs.readJson("./tests/testdata/testdata-accounts.json");
      browser = await chromium.launch();
      
      // Create a new context
      context = await browser.newContext();
      page = await context.newPage();

      // Set the authentication cookie
      const domain = new URL(salesforceApiCredentials.instance_url).hostname;
      console.log('Setting authentication cookie for domain:', domain);
      
      await context.addCookies([{
        name: 'sid',
        value: salesforceApiCredentials.access_token,
        domain: domain,
        path: '/',
        httpOnly: true,
        secure: true
      }]);

      loginPage = new LoginPage(page);
      setup = new Setup(page);
      overview = new Overview(page);
      account = new Account(page);

      // Navigate to the Salesforce instance URL
      console.log('Navigating to:', salesforceApiCredentials.instance_url);
      await page.goto(salesforceApiCredentials.instance_url);
      
      // Wait for the page to load
      console.log('Waiting for page to load...');
      await page.waitForLoadState('networkidle');

      // Check if we're on the login page
      const loginForm = page.locator('form[name="loginForm"]');
      if (await loginForm.isVisible()) {
        console.log('Still on login page - authentication might have failed');
        throw new Error('Authentication failed - still on login page');
      }

      // Verify we're authenticated by checking for the App Launcher
      console.log('Checking for App Launcher...');
      const appLauncher = page.locator('button[aria-label="App Launcher"]');
      try {
        await appLauncher.waitFor({ state: 'visible', timeout: 30000 }); // Increased timeout to 30 seconds
        console.log('App Launcher found - authentication successful');
      } catch (error) {
        console.log('Current URL:', await page.url());
        console.log('Page content:', await page.content());
        throw new Error('App Launcher not found - authentication might have failed');
      }
      
      // Click on the App Launcher
      await setup.click_AppLauncher();

      // Click on Service
      await setup.click_Service();
    } catch (error) {
      console.error('Failed to authenticate with Salesforce before tests:', error.message);
      process.exit(1); // Exit if authentication fails, as tests won't run without it
    }
  });

  test.afterAll(async () => {
    await context.close();
    await browser.close();
  });

  test("Create an account", async ({context, browserName}) => {
   
    console.log(browserName)
    const fullAccountName = `${jsonData.accounts.input.account1}_${browserName}`;

    // Clicking on the Accounts button
    await overview.click_AccountsButton();

    // Click the New button to create a new account
    await account.click_NewButton();

    // Fill in the new account's details
    await account.fill_In_Accounts_Information(
      fullAccountName,
      jsonData.accounts.input.accountNumber,
      jsonData.accounts.input.accountSite,
      jsonData.accounts.input.annualRevenue,
      jsonData.accounts.input.phonenumber,
      jsonData.accounts.input.fax,
      jsonData.accounts.input.website,
      jsonData.accounts.input.tickerSymbol,
      jsonData.accounts.input.employees,
      jsonData.accounts.input.sicCode
    );

    // Fill in the new account's details inside of combobox dropdown menus
    await fill_In_Combo(page, jsonData.accounts.input.labelTypeOfAccount, jsonData.accounts.input.typeOfAccount);
    await fill_In_Combo(page, jsonData.accounts.input.labelTypeOfIndustry, jsonData.accounts.input.typeOfIndustry);
    await fill_In_Combo(page, jsonData.accounts.input.labelOfRating, jsonData.accounts.input.typeOfRating);
    await fill_In_Combo(page, jsonData.accounts.input.labelOfOwnership, jsonData.accounts.input.typeOfOwnership);

    // Fill in the address information
    await account.fill_In_AddressInformation(
      jsonData.accounts.billingAddress.billingAddress,
      jsonData.accounts.billingAddress.address,
      jsonData.accounts.billingAddress.province,
      jsonData.accounts.billingAddress.country
    );

    await account.fill_In_AddressInformation(
      jsonData.accounts.shippingAddress.shippingAddress,
      jsonData.accounts.shippingAddress.address,
      jsonData.accounts.shippingAddress.province,
      jsonData.accounts.shippingAddress.country
    );

    // Fill in additional information
    await fill_In_Combo(page, jsonData.accounts.input.labelOfCustomerPriority, jsonData.accounts.input.typeOfCustomerPriority);
    await fill_In_Combo(page, jsonData.accounts.input.labelOfActive, jsonData.accounts.input.typeOfActive);
    await fill_In_Combo(page, jsonData.accounts.input.labelOfSLA, jsonData.accounts.input.typeOfSLA);
    await fill_In_Combo(page, jsonData.accounts.input.labelOfUpsellOpportunity, jsonData.accounts.input.typeOfUpsellOpportunity);
    await account.fill_In_additionalInformation(
      jsonData.accounts.input.numberOfLocations,
      jsonData.accounts.input.slaSerialNumber
    );

    // Fill in a description of the new account
    await account.fill_In_A_Description(jsonData.accounts.input.accountsDescription);

    // Click the Save button
    await account.click_SaveButton();

    const similarRecordWarning = page.locator('[title="Close error dialog"]');
    if (await similarRecordWarning.isVisible()) {
      await similarRecordWarning.click();
      await account.click_SaveButton();
    }
  });

  test.skip("Delete an account", async () => {
    const browserName = "chromium";
    const fullAccountName = `${jsonData.accounts.input.account1}_${browserName}`;



    // Clicking on the Accounts button
    await overview.click_AccountsButton();

    console.log('Accounts button clicked.');

    // Attempt to locate the account
    const accountRow = `${fullAccountName}`;

    console.log(accountRow);
   
      // Implement the deletion logic here
      // Assuming deleteExistingAccounts method handles the deletion
      await account.deleteExistingAccount(accountRow);
      

   
      
   
  });

});
