import {expect } from '@playwright/test';
import chalk from 'chalk';
import { config } from 'dotenv';
config();



class Account {
  constructor(page) {
    this.page = page;
    this.newButton = page.locator('//a[@title="New"]')
    this.accountName = page.locator('[name="Name"]')
    this.accountNumber = page.locator('[name="AccountNumber"]')
    this.accountSite = page.locator('[name="Site"]')
    this.annualRevenue = page.locator('[name="AnnualRevenue"]')
    this.phone = page.locator('[name="Phone"]')
    this.fax = page.locator('[name="Fax"]')
    this.tickerSymbol = page.locator('[name="TickerSymbol"]')
    this.nameWebsite = page.locator('[name="Website"]')
    this.employees = page.locator('//div[contains(@data-target-selection-name, "NumberOfEmployees")]//input')
    this.sicCode = page.locator('[name="Sic"]')
    this.numberOfLocations = page.locator('//input[@name="NumberofLocations__c"]')
    this.slaSerialNumber = page.locator('//input[@name="SLASerialNumber__c"]')
    this.description = page.locator('//label[contains(text(), "Description")]/..//div/textarea')
    this.saveButton = page.locator('//button[text()= "Save"]')
    this.actionsButton = page.locator('[class="forceVirtualActionMarker forceVirtualAction"]')
    this.deleteAccountButton = page.locator('[data-target-selection-name*="StandardButton.Account.Delete"]')
    this.confirmDeleteAccountButton = page.locator('[class="modal-footer slds-modal__footer"] [title="Delete"]')
    this.accountsButton = page.locator('[title="Accounts"]');
  };

  async deleteExistingAccount(nameAccount) {
    try {
      console.log(chalk.blue(`Attempting to delete account: ${nameAccount}`));
      const accountSelector = `a[title="${nameAccount}"]`;
      const accountName = 'span[title="Account Name"]';
      if(!accountName) {
        await accountsButton.click();
      }
      await this.page.waitForSelector(accountSelector, { visible: true });
      const account = this.page.locator(accountSelector).first();

      // Log the locator to debug
      console.log(chalk.blue(`Locator for the account: ${accountSelector}`));
      console.log(await account.count())
  
      if (await account.isVisible()) {
        console.log(chalk.green(`Account found: ${nameAccount}`));
        await account.click();

        console.log(chalk.blue('Clicking actions button...'));
        await this.actionsButton.first().click();

        console.log(chalk.blue('Clicking delete account button...'));
        await this.deleteAccountButton.first().click();

        console.log(chalk.blue('Clicking confirm delete account button...'));
        await this.confirmDeleteAccountButton.click();

      //  const xButton = await this.page.locator('[title="Close"]');
       // await xButton.click();

        console.log(chalk.green.bold(`Account deletion successful for ${nameAccount}.`));
      } else {
        console.log(chalk.yellow.bold(`Account not found: ${nameAccount}`));
      }
    } catch (error) {
      console.error(chalk.red.bold(`Failed to delete account: ${nameAccount}:`, error));
    }
  }


  
  
  
  

  async click_NewButton() {
  
    // await this.fillnewButton().waitForClickable();
    await this.newButton.click();
  }

  async click_ActionsButton() {
  
    // await this.fillactionsButton().waitForClickable();
    await this.actionsButton.click();
  }

  async click_DeleteAccountButton() {
  
    // await this.filldeleteAccountButton().waitForClickable();
    await this.deleteAccountButton.click();

    // await this.fillconfirmDeleteAccountButton().waitForClickable();
    await this.confirmDeleteAccountButton.click();
  }
  

  async fill_In_Accounts_Information(
    account,
    number,
    site,
    revenue,
    phonenumber,
    fax,
    website,
    tSymbol,
    employees,
    sicCode
  ) {
    // await this.fillaccountName().waitForDisplayed();
    await this.accountName.fill(account);
    await this.accountNumber.fill(number);
    await this.accountSite.fill(site);
    await this.annualRevenue.fill(revenue);
    await this.phone.fill(phonenumber);
    await this.fax.fill(fax);
    await this.nameWebsite.fill(website);
    await this.tickerSymbol.fill(tSymbol);
    await this.employees.fill(employees);
    await this.sicCode.fill(sicCode);
  }

  async fill_In_AddressInformation(
    typeOfAddress,
    street,
    // postalcode,
    // city,
    provincy,
    country
  ) {
    let street_ = await this.page.locator(
      `//*[contains(@data-target-selection-name, "${typeOfAddress}")]//textarea`
    );
    // let postalCode_ = await this.page.locator(
    //   `//*[contains(@data-target-selection-name, "${typeOfAddress}")]//input[@name="postalCode"]`
    // );
    // let city_ = await this.page.locator(
    //   `//*[contains(@data-target-selection-name, "${typeOfAddress}")]//input[@name="city"]`
    // );
    let province_ = await this.page.locator(
      `//*[contains(@data-target-selection-name, "${typeOfAddress}")]//input[@name="province"]`
    );
    let country_ = await this.page.locator(
      `//*[contains(@data-target-selection-name, "${typeOfAddress}")]//input[@name="country"]`
    );

    await street_.fill(street);
    // await postalCode_.fill(postalcode);
    // await city_.fill(city);
    await province_.fill(provincy);
    await country_.fill(country);
  }

  async fill_In_additionalInformation(
    locations,
    slaserialnumber,
    
  ) {

    await this.numberOfLocations.fill(locations);
    await this.slaSerialNumber.fill(slaserialnumber);
  }

  async fill_In_A_Description(accountDescription) {
    await this.description.fill(accountDescription)
  }

  async click_SaveButton() {
    await this.saveButton.click()
  }

}
export default Account;