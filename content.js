const DEBUG = true
console.log("content.js loaded")

// var script = document.createElement('script');
// script.type = 'text/javascript';
// script.src = 'https://ajax.googleapis.com/ajax/libs/cesiumjs/1.78/Build/Cesium/Cesium.js';
// document.body.appendChild(script);

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
    var xPaths = [`'//*[@id="xa1gd5fV--"]/button'`,
        `/html/body/div[3]/div/div[1]/div/div/div/div[1]/div[1]/div/div/div[1]/div[2]/div/div/div/div/div/div[2]/button`,
        `//*[@id="brandBand_1"]/div/div/div/div/div[1]/div[2]/div[3]/force-list-view-manager-button-bar/div/div[1]/lightning-button-icon/button`]
    var classes = ["slds-button slds-button_neutral refresh"];

    if (button == null)
        for (x of xPaths) {
            try { button = getElementByXpath(x) } catch (e) { }
            console.log(button)
            if (button) { break }
        }
    if (button == null)
        for (c of classes) {
            try { button = document.getElementsByClassName(c)[0] } catch (e) { }
            console.log(button)
            if (button) { break }
        }

    if (button && message.salesforcechecked) {
        if (DEBUG) console.log("SET INTERVAL TRIGGERED")
        clearInterval(salesforceInterval)
        salesforceSeconds = 0
        salesforceInterval = setInterval(() => {
            salesforceSeconds++
            button.innerHTML = message.salesforcevalue - salesforceSeconds
            if (salesforceSeconds == parseInt(message.salesforcevalue)) { button.click(); salesforceSeconds = 0; console.log("REFRESH TRIGGERED"); }
        }, 1000)
    } else if(button && !message.salesforcechecked){
        if (DEBUG) console.log("CLEAR INTERVAL TRIGGERED")
        button.innerHTML = "🗿"

        clearInterval(salesforceInterval)
        salesforceSeconds = 0
    }

}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
}