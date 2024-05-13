async function fill_In_Combo(page, label, typeOfAccount) {
    
    let type = await page.locator(`//label[text()[contains(.,"${label}")]]/../div/lightning-base-combobox/div//button`);

    // await type.scrollIntoView();
    await type.click(); 
    
    let typeAccount = await page.locator(`[title="${typeOfAccount}"]`)

    // await typeAccount.waitForDisplayed();
    // await typeAccount.scrollIntoView()
    await typeAccount.click()

    // await browser.keys(comboElement);
    // await browser.keys("\uE007");
}

// $('//label[text()[contains(.,"Type")]]/../div/lightning-base-combobox/div//button').click()

export { fill_In_Combo }