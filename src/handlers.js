const {dialog} = require("electron");
const {connect, listFiles, downloadFile, uploadFile} = require("./ftp");

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
	} catch (err) {
		console.error("Erro ao baixar arquivo:", err.message);
		throw err;
	} finally {
		if (client) client.close();
	}
};
const handleUpload = async (event, config, fileName, fileDirectory) => {
	let client;
	try {
		client = await connect(config);
		await uploadFile(client, fileName, fileDirectory);
		return "uploaded";
	} catch (err) {
		console.log("Erro ao inserir arquivo:", err);
		throw err;
	} finally {
		if (client) client.close();
	}
};

module.exports = {handleFileOpen, handleConnect, handleListFiles, handleDownload, handleUpload};
