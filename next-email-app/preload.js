const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, data) => {
    if (channel === "send-email") {
      ipcRenderer.send(channel, data);
    } else {
      console.error(`Blocked IPC channel: ${channel}`);
    }
  },
  on: (channel, func) => {
    if (channel === "send-email") {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    } else {
      console.error(`Blocked IPC channel: ${channel}`);
    }
  },
});
