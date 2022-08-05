'use strict'
const DEBUG = true

if (DEBUG) console.log("background.js loaded")
try {
  chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({ url: "oninstall/oninstall.html" }, function (tab) {
      if (DEBUG) console.log("Opening oninstall.html")
    })
  })
} catch (w) { console.warn(w) }

// * * * * * * *
// The purpose of this listener is to restore the state at the end of every page load. 
// * * * * * * *

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {

//   var state = {
//   }

//   if (changeInfo.status == 'complete') {
//     if (DEBUG) {
//       console.log('complete')
//       console.log(`Updated tab: ${tabId}`)
//       console.log("Changed attributes: ", changeInfo)
//       console.log("New tab Info: ", tabInfo)
//     }

//     try {
//       chrome.storage.sync.get(state, function (items) {
//         if (DEBUG) console.log(items)
//         state.checked = items.checked
//         state.value = items.value
//         state.tabId = items.tabId
//         state.salesforcechecked = items.salesforcechecked
//         state.salesforcevalue = items.salesforcevalue

//       })
//     } catch (w) { console.warn(w) }
//     if (DEBUG) console.log(state)
//     try { chrome.tabs.sendMessage(state.tabId, state) } catch (w) { console.warn(w) }
//   }
// })

