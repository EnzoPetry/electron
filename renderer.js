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
			const list = await window.api.list(
				{
					host: server,
					user: user,
					password: password,
				},
				"/"
			);
			const fileNames = list.map((file) => file.name);
			output.innerHTML = fileNames
				.map((file) => `<p>${file}</p>`)
				.join("");
		} else {
			output.textContent = "Erro de Conexão - ";
		}
	} catch (err) {
		output.textContent = `Erro: ${err.message}`;
	}
});
