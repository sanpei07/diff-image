/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs';
import mime from 'mime-types';
//import trash from 'trash';
//const trash = require("trash");

const  { IPCKeys } = require("./constants");

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  //const menuBuilder = new MenuBuilder(mainWindow);
  //menuBuilder.buildMenu();
  mainWindow.setMenu(null); //??????????????????????????????

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);


ipcMain.on(IPCKeys.OPEN_DIR,(e,arg)=>{
  var ret = OpenDir(arg);
  e.returnValue = ret;
})

ipcMain.on(IPCKeys.DROP_FOLDER,(e,path,msg) =>{
  ReadImageData(path,msg);
  e.returnValue = true;
})

ipcMain.on(IPCKeys.DELETE_IMAGE,(e,path1,path2)=>{
  DeleteImage(path1,path2);
  e.returnValue = true;
})



const OpenDir = (msg:string):any =>{
  let ret = dialog.showOpenDialogSync({properties:['openDirectory']});
  if(ret){
    ReadImageData(ret[0],msg);
  }
  return ret;
}

const ReadImageData = (readPath:string,msg:string)=>{
  var openDir = readPath;
  var imgs:string[] = [];
  fs.readdir(openDir,(err,dir)=>{
    for(let file of dir){
      var ext = path.extname(file); //?????????????????????????????????
      var filePath = path.resolve(path.join(openDir,file)); //????????????????????????????????????
      var type = mime.lookup(ext);
      if (type && /^image\//.test(type)) {
        imgs.push(filePath.toString());
      }
    }
    console.log(imgs);
    mainWindow?.webContents.send(IPCKeys.RECEIVE_IMAGES,imgs,msg)
  })
}

const DeleteImage = async(path1:string,path2:string) => {
  try{
    var ex1 =  fs.existsSync(path1);
    if(ex1) {
      fs.unlinkSync(path1);
      /*await trash([path1]).then(()=>{
        console.log("delete1")
      });*/
    }
    var ex2 =  fs.existsSync(path2);
    if(ex2){ 
      fs.unlinkSync(path2);
    }
    console.log("delete")
  }catch (error){
    throw error;
  }
}