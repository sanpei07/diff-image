const { contextBridge, ipcRenderer } = require('electron');
const { IPCKeys }  = require("./constants.ts");

contextBridge.exposeInMainWorld('myAPI', {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    openDir(msg) {
      ipcRenderer.sendSync(IPCKeys.OPEN_DIR,msg);
    },
    dropFolder(path,msg){
      ipcRenderer.sendSync(IPCKeys.DROP_FOLDER,path,msg);
    },
    deleteImage(path1,path2){
      ipcRenderer.sendSync(IPCKeys.DELETE_IMAGE,path1,path2);
    },
    onReceiveImages(listener){
      ipcRenderer.on(IPCKeys.RECEIVE_IMAGES,(event,...args) => listener(...args))
      return () => {
        ipcRenderer.removeAllListeners(IPCKeys.RECEIVE_IMAGES);
      };
    }
});
