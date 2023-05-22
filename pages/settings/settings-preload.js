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
  getConfig: (key) => ipcRenderer.invoke("getConfig", key),
  setLocale: (lang) => ipcRenderer.invoke("setLocale", lang),
  reset: () => ipcRenderer.invoke("window-reset"),
  reboot: () => ipcRenderer.invoke("window-reboot"),
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
});

contextBridge.exposeInMainWorld("langAPI", {
  _t: (data) => ipcRenderer.invoke("lang:_t", data),
});

contextBridge.exposeInMainWorld("messageAPI", {
  sendMessageToParent: (data) => ipcRenderer.send("sendMessageToParent", data),
});
