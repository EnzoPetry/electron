const info = document.getElementById("info");
const btn = document.getElementById("button");
const fileBtn = document.getElementById("fileButton");
const filePathMsg = document.getElementById("file");
const connectButton = document.getElementById("connect");
const output = document.getElementById("output");

info.innerText = `Chrome v${versions.chrome()}, Node v${versions.node()}, e Electron v${versions.electron()}`;

btn.addEventListener("click", async () => {
	const response = await window.api.ping();
	console.log(response);
});

fileBtn.addEventListener("click", async () => {
	const filePath = await window.api.openFile();
	filePathMsg.innerText = filePath;
});
const updateList = (path, parentPath, pastas, arquivos) => {
	let listItens = "";
	if (parentPath) {
		listItens += `<button class="return" id="${parentPath}">..</button>`;
	}
	listItens += pastas.map((file) => `<div class="folder" id="${path}/${file.name}"><img src="./pngwing.com.png"><p>${file.name}</p></div>`);
	listItens += arquivos.map((file) => `<div class="item" id="${path}/${file.name}"><p>${file.name}</p>`).join("</div>");

	// output.innerHTML = `<button class="return" id="${parentPath}">..</button>${pastas.map((file) => `<div class="item" id="item_${file.name}"><img src="./pngwing.com.png" class="folder" id="${path}/${file.name}">${file.name}</button>`).join("")}${arquivos.map((file) => `<p>${file.name}</p>`).join("")}<div>`;
	output.innerHTML = listItens;
};

connectButton.addEventListener("click", async () => {
	const server = document.getElementById("server").value;
	const user = document.getElementById("user").value;
	const password = document.getElementById("password").value;

	try {
		const connectResult = await window.api.connect({
			host: server,
			user: user,
			password: password,
		});
		if (connectResult === "conectado") {
			const listFiles = async (path) => {
				const list = await window.api.list(
					{
						host: server,
						user: user,
						password: password,
					},
					path
				);
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
					button.addEventListener("click", async () => {
						await listFiles(button.id);
					});
				});
			};

			await listFiles("/");
		} else {
			output.textContent = "Erro de Conexão - ";
		}
	} catch (err) {
		output.textContent = `Erro: ${err.message}`;
	}
});
