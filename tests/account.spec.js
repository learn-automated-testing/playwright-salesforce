import { test, expect, } from '@playwright/test';
import LoginPage from "../pages/login.page.js";
import Setup from "../pages/setup.page.js";
import Overview from "../pages/overview.page.js";
import Account from "../pages/accounts.page.js";
import DeleteAccount from "./delete-account.js";
import { fill_In_Combo } from "./functions/functions.js";
//import { v4 as uuidv4 } from 'uuid';
import fs from "fs-extra";

let jsonData = ""; //npx playwright test account.spec.js --project=chromium --headed

let loginPage;
let setup;
let overview;
let account;
let deleteAccount;


test.describe("Testing the accounts functionality", ()=> {
    test.beforeEach(async ({page}) => {
        // Load in the testdat.json file
        jsonData = await fs.readJson("./testdata.json");

      loginPage = new LoginPage(page);
      setup = new Setup(page);
      overview = new Overview(page);
      account = new Account(page);
      deleteAccount = new DeleteAccount(page);
  
      // Navigate to the website
      await page.goto("https://login.salesforce.com/?locale=nl");
      
      // Assertion on the URL
      // const url = "https://login.salesforce.com/?locale=nl";

      // await expect(await page.url()).toContain('login.salesforce');

      // await deleteAccount.initialize()

      // await deleteAccount.deleteAccounts()

    });

    test.only("Creating an account", async ({page, context}) => {

      const browserName = context.browser().browserType().name();

      const fullAccountName = jsonData.accounts.input.account1 + "_" + browserName;

    // Actual login of Salseforce trial
    await loginPage.login_Salesforce(
      process.env.SALESFORCE_USERNAME,
      process.env.SALESFORCE_PASSWORD
    );

    // Click on the App Launcher
    await setup.click_AppLauncher();
    
    // Click on Service
    await setup.click_Service();

    // Clicking on the Accounts button
    await overview.click_AccountsButton();

    // Click the New button to create a new account
    await account.click_NewButton();

    // Fill in the new account's details
    // Filling in details not inside of a (combobox) dropdown menu
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

    // Fill in the new account's details
    // Filling in details inside of a (combobox) dropdown menu
    // Filling in the associated TYPE of account
    await fill_In_Combo(
      page,
      jsonData.accounts.input.labelTypeOfAccount,
      jsonData.accounts.input.typeOfAccount
    );

    // Fill in the new account's details
    // Filling in details inside of a (combobox) dropdown menu
    // Filling in the associated INDUSTRY of account
    await fill_In_Combo(
      page,
      jsonData.accounts.input.labelTypeOfIndustry,
      jsonData.accounts.input.typeOfIndustry
    );

    // Fill in the new account's details
    // Filling in details inside of a (combobox) dropdown menu
    // Filling in the RATING of the account
    await fill_In_Combo(
      page,
      jsonData.accounts.input.labelOfRating,
      jsonData.accounts.input.typeOfRating
    );

    // Fill in the new account's details
    // Filling in details inside of a (combobox) dropdown menu
    // Filling in the OWNERSHIP of the account
    await fill_In_Combo(
      page,
      jsonData.accounts.input.labelOfOwnership,
      jsonData.accounts.input.typeOfOwnership
    );

    // Fill in the address information
    // There are two types of addresses: BILLING ADDRESS and SHIPPING ADDRESS
    // Here the BILLING ADDRESS is requiered
    await account.fill_In_AddressInformation(
      jsonData.accounts.billingAddress.billingAddress,
      jsonData.accounts.billingAddress.address,
      // jsonData.accounts.billingAddress.postalCode,
      // jsonData.accounts.billingAddress.city,
      jsonData.accounts.billingAddress.province,
      jsonData.accounts.billingAddress.country
    );

    // Fill in the address information
    // There are two types of addresses: BILLING ADDRESS and SHIPPING ADDRESS
    // Here the SHIPPING ADDRESS is requiered
    await account.fill_In_AddressInformation(
      jsonData.accounts.shippingAddress.shippingAddress,
      jsonData.accounts.shippingAddress.address,
      jsonData.accounts.shippingAddress.postalCode,
      jsonData.accounts.shippingAddress.city,
      jsonData.accounts.shippingAddress.province,
      jsonData.accounts.shippingAddress.country
    );

    // Fill in the new account's additional information
    // Filling in details inside of a (combobox) dropdown menu
    // Filling in the CUSTOMER PRIORITY of the account
    await fill_In_Combo(
      page,
      jsonData.accounts.input.labelOfCustomerPriority,
      jsonData.accounts.input.typeOfCustomerPriority
    );

    // Fill in the new account's additional information
    // Filling in details inside of a (combobox) dropdown menu
    // Filling in if the account is ACTIVE or not
    await fill_In_Combo(
      page,
      jsonData.accounts.input.labelOfActive,
      jsonData.accounts.input.typeOfActive
    );

    // Fill in the new account's additional information
    // Filling in details inside of a (combobox) dropdown menu
    // Filling in the SERVICE-LEVEL-AGREEMENT of the account
    await fill_In_Combo(
      page,
      jsonData.accounts.input.labelOfSLA,
      jsonData.accounts.input.typeOfSLA
    );

    // Fill in the new account's additional information
    // Filling in details inside of a (combobox) dropdown menu
    // Filling in if the account can be sold for a higher price
    await fill_In_Combo(
      page,
      jsonData.accounts.input.labelOfUpsellOpportunity,
      jsonData.accounts.input.typeOfUpsellOpportunity
    );

    // Fill in the new account's additional information
    // Filling in details not inside of a (combobox) dropdown menu
    await account.fill_In_additionalInformation(
      jsonData.accounts.input.numberOfLocations,
      jsonData.accounts.input.slaSerialNumber
    );

    // Fill in a description of the new account
    await account.fill_In_A_Description(
      jsonData.accounts.input.accountsDescription
    )


    // Click the Save buton
    await account.click_SaveButton();

    const similarRecordWarning = await page.locator('[title="Close error dialog"]');

    if(await similarRecordWarning.isVisible()) {
      await similarRecordWarning.click();
      await account.click_SaveButton();
    }
    });


    test("Deleting an account", async () => {

    // Click on the Home button
    await overview.click_HomeButton();
    
    // Click on the Actions button
    await overview.click_AccountsButton();

    await account.deleteExistingAccounts(
      jsonData.accounts.input.account1);


    });
});
