const {app, BrowserWindow, ipcMain} = require("electron");
const path = require("node:path");
const {handleFileOpen, handleConnect, handleListFiles, handleDownload, handleUpload} = require("./handlers");

function createWindow() {
	const win = new BrowserWindow({
		width: 1280,
		height: 960,
		webPreferences: {
			preload: path.join(__dirname, "../preload.js"),
			nodeIntegration: true,
		},
	});
	win.loadFile(path.join(__dirname, "../index.html"));
}

app.whenReady().then(() => {
	ipcMain.handle("ping", () => "pong");
	ipcMain.handle("dialog:openFile", handleFileOpen);
	ipcMain.handle("ftp-connect", handleConnect);
	ipcMain.handle("ftp-list", handleListFiles);
	ipcMain.handle("ftp-download", handleDownload);
	ipcMain.handle("ftp-upload", handleUpload);
	createWindow();
	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") {
			app.quit();
		}
	});
});
