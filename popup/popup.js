'use strict'


document.getElementById("button-support").addEventListener("click", function (e) {
  chrome.tabs.create({url: '../support/support.html'});

});

const DEBUG = true
let state = {};

document.addEventListener('DOMContentLoaded', () => {

  state = Object.assign(state, {
    checked: false,
    value: 0,
    tabId: 0,
    salesforcechecked: false,
    salesforcevalue: 0,
  })

  chrome.storage.sync.get(state, function (items) {
    state.checked = items.checked;
    state.value = items.value;
    state.tabId = items.tabId;
    state.salesforcechecked = items.salesforcechecked;
    state.salesforcevalue = items.salesforcevalue;

    // REFRESH TAB
    document.getElementById('checkbox-refresh-tab').checked = state.checked;
    document.getElementById('input-refresh-tab').value = state.value;
    // REFRESH SALESFORCE
    document.getElementById('refresh-salesforce-checkbox').checked = state.salesforcechecked;
    document.getElementById('refresh-salesforce-seconds').value = state.salesforcevalue;
    updateBadge()
  });

});

document.getElementById("checkbox-refresh-tab").addEventListener("change", function (e) {
  state = Object.assign(state, {
    checked: this.checked
  })
  chrome.storage.sync.set(state, () => {
    update()
  })
});

// document.getElementById("input-refresh-tab").addEventListener("change", function (e) {
//   state = Object.assign(state, {
//     value: this.value
//   })
//   chrome.storage.sync.set(state, () => {
//     updatePopup();
//   });
// })

document.getElementById("button-refresh-tab").addEventListener("click", function (e) {
  state = Object.assign(state, {
    checked: document.getElementById("checkbox-refresh-tab").checked,
    value: document.getElementById("input-refresh-tab").value
  })
  chrome.storage.sync.set(state, () => {
    update()
  })
});

function update() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    var currentTab = tabs[0];
    state = Object.assign(state, {
      tabId: currentTab.id
    })
    try { chrome.tabs.sendMessage(currentTab.id, state) } catch (e) {
      console.log(e)
    }
    updateBadge()
  })
}

function updateBadge() {
  if (state.checked === true && state.value) {
    chrome.action.setBadgeText({ tabId: state.tabId, text: state.value + "s" })
  }

  if (state.checked === false) {
    chrome.action.setBadgeText({ tabId: state.tabId, text: '' })
  }
}

// SALESFORCE FUNCTIONS

document.getElementById("refresh-salesforce-checkbox").addEventListener("change", function (e) {
  state = Object.assign(state, {
    salesforcechecked: this.checked
  })
  chrome.storage.sync.set(state, () => {
    update()
  })
});

document.getElementById("refresh-salesforce-seconds").addEventListener("change", function (e) {
  state = Object.assign(state, {
    salesforcevalue: document.getElementById("refresh-salesforce-seconds").value
  })
  chrome.storage.sync.set(state, () => {
    update();
  });
})

document.getElementById("refresh-salesforce-button").addEventListener("click", function (e) {

  state = Object.assign(state, {
    salesforcechecked: document.getElementById("refresh-salesforce-checkbox").checked,
    salesforcevalue: document.getElementById("refresh-salesforce-seconds").value
  })
  chrome.storage.sync.set(state, () => {
    update()
  })
});