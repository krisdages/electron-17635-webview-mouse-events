const { ipcRenderer } = require("electron");

//region
/*---------------------------------------------------------------------------------------------
 *  Modified from preload in VS Code: https://github.com/microsoft/vscode
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/
const hostMessaging = new class HostMessaging {
	constructor() {
		this.handlers = new Map();
		ipcRenderer.on('ipc-message', (e, channel, args) => {
			const handler = this.handlers.get(channel);
			if (handler) {
				handler(e, args);
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
}();
//endregion

window.hostMessaging = hostMessaging;

function sendMouseEventToParent(type, event) {
	hostMessaging.postMessage("mouse-event", {
		type,
		screenX: event.screenX,
		screenY: event.screenY
	});
}

for (const eventName of ["mousedown", "mouseup"]) {
	window.addEventListener(eventName, event => {
		sendMouseEventToParent(eventName, event);
	}, { capture: true });
}


