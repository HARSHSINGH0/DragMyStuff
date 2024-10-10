/* global chrome */

export const storageGet = (key) => {
  return new Promise((resolve) => {
    if (chrome && chrome.storage) {
      chrome.storage.sync.get([key], (result) => {
        resolve(result[key]);
      });
    } else {
      resolve(null);
    }
  });
};

export const storageSet = (key, value) => {
  return new Promise((resolve) => {
    if (chrome && chrome.storage) {
      chrome.storage.sync.set({ [key]: value }, resolve);
    } else {
      resolve();
    }
  });
};

export const sendMessageToActiveTab = (message) => {
  return new Promise((resolve) => {
    if (chrome && chrome.tabs) {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message, resolve);
      });
    } else {
      resolve(null);
    }
  });
};
