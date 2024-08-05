const { dialog } = require("electron");
const { connect, listFiles } = require("./ftp");

const handleFileOpen = async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog();
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

module.exports = { handleFileOpen, handleConnect, handleListFiles };
