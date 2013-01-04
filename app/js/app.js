document.getElementById("updateButton").addEventListener("click", function() update(), false);

function notify(message) {
  var console = document.getElementById("console");
  console.appendChild(document.createTextNode(message));
  console.appendChild(document.createElement("br"));
}

function update() {
  var getSelf = navigator.mozApps.getSelf();

  getSelf.onsuccess = function() {
    var self = getSelf.result;

    notify("Checking for update…");
    var checkUpdate = self.checkForUpdate();

    checkUpdate.onsuccess = function() {
      if (self.downloadAvailable) {
        notify("Update available; downloading and installing update…");

        self.ondownloadsuccess = function onDownloadSuccess(event) {
          notify("Download success.");
        };

        self.ondownloaderror = function onDownloadError() {
          notify("Download error: " + self.downloadError.name);
        };

        self.ondownloadapplied = function onDownloadApplied() {
          notify("Download applied; closing app to complete install…");
          window.setTimeout(function() window.close(), 3000);
        };

        self.download();

      } else {
        notify("No update available.");
      }
    };

    checkUpdate.onerror = function() {
      notify("Checking for update error: " + checkUpdate.error.name);
    }
  };

  getSelf.onerror = function() {
    notify("Get self error: " + getSelf.error.name);
  }
}
