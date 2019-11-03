// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//Various assignments to window object were just for console debugging.

const { remote, ipcRenderer } = require("electron");
window.remote = remote;

//region
/*---------------------------------------------------------------------------------------------
 *  Modified from preload in VS Code: https://github.com/microsoft/vscode
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/
class WebviewMessaging {
  constructor(webviewElt) {
    this.handlers = new Map();
    webviewElt.addEventListener('ipc-message', (e)=> {
      const handler = this.handlers.get(e.channel);
      if (handler) {
        handler(e, ...e.args);
      } else {
        console.log('no handler for ', e);
      }
    });
  }

  postMessage(channel, args) {
    ipcRenderer.sendToHost(channel, args);
  }

  onMessage(channel, handler) {
    this.handlers.set(channel, handler);
  }
}
//endregion

let isMouseDownInWebview = false;
let fixEnabled = false;
let webviewWc;

const webviewElt = document.getElementById("webviewElt");
window.webviewElt = webviewElt;
const webviewMessaging = new WebviewMessaging(webviewElt);
webviewMessaging.onMessage("mouse-event", (ipcEvent, argsEvent) => {
  if (argsEvent.type === "mousedown") {
    isMouseDownInWebview = true;
  }
  else if (argsEvent.type === "mouseup") {
    isMouseDownInWebview = false;
  }
});

const fixEnabledInput = document.getElementById("fixEnabledInput");
fixEnabledInput.addEventListener("change", () => {
  fixEnabled = fixEnabledInput.checked;
});

function getWebviewWc() {
  if (webviewWc === undefined) {
    window.webviewWc = webviewWc = webviewElt.getWebContents();
  }
  return webviewWc;
}

function sendMouseEventToWebviewIfNeeded(event) {
  if (!(fixEnabled && isMouseDownInWebview))
    return;

  //console.log("event to webview", event);

  let type;
  if (event.type === "mouseup") {
    type = "mouseUp";
  }
  else if (event.type === "mousemove") {
    type = "mouseMove";
  }
  else  {
    return;
  }

  const globalX = event.screenX;
  const globalY = event.screenY;

  let { x, y } = webviewElt.getBoundingClientRect();

  x = event.clientX - x;
  y = event.clientY - y;

  getWebviewWc().sendInputEvent({
    type, x, y, globalX, globalY
  });
}

window.addEventListener("mousemove", sendMouseEventToWebviewIfNeeded, { capture: true });
window.addEventListener("mouseup", sendMouseEventToWebviewIfNeeded, { capture: true });

