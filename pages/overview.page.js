class Overview {
    constructor(page){
        
        this.page = page;
        this.viewProfileButton = page.locator('[class*="userProfile-button"]');
        this.logoutButton = page.locator('[href="/secur/logout.jsp"]');
        
    };


    async click_HomeButton() {

        let test = await page.locator('[href="/lightning/page/home"]');       
        await browser.execute("arguments[0].click();",test)
    }
    
    async click_AccountsButton() {

        let test = await $('[title="Accounts"]');       
        await browser.execute("arguments[0].click();",test)
    }

    async click_ViewProfileButton() {

        await this.viewProfileButton.click();
    }

    async click_LogoutButton() {

        await this.logoutButton.click();
    }


}
export default Overview;