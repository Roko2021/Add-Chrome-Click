chrome.action.onClicked.addListener((tab) => {
    console.log("Extension icon clicked");
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: clickButtons
    });
});

function clickButtons() {
    const firstButtonXPath = '/html/body/app-root/div/app-appointment-page/div/mat-stepper/div/div[2]/div[1]/app-memebers-number/div[2]/div/button';
    const secondButtonXPath = '/html/body/app-root/div/app-appointment-page/div/mat-stepper/div/div[2]/div[1]/app-memebers-number/app-visasys-allert-card/div[2]/div[3]/button';

    console.log("Finding first button using XPath:", firstButtonXPath);
    const firstButton = document.evaluate(firstButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (firstButton) {
        console.log("First button found:", firstButton);
        firstButton.click();
        console.log("First button clicked");
    } else {
        console.error("First button not found");
    }

    setTimeout(() => {
        console.log("Finding second button using XPath:", secondButtonXPath);
        const secondButton = document.evaluate(secondButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (secondButton) {
            console.log("Second button found:", secondButton);
            secondButton.click();
            console.log("Second button clicked");
        } else {
            console.error("Second button not found");
        }
    }, 1000); // Adjust the delay as needed
}