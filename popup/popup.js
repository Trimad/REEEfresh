document.getElementById("button-support").addEventListener("click", function (e) {
    chrome.tabs.create({ url: '../oninstall/oninstall.html' })
})

// chrome.tabs.onCreated.addListener(function (tab) {})
let states = {}

document.addEventListener('DOMContentLoaded', () => {
    ; (async () => {
        //Firstly, get the tab ID
        let queryOptions = { active: true, lastFocusedWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
        let id = tab.id;
        //Secondly, check if the loaded state is an empty object
        let temp = await loadState(states[id]);
        if (Object.keys(temp).length !== 0) states = { ...states[id], ...temp };
        //Thirdly, if the loaded state was an empty object, initialize it
        states[id] ??= {
            checked: false,
            value: 60,
            salesforcechecked: false,
            salesforcevalue: 60
        }
        //Lastly, update the DOM
        document.getElementById('refresh-tab-checkbox').checked = states[id].checked
        document.getElementById('refresh-tab-seconds').value = states[id].value
        document.getElementById('refresh-salesforce-checkbox').checked = states[id].salesforcechecked
        document.getElementById('refresh-salesforce-seconds').value = states[id].salesforcevalue
    })();

})

// * * * * * * *
// REEEfresh Tab
// * * * * * * *
document.getElementById("refresh-tab-checkbox").addEventListener("change", async function (e) {
    const id = await getTabID()
    states[id] = Object.assign(states[id], {
        checked: this.checked,
        salesforcechecked: false
    })
    document.getElementById("refresh-salesforce-checkbox").checked = false
    update()
})

document.getElementById("refresh-tab-seconds").addEventListener("change", async function (e) {
    const id = await getTabID()
    states[id] = Object.assign(states[id], {
        //value: (this.value == '') ? 0 : this.value
        value: this.value
    })
    document.getElementById("feedback").innerHTML = formatSeconds(this.value)
    update()
})

document.getElementById("refresh-tab-button").addEventListener("click", async function (e) {
    const id = await getTabID()
    states[id] = Object.assign(states[id], {
        checked: document.getElementById("refresh-tab-checkbox").checked,
        value: document.getElementById("refresh-tab-seconds").value
    })
    update()
})

// * * * * * * * * * * *
// REEEfresh Salesforce
// * * * * * * * * * * *
document.getElementById("refresh-salesforce-checkbox").addEventListener("change", async function (e) {
    const id = await getTabID()
    states[id] = Object.assign(states[id], {
        checked: false,
        salesforcechecked: this.checked
    })
    document.getElementById("refresh-tab-checkbox").checked = false
    update()
})

document.getElementById("refresh-salesforce-seconds").addEventListener("change", async function (e) {
    const id = await getTabID()
    states[id] = Object.assign(states[id], {
        //salesforcevalue: (this.value == '') ? 0 : this.value
        salesforcevalue: this.value
    })
    document.getElementById("feedback").innerHTML = formatSeconds(this.value)
    update()
})

document.getElementById("refresh-salesforce-button").addEventListener("click", async function (e) {
    const id = await getTabID()
    states[id] = Object.assign(states[id], {
        salesforcechecked: document.getElementById("refresh-salesforce-checkbox").checked,
        salesforcevalue: document.getElementById("refresh-salesforce-seconds").value
    })
    update()
})

function formatSeconds(d) {
    var h = Math.floor(d / 3600)
    var m = Math.floor(d % 3600 / 60)
    var s = Math.floor(d % 3600 % 60)

    var hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : ""
    var mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : ""
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""

    var output = "Refresh every "
    output += (hDisplay.length > 0) ? hDisplay : ""
    output += (hDisplay.length > 0 && mDisplay.length > 0) ? ", " : ""
    output += (mDisplay.length > 0) ? mDisplay : ""
    output += (mDisplay.length > 0 && sDisplay.length > 0) ? ", " : ""
    output += (sDisplay.length > 0) ? sDisplay : ""
    return output
}

async function update() {

    try {
        await saveState(states);
        const tabId = await getTabID()
        chrome.tabs.sendMessage(tabId, states[tabId]);
    } catch (e) {
        console.warn(e)
    }
}

//Below are all the functions that would otherwise be in shared.js if ES6 imports were working properly:

async function getTabID() {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.query({
                active: true, currentWindow: true
            }, function (tabs) {
                resolve(tabs[0].id)
            })
        } catch (e) {
            reject(e)
        }
    })
}

async function loadState(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, function (value) {
                resolve(value)
            })
        } catch (e) {
            reject(e)
        }
    })
}

async function saveState(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set(key, function () {
                resolve()
            })
        } catch (e) {
            reject(e)
        }
    })
}
