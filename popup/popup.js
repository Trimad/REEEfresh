//Regular ES6 imports aren't working, so I'm using this stupid import function instead. 
let module = import("../shared.js").then(shared => {

    let state = {
        checked: false,
        value: null,
        tabId: null,
        salesforcechecked: false,
        salesforcevalue: null,
    }

    document.getElementById("button-support").addEventListener("click", function (e) {
        chrome.tabs.create({ url: '../oninstall/oninstall.html' });
    });

    document.addEventListener('DOMContentLoaded', async () => {

        state = await shared.loadState(state);
        try {
            document.getElementById('refresh-tab-checkbox').checked = state.checked;
            document.getElementById('refresh-tab-seconds').value = state.value;
            document.getElementById('refresh-salesforce-checkbox').checked = state.salesforcechecked;
            document.getElementById('refresh-salesforce-seconds').value = state.salesforcevalue;
            update(state);
        } catch (e) { console.warn(e) }

    })

    async function update() {
        const responseTabID = await shared.getTabID();
        state = Object.assign(state, {
            tabId: responseTabID
        })
        await shared.saveState(state)
        chrome.tabs.sendMessage(responseTabID, state)
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

        document.getElementById("feedback").innerHTML = formatSeconds(this.value)
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
        document.getElementById("feedback").innerHTML = formatSeconds(this.value)
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

    function formatSeconds(d) {
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

});