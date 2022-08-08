'use strict'

import { loadState } from './shared.js'

const stateSchema = {
  checked: false,
  value: null,
  tabId: null,
  salesforcechecked: false,
  salesforcevalue: null,
}

chrome.runtime.onInstalled.addListener(function (object) {
  chrome.tabs.create({ url: "oninstall/oninstall.html" }, function (tab) {
  })
  try {
    chrome.storage.local.set(stateSchema);
  } catch (w) { console.warn(w) }
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    let state;
    if (changeInfo.status == 'complete') {
      state = await loadState(stateSchema);
      updateBadge(state);
      if (state.tabId) chrome.tabs.sendMessage(state.tabId, state)
    }
  } catch (w) { console.warn(w) }
})

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  try {
    let state;
    state = await loadState(stateSchema);
    updateBadge(state);
    if (state.tabId) chrome.tabs.sendMessage(state.tabId, state)
  } catch (w) { console.warn(w) }
});

async function updateBadge(s) {

  try {
    if (s.checked && !s.salesforcechecked) {

      chrome.action.setBadgeBackgroundColor({
        color: '#FF9999'
      });

      chrome.action.setBadgeText({ tabId: s.tabId, text: s.value })
    }
    if (!s.checked && s.salesforcechecked) {
      chrome.action.setBadgeBackgroundColor({
        color: '#9999FF'
      });
      chrome.action.setBadgeText({ tabId: s.tabId, text: s.salesforcevalue })
    }
    if (!s.salesforcechecked && !s.checked) {
      chrome.action.setBadgeText({ tabId: s.tabId, text: '' })
    }
  } catch (e) { console.warn(e) }
}

// const loadState = async function (key) {
//   return new Promise((resolve, reject) => {
//     try {
//       chrome.storage.local.get(key, function (value) {
//         resolve(value);
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };