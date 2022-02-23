const { contextBridge, ipcRenderer } = require('electron');
const { IPCKeys }  = require("./constants.ts");

contextBridge.exposeInMainWorld('myAPI', {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    openDir(msg) {
      ipcRenderer.sendSync(IPCKeys.OPEN_DIR,msg)
    }
});
