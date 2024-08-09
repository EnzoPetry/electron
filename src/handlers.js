const {dialog} = require("electron");
const {connect, listFiles, downloadFile} = require("./ftp");

const handleFileOpen = async () => {
	const {canceled, filePaths} = await dialog.showOpenDialog();
	if (!canceled) {
		return filePaths[0];
	}
};

const handleConnect = async (event, config) => {
	const client = await connect(config);
	client.close();
	return "conectado";
};
const handleListFiles = async (event, config, directoryPath) => {
	const client = await connect(config);
	const files = await listFiles(client, directoryPath);
	return files;
};
const handleDownload = async (event, config, fileName, fileDirectory) => {
	let client;
	try {
		client = await connect(config);
		await downloadFile(client, fileName, fileDirectory);
		return "downloaded";
	} catch (error) {
		console.error("Erro ao baixar arquivo:", error.message);
		throw error;
	} finally {
		if (client) client.close();
	}
};

module.exports = {handleFileOpen, handleConnect, handleListFiles, handleDownload};
