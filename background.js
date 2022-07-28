'use strict';
const DEBUG = true;
if (DEBUG) console.log("background.js loaded")

chrome.runtime.onInstalled.addListener(function (object) {
  chrome.tabs.create({ url: "oninstall/oninstall.html" }, function (tab) {
    if (DEBUG) console.log("Opening oninstall.html");
  });
});

let state = {
  checked: '',
  value: '',
  tabId: '',
  salesforcechecked: '',
  salesforcevalue: '',
};
/**
 * THe purpose of this listener is to restore the state at the end of every page load. 
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tabInfo) {
  if (changeInfo.status == 'complete') {
    if (DEBUG) {
      console.log('complete')
      console.log(`Updated tab: ${tabId}`);
      console.log("Changed attributes: ", changeInfo);
      console.log("New tab Info: ", tabInfo);
    }
    chrome.storage.sync.get(state, function (items) {
      if (DEBUG) console.log(items)
      state.checked = items.checked;
      state.value = items.value;

      state.tabId = tabId;

      state.salesforcechecked = items.salesforcechecked;
      state.salesforcevalue = items.salesforcevalue;

      chrome.tabs.sendMessage(state.tabId, state)

    });
  }
})
