import { expect } from '@playwright/test';

export class SetupPage {
    constructor(page) {
        this.page = page;
        this.appLauncherButton = page.getByRole('button', { name: 'App Launcher' });
        this.searchInput = page.getByPlaceholder('Search apps and items...');
    }

    async click_AppLauncher() {
        try {
            // Wait for the App Launcher to be visible
            await this.appLauncherButton.waitFor({ state: 'visible', timeout: 10000 });
            
            // Click the App Launcher
            await this.appLauncherButton.click();
            
            // Wait for the search input to be visible
            await this.searchInput.waitFor({ state: 'visible', timeout: 5000 });
        } catch (error) {
            console.error('Error clicking App Launcher:', error);
            throw error;
        }
    }

    async navigateToApp(appName) {
        try {
            // Search for the app
            await this.searchInput.fill(appName.toLowerCase());
            
            // Click the app option
            await this.page.getByRole('option', { name: appName }).click();
            
            // Wait for the page to load
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            console.error(`Error navigating to ${appName}:`, error);
            throw error;
        }
    }
} 