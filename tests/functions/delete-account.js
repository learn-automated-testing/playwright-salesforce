import LoginPage from '../pages/login.page.js';
import Setup from '../pages/setup.page.js';
import Overview from '../pages/overview.page.js';
import Account from '../pages/accounts.page.js';
import fs from 'fs-extra';
import { config } from 'dotenv';
config();

class DeleteAccount {

    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.setup = new Setup(page);
        this.overview = new Overview(page);
        this.account = new Account(page); 
        this.jsonData = null;
    }

    async initialize() {
        this.jsonData = await fs.readJson('./testdata.json');
    }

    async deleteAccounts() {
        
        await this.loginPage.login_Salesforce(
            process.env.SALESFORCE_USERNAME,
            process.env.SALESFORCE_PASSWORD
        );

        await this.setup.click_AppLauncher();
        await this.setup.click_Service();
        await this.overview.click_AccountsButton();

       
        await this.account.deleteExistingAccounts(
            this.jsonData.accounts.input.account1
        );
    }
}

export default DeleteAccount; 
