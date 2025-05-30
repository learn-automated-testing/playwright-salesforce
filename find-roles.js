import { chromium } from '@playwright/test';

async function findRoles() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to your Salesforce instance
  await page.goto('https://learnautomatedtesting.my.salesforce.com');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Find all elements with roles
  const roles = await page.evaluate(() => {
    const elements = document.querySelectorAll('[role]');
    return Array.from(elements).map(el => ({
      role: el.getAttribute('role'),
      name: el.getAttribute('aria-label') || el.textContent?.trim(),
      tag: el.tagName.toLowerCase(),
      classes: el.className
    }));
  });
  
  console.log('Elements with roles:', roles);
  
  // Find all buttons
  const buttons = await page.getByRole('button').all();
  console.log('Number of buttons found:', buttons.length);
  
  // Find all links
  const links = await page.getByRole('link').all();
  console.log('Number of links found:', links.length);
  
  // Find all options
  const options = await page.getByRole('option').all();
  console.log('Number of options found:', options.length);
  
  await browser.close();
}

findRoles(); 