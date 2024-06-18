import { test, expect, chromium } from '@playwright/test';
import LoginPage from "../pages/login.page.js";
import Setup from "../pages/setup.page.js";
import Overview from "../pages/overview.page.js";
import Account from "../pages/accounts.page.js";
import { fill_In_Combo } from "../functions/functions.js";
import fs from "fs-extra";

let jsonData = "";
let loginPage;
let setup;
let overview;
let account;
let browser;
let context;
let page;

test.describe("Testing the accounts functionality", () => {

  test.beforeAll(async () => {
    // Load in the testdata.json file
    jsonData = await fs.readJson("./tests/testdata/testdata-accounts.json");
    const storageState = await fs.readJson('authState.json');
    browser = await chromium.launch();
    context = await browser.newContext({ storageState: 'authState.json' });
    page = await context.newPage();

    loginPage = new LoginPage(page);
    setup = new Setup(page);
    overview = new Overview(page);
    account = new Account(page);

    // Navigate to the website

    await page.goto("https://login.salesforce.com/?locale=nl");

    // Assertion on the URL
    const url = "https://login.salesforce.com/?locale=nl";
    expect(url).toContain('login.salesforce');

    // Actual login of Salesforce trial
    await loginPage.login_Salesforce(
      process.env.SALESFORCE_USERNAME,
      process.env.SALESFORCE_PASSWORD
    );

    // Click on the App Launcher
    await setup.click_AppLauncher();

    // Click on Service
    await setup.click_Service();
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

  test("Delete an account", async () => {
    const browserName = "chromium";
    const fullAccountName = `${jsonData.accounts.input.account1}_${browserName}`;



    // Clicking on the Accounts button
    await overview.click_AccountsButton();

    console.log('Accounts button clicked.');

    // Attempt to locate the account
    const accountRow = page.locator(`a[title="${fullAccountName}"`);
   
      // Implement the deletion logic here
      // Assuming deleteExistingAccounts method handles the deletion
      await account.deleteExistingAccount(fullAccountName);

   
      
   
  });

});
