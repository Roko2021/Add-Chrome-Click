document.addEventListener('DOMContentLoaded', () => {
    const clickButtonsBtn = document.getElementById('clickButtons');
    const setTimeBtn = document.getElementById('setTime');

    clickButtonsBtn.addEventListener('click', () => {
        console.log("Popup button clicked");
        changeButtonColor(setTimeBtn, 'green'); // تغيير لون الزر إلى الأخضر عند الضغط
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: clickButtons
                }, () => {
                    changeButtonColor(setTimeBtn, 'white'); // إعادة لون الزر إلى الأبيض بعد انتهاء المهمة
                });
            } else {
                console.error("No active tabs found.");
                changeButtonColor(setTimeBtn, 'white');
            }
        });
    });

    setTimeBtn.addEventListener('click', () => {
        changeButtonColor(setTimeBtn, 'red'); // تغيير لون الزر إلى الأحمر عند الضغط

        const timeInput = document.getElementById('time').value;
        const now = new Date();
        const targetTime = new Date();

        const [hours, minutes, seconds] = timeInput.split(':').map(Number);

        targetTime.setHours(hours);
        targetTime.setMinutes(minutes);
        targetTime.setSeconds(seconds);
        targetTime.setMilliseconds(0);

        if (targetTime < now) {
            targetTime.setDate(targetTime.getDate() + 1); // If the time has already passed for today, set for tomorrow
        }

        const timeDifference = targetTime.getTime() - now.getTime();

        if (timeDifference >= 0) {
            setTimeout(() => {
                console.log("Scheduled time reached, running the script");
                changeButtonColor(clickButtonsBtn, 'green'); // تغيير لون الزر إلى الأخضر عند بدء التنفيذ
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length > 0) {
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            function: clickButtons
                        }, () => {
                            changeButtonColor(clickButtonsBtn, 'white'); // إعادة لون الزر إلى الأبيض بعد انتهاء المهمة
                        });
                    } else {
                        console.error("No active tabs found.");
                        changeButtonColor(clickButtonsBtn, 'white');
                    }
                });
            }, timeDifference);
        } else {
            console.error("The specified time is invalid.");
        }
    });
});

function changeButtonColor(button, color) {
    button.style.backgroundColor = color;
}

function clickButtons() {
    const firstButtonXPath = '/html/body/app-root/div/app-appointment-page/div/mat-stepper/div/div[2]/div[1]/app-memebers-number/div[2]/div/button';
    const secondButtonXPath = '/html/body/app-root/div/app-appointment-page/div/mat-stepper/div/div[2]/div[1]/app-memebers-number/app-visasys-allert-card/div[2]/div[3]/button';

    const clickFirstButton = () => {
        console.log("Finding first button using XPath:", firstButtonXPath);
        const firstButton = document.evaluate(firstButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (firstButton) {
            console.log("First button found:", firstButton);
            firstButton.click();
            console.log("First button clicked");
        } else {
            console.error("First button not found");
        }
    };

    const clickSecondButton = () => {
        console.log("Finding second button using XPath:", secondButtonXPath);
        const secondButton = document.evaluate(secondButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (secondButton) {
            console.log("Second button found:", secondButton);
            secondButton.click();
            console.log("Second button clicked");
        } else {
            console.error("Second button not found");
        }
    };

    const startClicking = () => {
        chrome.runtime.sendMessage({ action: 'changeColor', color: 'green' });

        for (let i = 0; i < 12; i++) {
            const randomTime1 = Math.random() * 2000; // توليد وقت عشوائي بين 0 و 2 ثانية
            const randomTime2 = Math.random() * 2000; // توليد وقت عشوائي بين 0 و 2 ثانية

            setTimeout(clickFirstButton, randomTime1); // ضغط الزر الأول بوقت عشوائي
            setTimeout(clickSecondButton, randomTime2); // ضغط الزر الثاني بوقت عشوائي
        }
    };


    startClicking();
}

// Background script or a persistent script to handle the message
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'changeColor') {
        const clickButtonsBtn = document.getElementById('clickButtons');
        const setTimeBtn = document.getElementById('setTime');
        clickButtonsBtn.style.backgroundColor = message.color;
        setTimeBtn.style.backgroundColor = message.color;
    }
});