const enabledInput =
  document.getElementById("enabled");

const fileNameInput =
  document.getElementById("fileName");

const previewName =
  document.getElementById("previewName");

const extension =
  document.getElementById("extension");

const saveButton =
  document.getElementById("save");

const status =
  document.getElementById("status");


function updatePreview() {
  const name =
    fileNameInput.value.trim() ||
    "Uploaded File";

  previewName.textContent =
    `${name}${extension.textContent}`;
}


function detectExtension() {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    (tabs) => {

      if (!tabs.length) {
        return;
      }

      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          type: "GET_SELECTED_FILE"
        },
        (response) => {

          if (chrome.runtime.lastError) {
            return;
          }

          if (
            !response ||
            !response.extension
          ) {
            return;
          }

          extension.textContent =
            response.extension;

          updatePreview();
        }
      );
    }
  );
}


chrome.storage.local.get(
  ["enabled", "fileName"],
  (settings) => {

    enabledInput.checked =
      settings.enabled !== false;

    fileNameInput.value =
      settings.fileName ||
      "Uploaded File";

    updatePreview();
  }
);


fileNameInput.addEventListener(
  "input",
  updatePreview
);


saveButton.addEventListener(
  "click",
  () => {

    const fileName =
      fileNameInput.value.trim();

    if (!fileName) {
      status.textContent =
        "Enter a filename.";

      return;
    }

    chrome.storage.local.set(
      {
        enabled:
          enabledInput.checked,

        fileName
      },
      () => {

        status.textContent =
          "Saved.";

        setTimeout(() => {
          status.textContent = "";
        }, 1500);
      }
    );
  }
);


enabledInput.addEventListener(
  "change",
  () => {

    chrome.storage.local.set({
      enabled:
        enabledInput.checked
    });
  }
);


detectExtension();