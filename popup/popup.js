'use strict'

const DEBUG = false
let state = {};

//SUPPORT BUTTON $$$
document.getElementById("button-support").addEventListener("click", function (e) {
    chrome.tabs.create({ url: '../oninstall/oninstall.html' });
});

document.addEventListener('DOMContentLoaded', () => {
    state = Object.assign(state, {
        checked: false,
        value: 0,
        tabId: 0,
        salesforcechecked: false,
        salesforcevalue: 0,
    })
    chrome.storage.sync.get(state, function (items) {
        state.tabId = items.tabId;
        // REFRESH TAB
        state.checked = items.checked;
        state.value = items.value;
        document.getElementById('refresh-tab-checkbox').checked = state.checked;
        document.getElementById('refresh-tab-seconds').value = state.value;
        // REFRESH SALESFORCE
        state.salesforcechecked = items.salesforcechecked;
        state.salesforcevalue = items.salesforcevalue;
        document.getElementById('refresh-salesforce-checkbox').checked = state.salesforcechecked;
        document.getElementById('refresh-salesforce-seconds').value = state.salesforcevalue;
    });
    update()
});

function getTabID() {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.query({
                active: true, currentWindow: true
            }, function (tabs) {
                resolve(tabs[0].id);
            })
        } catch (e) {
            reject(e);
        }
    })
}

async function update() {

    let responseTabID = await getTabID();
    if (DEBUG) console.log(responseTabID);
    state = Object.assign(state, {
        tabId: responseTabID
    })

    try { chrome.storage.sync.set(state) } catch (w) {
        if (DEBUG) console.warn(w)
    }
    try { updateBadge() } catch (w) {
        if (DEBUG) console.warn(w)
    }
    try { chrome.tabs.sendMessage(responseTabID, state) } catch (w) {
        if (DEBUG) console.warn(w)
    }
}

const zeroPad = (num, places) => String(num).padStart(places, '0')

function updateBadge() {
    if (state.checked && !state.salesforcechecked) {
        chrome.action.setBadgeBackgroundColor({
            color: '#FF9999'
        });

        chrome.action.setBadgeText({ tabId: state.tabId, text: state.value })
    }
    if (!state.checked && state.salesforcechecked) {
        chrome.action.setBadgeBackgroundColor({
            color: '#9999FF'
        });
        chrome.action.setBadgeText({ tabId: state.tabId, text: state.salesforcevalue })
    }
    if (!state.salesforcechecked && !state.checked) {
        chrome.action.setBadgeText({ tabId: state.tabId, text: '' })
    }
}

// * * * * * * *
// REEEfresh Tab
// * * * * * * *
document.getElementById("refresh-tab-checkbox").addEventListener("change", function (e) {

    document.getElementById("refresh-salesforce-checkbox").checked = false;

    state = Object.assign(state, {
        checked: this.checked,
        salesforcechecked: false
    })
    update()
})

document.getElementById("refresh-tab-seconds").addEventListener("change", function (e) {

    document.getElementById("feedback").innerHTML = convertSeconds(this.value)
    state = Object.assign(state, {
        value: this.value
    })
    update()
})

document.getElementById("refresh-tab-button").addEventListener("click", function (e) {
    state = Object.assign(state, {
        checked: document.getElementById("refresh-tab-checkbox").checked,
        value: document.getElementById("refresh-tab-seconds").value
    })
    update()
})

// * * * * * * * * * * *
// REEEfresh Salesforce
// * * * * * * * * * * *
document.getElementById("refresh-salesforce-checkbox").addEventListener("change", function (e) {

    document.getElementById("refresh-tab-checkbox").checked = false;
    state = Object.assign(state, {
        checked: false,
        salesforcechecked: this.checked
    })
    update()
});

document.getElementById("refresh-salesforce-seconds").addEventListener("change", function (e) {
    document.getElementById("feedback").innerHTML = convertSeconds(this.value)
    state = Object.assign(state, {
        salesforcevalue: this.value
    })
    update();
})

document.getElementById("refresh-salesforce-button").addEventListener("click", function (e) {
    state = Object.assign(state, {
        salesforcechecked: document.getElementById("refresh-salesforce-checkbox").checked,
        salesforcevalue: document.getElementById("refresh-salesforce-seconds").value
    })
    update()
});

function convertSeconds(d) {
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    var output = "Refresh every "
    output += (hDisplay.length > 0) ? hDisplay : ""
    output += (hDisplay.length > 0 && mDisplay.length > 0) ? ", " : ""
    output += (mDisplay.length > 0) ? mDisplay : ""
    output += (mDisplay.length > 0 && sDisplay.length > 0) ? ", " : ""
    output += (sDisplay.length > 0) ? sDisplay : ""
    return output;
}