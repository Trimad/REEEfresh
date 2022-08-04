const DEBUG = true
console.log("content.js loaded")

chrome.runtime.onMessage.addListener(gotMessage)

var salesforceInterval = null
let salesforceSeconds = 0
function gotMessage(message, sender, sendResponse) {
    if (DEBUG) console.log(message, sender, sendResponse)

    //PAGE REFRESH
    if (message.checked) {
        const element = document.getElementById('refresh-page')
        if (element) element.remove()
        var meta = "<meta http-equiv=\"refresh\" id=\"refresh-page\" content=\"" + message.value + "\">"
        document.head.innerHTML += meta
    } else {
        const element = document.getElementById('refresh-page')
        if (element) { element.remove() }
    }
    // SALESFORCE REFRESH
    var button = null;
    var xPaths = [
        `//*[@id="brandBand_1"]/div/div/div/div/div[1]/div[2]/div[3]/force-list-view-manager-button-bar/div/div[1]/lightning-button-icon/button`//list view
    ]
    var querySelector = [`button[title='Refresh this feed']`]//case chatter
    var classes = [];

    if (button == null)//if a button hasn't been found yet
        for (x of xPaths) {
            try { button = getElementByXpath(x) } catch (e) { }
            if (button) { break }
        }
    if (button == null)//if a button hasn't been found yet
        for (q of querySelector) {
            try { button = document.querySelector(q) } catch (e) { }
            if (button) { break }
        }
    if (button == null)//if a button hasn't been found yet
        for (c of classes) {
            try { button = document.getElementsByClassName(c)[0] } catch (e) { }
            if (button) { break }
        }
    if (button == null) {
        console.warn('NO BUTTON DETECTED')
    } else { console.log(button) }
    clearInterval(salesforceInterval)
    if (button && message.salesforcechecked) {
        if (DEBUG) { console.log("SET INTERVAL TRIGGERED") }
        salesforceSeconds = 0
        salesforceInterval = setInterval(() => {
            salesforceSeconds++
            var date = new Date(0);
            date.setSeconds(message.salesforcevalue - salesforceSeconds)
            var result = date.getMinutes() + 'm\n' + date.getSeconds()+'s'
            button.innerHTML = result
            if (salesforceSeconds == parseInt(message.salesforcevalue)) { button.click(); salesforceSeconds = 0; console.log("REFRESH TRIGGERED"); }
        }, 1000)
    } else if (button && !message.salesforcechecked) {
        if (DEBUG) { console.log("CLEAR INTERVAL TRIGGERED") }
        button.innerHTML = "🛑"

        clearInterval(salesforceInterval)
        salesforceSeconds = 0
    }

}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
}