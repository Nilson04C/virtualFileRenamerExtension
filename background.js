chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(
    ["enabled", "fileName"],
    (settings) => {
      if (settings.enabled === undefined) {
        chrome.storage.local.set({
          enabled: true
        });
      }

      if (settings.fileName === undefined) {
        chrome.storage.local.set({
          fileName: "Uploaded File"
        });
      }
    }
  );
});