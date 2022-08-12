'use strict'
const DEBUG = false
import { loadState } from './shared.js'

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: "oninstall/oninstall.html" }, function (tab) {
  })
})

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.clear()
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (DEBUG) console.info(tab);
  try {
    if (changeInfo.status == 'complete') {
      (async () => {
        let states = {}
        await loadState(states[tabId]).then(state => {
          if (state[tabId]) {
            chrome.tabs.sendMessage(tabId, state[tabId]);
            if (DEBUG) console.log(tabId, state)
            updateBadge(tabId, state[tabId]);
          }

        });
      })();
    }
  } catch (w) { console.warn(w) }
})

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (DEBUG) console.log(changes);
  try {
    let tabId = parseInt(Object.keys(changes)[0]);
    let state = changes[tabId].newValue
    if (state) { updateBadge(tabId, state) }

  } catch (w) { console.warn(w) }
});

async function updateBadge(tabId, state) {

  try {
    if (state.checked && !state.salesforcechecked && state.value) {

      chrome.action.setBadgeBackgroundColor({
        color: '#FF9999'
      });

      chrome.action.setBadgeText({ tabId: tabId, text: state.value.toString() })
    }
    if (!state.checked && state.salesforcechecked && state.salesforcevalue) {
      chrome.action.setBadgeBackgroundColor({
        color: '#9999FF'
      });
      chrome.action.setBadgeText({ tabId: tabId, text: state.salesforcevalue.toString() })
    }
    if (!state.salesforcechecked && !state.checked) {
      chrome.action.setBadgeText({ tabId: tabId, text: '' })
    }
  } catch (e) { console.warn(e) }
}