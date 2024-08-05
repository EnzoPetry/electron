const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
	node: () => process.versions.node,
	chrome: () => process.versions.chrome,
	electron: () => process.versions.electron,
});

// contextBridge.exposeInMainWorld("ping", {
// 	ping: () => ipcRenderer.invoke("ping"),
// });

// contextBridge.exposeInMainWorld("file", {});

// contextBridge.exposeInMainWorld("ftp", {
// 	connect: (config) => ipcRenderer.invoke("ftp-connect", config),
// 	list: (config, path) => ipcRenderer.invoke("ftp-list", config, path),
// });

contextBridge.exposeInMainWorld("api", {
	ping: () => ipcRenderer.invoke("ping"),
	openFile: () => ipcRenderer.invoke("dialog:openFile"),
	connect: (config) => ipcRenderer.invoke("ftp-connect", config),
	list: (config, path) => ipcRenderer.invoke("ftp-list", config, path),
});
