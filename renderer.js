const info = document.getElementById("info");
const btn = document.getElementById("button");
const fileBtn = document.getElementById("fileButton");
const filePathMsg = document.getElementById("file");
const connectButton = document.getElementById("connect");
const output = document.getElementById("output");

info.innerText = `Chrome v${versions.chrome()}, Node v${versions.node()}, e Electron v${versions.electron()}`;

const connectionData = () => ({
	host: document.getElementById("server").value,
	user: document.getElementById("user").value,
	password: document.getElementById("password").value,
});

const updateList = (path, parentPath, pastas, arquivos) => {
	let listItens = "";
	if (parentPath) {
		listItens += `<button class="return" id="${parentPath}">..</button>`;
	}
	listItens += pastas	.map((file) => {
			const pathFiltered = path === "/" ? `/${file.name}` : `${path}/${file.name}`;
			return `<div class="folder" id="${pathFiltered}"><img src="./pngwing.com.png"><p>${file.name}</p></div>`;
		}).join("");
	listItens += arquivos.map((file) => `<div class="item" id="/${file.name}"><p>${file.name}</p></div>`).join("");
	output.innerHTML = listItens;
};

const downloadFile = async (fileName, fileDirectory) => {
	try {
		await window.api.download(connectionData(), fileName, fileDirectory);
		output.textContent = `Arquivo ${fileName} baixado com sucesso!`;
	} catch (err) {
		output.textContent = `Erro ao baixar o arquivo: ${err.message}`;
	}
};

const listFiles = async (path) => {
	try {
		const list = await window.api.list(connectionData(), path);
		console.log(list);
		const arquivos = list.filter((file) => file.type === 1);
		const pastas = list.filter((file) => file.type === 2);
		const parentPath = path === "/" ? null : path.split("/").slice(0, -1).join("/") || "/";
		updateList(path, parentPath, pastas, arquivos);

		if (parentPath) {
			document.querySelector(".return").addEventListener("click", async () => {
				await listFiles(parentPath);
			});
		}
		document.querySelectorAll(".folder").forEach((button) => {
			button.addEventListener("click", async () => await listFiles(button.id));
		});

		document.querySelectorAll(".item").forEach((item) => {
			item.addEventListener("click", async () => await downloadFile(item.id, path));
		});
	} catch (err) {
		output.textContent = `Erro: ${err.message}`;
	}
};

connectButton.addEventListener("click", async () => {
	try {
		console.log(connectionData());
		const connectResult = await window.api.connect(connectionData());
		if (connectResult === "conectado") {
			await listFiles("/");
		} else {
			output.textContent = "Erro de Conexão - ";
		}
	} catch (err) {
		output.textContent = `Erro: ${err.message}`;
	}

	btn.addEventListener("click", async () => {
		const response = await window.api.ping();
		console.log(response);
	});

	fileBtn.addEventListener("click", async () => {
		const filePath = await window.api.openFile();
		filePathMsg.innerText = filePath;
	});
});
