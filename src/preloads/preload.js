const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
    "item", {
      receive: (channel, func) => {
        ipcRenderer.on(channel, (e, ...args) => func(...args))
      },
      send: (channel, data) => {
        ipcRenderer.send(channel, data)
      }
    }
)