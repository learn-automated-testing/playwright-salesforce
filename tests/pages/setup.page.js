class Setup {
   constructor(page) {

    this.page = page;
    this.applauncher = page.locator('[class*="appLauncher"]');
    this.service = page.locator('//p[text()="Service"]');
    this.viewProfileButton = page.locator('[class*="userProfile-button"]');
    this.logoutButton = page.locator('[href="/secur/logout.jsp"]');
    };
  
    async click_AppLauncher() {
  
      await this.applauncher.click();
    }
  
    async click_Service() {

    await this.service.click();
  }

  async click_ViewProfileButton() {

    await this.viewProfileButton.click();
}

async click_LogoutButton() {

    await this.logoutButton.click();
}
  
  }

  


  export default Setup;