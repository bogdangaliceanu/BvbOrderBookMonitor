async function monitorAsk() {
    while (true) {
        try {
            keepShowingNotifications = true;
            switchToTab(['Tranzactionare', 'Trading']);
        
            const currentMinAsk = await getMinAskFromOrderBook();
            if (currentMinAsk <= askThreshold) {
                while (keepShowingNotifications) {
                    const notification = new Notification(`${ticker} is at or below ask threshold!`);
                    notification.onclick = () => { keepShowingNotifications = false; }
                    notification.onclose = () => { keepShowingNotifications = false; }
                    await delay(10000);
                }
            }
        
            await delay(getRandomInt(60000, 120000));
            switchToTab(['Stiri', 'News']);
            await delay(getRandomInt(60000, 120000));
        }
        catch (err) {
            console.error(err);
        }
    }
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function switchToTab(possibleNames) {
    for (let tabName of possibleNames) {
        const tab = document.querySelector(`input[value="${tabName}"]`);
        if (tab) {
            tab.click();
            return;
        }
    }

    throw new Error(`Could not find a tab matching any of the possible names ${possibleNames}`);
}

async function getMinAskFromOrderBook() {
    await delay(5000); // make sure the date on the trading tab finishes loading
    const orderBookTable = document.getElementById('gvMMOrderBook');
    const minAsk = Number(orderBookTable.tBodies[0].rows[0].cells[3].innerText.replace(',', '.'));
    console.debug(`current min ask: ${minAsk}`);
    return minAsk;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const urlSearchParams = new URLSearchParams(window.location.search);
const askThreshold = Number(urlSearchParams.get('askThreshold'));
const ticker = urlSearchParams.get('s');

console.debug(`ask threshold from url: ${askThreshold}`);

monitorAsk();
