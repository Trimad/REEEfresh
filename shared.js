async function getTabID() {
    // console.log("got tab ID")
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

async function loadState(key) {
    // console.log("state loaded")
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, function (value) {
                resolve(value);
            });
        } catch (e) {
            reject(e);
        }
    });
};

async function saveState(key) {
    // console.log("state saved")
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set(key, function () {
                resolve();
            });
        } catch (e) {
            reject(e);
        }
    });
};

async function injectScript() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['Scripts/script.js']
    });
    window.close();
}

export { getTabID, loadState, saveState }