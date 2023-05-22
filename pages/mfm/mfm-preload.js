// preload.js
const { contextBridge, ipcRenderer } = require("electron");

// All the Node.js APIs are available in the preload process.
// Chrome 拡張機能と同じサンドボックスも持っています。
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

contextBridge.exposeInMainWorld("darkMode", {
  toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
  dark: () => ipcRenderer.send("dark-mode:dark"),
  light: () => ipcRenderer.send("dark-mode:light"),
  system: () => ipcRenderer.send("dark-mode:system"),
  isDarkMode: () => ipcRenderer.invoke("dark-mode:isDarkMode"),
});

contextBridge.exposeInMainWorld("electronAPI", {
  processVersions: (data) => ipcRenderer.invoke("process-versions", data),
  resourcesPathJoin: (data) => ipcRenderer.invoke("path-join", data),
  setTitle: (title) => ipcRenderer.send("set-title", title),
  getConfig: (key) => ipcRenderer.invoke("getConfig", key),
  setConfig: (arg) => ipcRenderer.invoke("setConfig", arg),
  setLocale: (lang) => ipcRenderer.invoke("setLocale", lang),
  setMfmModel1: (data) => ipcRenderer.invoke("setMfmModel1", data),
  setMfmModel2: (data) => ipcRenderer.invoke("setMfmModel2", data),
  setMfmParts: (data) => ipcRenderer.invoke("setMfmParts", data),
  setPlateThickness: (data) => ipcRenderer.invoke("setPlateThickness", data),
  setVideoSpeed: (data) => ipcRenderer.invoke("setVideoSpeed", data),
  isVideoPlay: (data) => ipcRenderer.invoke("isVideoPlay", data),
  minimize: () => ipcRenderer.invoke("window:minimize"),
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  factoryConfiguration: () => ipcRenderer.send("factoryConfiguration"),
  onFactoryConfigurationResponse: (callback) => ipcRenderer.on("onFactoryConfigurationResponse", callback),
});

contextBridge.exposeInMainWorld("child", {
  open: (namespace) => ipcRenderer.invoke("child:open", namespace),
  close: () => ipcRenderer.invoke("child:close"),
});

contextBridge.exposeInMainWorld("parts", {
  open: (namespace) => ipcRenderer.invoke("parts:open", namespace),
  close: () => ipcRenderer.invoke("parts:close"),
});

contextBridge.exposeInMainWorld("main", {
  open: () => ipcRenderer.invoke("window:mainOpen"),
});

contextBridge.exposeInMainWorld("langAPI", {
  _t: (data) => ipcRenderer.invoke("lang:_t", data),
});

contextBridge.exposeInMainWorld("chartAPI", {
  generateChart: () => ipcRenderer.invoke("chart:generateChart"),
});

contextBridge.exposeInMainWorld("messageAPI", {
  onChildMessage: (callback) => ipcRenderer.on("childMessage", callback),
});

contextBridge.exposeInMainWorld("partsAPI", {
  onPartsChange: (callback) => ipcRenderer.on("partsChange", callback),
});

contextBridge.exposeInMainWorld("httpAPI", {
  onStartMachineName: (callback) => ipcRenderer.on("startMachineName", callback),
});
