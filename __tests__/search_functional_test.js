const { openBrowser, goto, write, click, closeBrowser } = require('taiko');

(async () => {
    try {
        await openBrowser();
        await goto("localhost:5000");
        await write("Apple");
        await click("Search");
    } catch (error) {
            console.error(error);
    } finally {
            closeBrowser();
    }
})();