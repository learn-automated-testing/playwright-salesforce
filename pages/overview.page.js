class Overview {
    constructor(page){
        
        this.page = page;
        this.viewProfileButton = page.locator('[class*="userProfile-button"]');
        this.logoutButton = page.locator('[href="/secur/logout.jsp"]');
        this.accountsButton = page.locator('[title="Accounts"]');
        
    };


    async click_HomeButton() {

        let test = await page.locator('[href="/lightning/page/home"]');       
        await test.click();
    }
    
    async click_AccountsButton() {

        // let test = await page.locator('[title="Accounts"]');       
        await this.accountsButton.click();
    }

    async click_ViewProfileButton() {

        await this.viewProfileButton.click();
    }

    async click_LogoutButton() {

        await this.logoutButton.click();
    }


}
export default Overview;