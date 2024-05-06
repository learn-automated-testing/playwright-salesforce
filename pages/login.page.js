class LoginPage {
    constructor(page){
        this.page = page;
        this.username = page.locator('[id="username"]');
        this.password = page.locator('[id="password"]');
        this.loginButton = page.locator('[type="submit"]');
    }

    async login_Salesforce(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }
}

export default LoginPage;
