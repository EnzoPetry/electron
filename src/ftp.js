const ftp = require("basic-ftp");
const fs = require("fs");

const connect = async (config) => {
	const client = new ftp.Client();
	client.ftp.verbose = true;
	try {
		await client.access(config);
		console.log("FTP Conectado");
		return client;
	} catch (err) {
		console.error("Erro:", err.message);
		client.close();
		throw err;
	}
};
const listFiles = async (client, directoryPath) => {
	try {
		const list = await client.list(directoryPath);
		return list;
	} catch (err) {
		console.error("Erro:", err.message);
		throw err;
	} finally {
		client.close();
	}
};

const checkFolder = async () => {
	try {
		await fs.promises.mkdir("./downloads", {recursive: true});
	} catch (err) {
		console.error(`Erro ao criar diretório downloads:`, err.message);
		throw err;
	}
};
const downloadFile = async (client, fileName, fileDirectory) => {
	try {
		await checkFolder();
		await client.downloadTo(`./downloads/${fileName}`, `${fileDirectory}/${fileName}`);
		console.log(`Arquivo ${fileName} baixado com sucesso.`);
	} catch (err) {
		console.error("Erro ao baixar arquivo:", err.message);
		throw err;
	} finally {
		client.close();
	}
};
const uploadFile = async (client, fileName, fileDirectory) => {
	try {
		await client.uploadFrom(fileDirectory, fileName);
		console.log(`Upload realizado! ${fileName}`);
	} catch (err) {
		console.error("Erro ao baixar arquivo:", err.message);
		throw err;
	} finally {
		client.close();
	}
};

};
module.exports = {connect, listFiles, downloadFile, uploadFile};
