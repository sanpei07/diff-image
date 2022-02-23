const { contextBridge, ipcRenderer } = require('electron');
const { IPCKeys }  = require("./constants.ts");

contextBridge.exposeInMainWorld('myAPI', {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    openDir(msg) {
      ipcRenderer.sendSync(IPCKeys.OPEN_DIR,msg)
    },
    onReceiveImages(listener){
      ipcRenderer.on(IPCKeys.RECEIVE_IMAGES,(event,...args) => listener(...args))
      return () => {
        ipcRenderer.removeAllListeners(IPCKeys.RECEIVE_IMAGES);
      };
    }
});
