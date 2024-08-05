const ftp = require("basic-ftp");

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
module.exports = { connect, listFiles };
