class Setup {
   constructor(page) {
    this.page = page;
    // Use role-based selectors
    this.applauncher = page.getByRole('button', { name: 'App Launcher' });
    this.appLauncherSearch = page.getByPlaceholder('Search apps and items...');
    this.accountMenuItem = page.getByRole('option', { name: 'Accounts' });
    this.service = page.getByRole('option', { name: 'Service' });
    this.viewProfileButton = page.getByRole('button', { name: 'View profile' });
    this.logoutButton = page.getByRole('link', { name: 'Log Out' });
   };
  
    async waitForAppLauncher() {
      console.log('Waiting for App Launcher...');
      
      // Try to find the App Launcher with multiple selectors
      const selectors = [
        '[data-aura-class="appLauncher"]',
        'button[aria-label="App Launcher"]',
        '[title="App Launcher"]',
        'button[title="App Launcher"]',
        'button.slds-button[title="App Launcher"]'
      ];

      let appLauncherFound = false;
      for (const selector of selectors) {
        try {
          const element = await this.page.waitForSelector(selector, { timeout: 5000 });
          if (element) {
            console.log(`Found App Launcher with selector: ${selector}`);
            appLauncherFound = true;
            break;
          }
        } catch (error) {
          console.log(`Selector ${selector} not found, trying next...`);
        }
      }

      if (!appLauncherFound) {
        console.log('Taking screenshot of current page state...');
        await this.page.screenshot({ path: 'applauncher-not-found.png' });
        throw new Error('Could not find App Launcher button');
      }

      return appLauncherFound;
    }

    async click_AppLauncher() {
      try {
        // Wait for the page to be fully loaded
        await this.page.waitForLoadState('networkidle');
        console.log('Page loaded');

        // Wait for and find the App Launcher
        await this.waitForAppLauncher();

        // Take a screenshot before click
        await this.page.screenshot({ path: 'before_applauncher_click.png' });
        console.log('Screenshot taken: before_applauncher_click.png');

        // Try multiple click methods
        try {
          // Method 1: Direct click
          await this.applauncher.click();
          console.log('Direct click successful');
        } catch (clickError) {
          console.log('Direct click failed, trying event dispatch');
          try {
            // Method 2: Event dispatch
            await this.page.evaluate(() => {
              const appLauncher = document.querySelector('button[aria-label="App Launcher"]');
              if (appLauncher) {
                appLauncher.dispatchEvent(new MouseEvent('click', { bubbles: true }));
              }
            });
            console.log('Event dispatch successful');
          } catch (eventError) {
            console.log('Event dispatch failed, trying mouse click');
            // Method 3: Mouse click
            const box = await this.applauncher.boundingBox();
            if (box) {
              await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
              await this.page.waitForTimeout(1000);
              await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
              console.log('Mouse click successful');
            }
          }
        }

        // Take a screenshot after click
        await this.page.screenshot({ path: 'after_applauncher_click.png' });
        console.log('Screenshot taken: after_applauncher_click.png');

        // Wait for the search input to be visible
        await this.appLauncherSearch.waitFor({ state: 'visible', timeout: 10000 });
        console.log('App Launcher menu opened');

      } catch (error) {
        console.error('Error clicking App Launcher:', error.message);
        console.log('Current page content:', await this.page.content());
        throw new Error(`Failed to click App Launcher: ${error.message}`);
      }
    }

    async searchAndClickAccount() {
      try {
        // Type 'account' in the search
        await this.appLauncherSearch.fill('account');
        console.log('Typed "account" in search');

        // Wait for and click the Account menu item
        await this.accountMenuItem.waitFor({ state: 'visible', timeout: 10000 });
        await this.accountMenuItem.click();
        console.log('Account menu item clicked');

        // Wait for navigation to complete
        await this.page.waitForURL('**/lightning/o/Account/home');
        console.log('Navigated to Account home');
      } catch (error) {
        console.error('Error searching and clicking Account:', error.message);
        throw new Error(`Failed to search and click Account: ${error.message}`);
      }
    }
  
    async click_Service() {
      try {
        await this.service.waitFor({ state: 'visible', timeout: 10000 });
        await this.service.click();
        console.log('Service clicked successfully');
      } catch (error) {
        console.error('Error clicking Service:', error.message);
        throw new Error(`Failed to click Service: ${error.message}`);
      }
    }

    async click_ViewProfileButton() {
      try {
        await this.viewProfileButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.viewProfileButton.click();
        console.log('View Profile button clicked successfully');
      } catch (error) {
        console.error('Error clicking View Profile:', error.message);
        throw new Error(`Failed to click View Profile: ${error.message}`);
      }
    }

    async click_LogoutButton() {
      try {
        await this.logoutButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.logoutButton.click();
        console.log('Logout button clicked successfully');
      } catch (error) {
        console.error('Error clicking Logout:', error.message);
        throw new Error(`Failed to click Logout: ${error.message}`);
      }
    }

    async navigateToApp(appName) {
      try {
        // Type the app name in the search input
        await this.appLauncherSearch.fill(appName.toLowerCase());
        console.log(`Typed "${appName}" in search`);

        // Wait for and click the app option
        const appOption = this.page.getByRole('option', { name: appName });
        await appOption.waitFor({ state: 'visible', timeout: 10000 });
        await appOption.click();
        console.log(`${appName} option clicked`);

        // Wait for the page to load
        await this.page.waitForLoadState('networkidle');
        console.log(`Navigated to ${appName} page`);
      } catch (error) {
        console.error(`Error navigating to ${appName}:`, error.message);
        throw new Error(`Failed to navigate to ${appName}: ${error.message}`);
      }
    }
}
  
export default Setup;