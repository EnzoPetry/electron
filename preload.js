const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("versions", {
	node: () => process.versions.node,
	chrome: () => process.versions.chrome,
	electron: () => process.versions.electron,
});



contextBridge.exposeInMainWorld("api", {
	ping: () => ipcRenderer.invoke("ping"),
	openFile: () => ipcRenderer.invoke("dialog:openFile"),
	connect: (config) => ipcRenderer.invoke("ftp-connect", config),
	list: (config, path) => ipcRenderer.invoke("ftp-list", config, path),
	download: (config, fileName, fileDirectory) => ipcRenderer.invoke("ftp-download", config, fileName, fileDirectory),
});
