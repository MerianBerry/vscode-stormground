// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

let runStatus: vscode.StatusBarItem | undefined;
let extPath: string;
let activeWSF: vscode.WorkspaceFolder | undefined;

function getSettingsFile(): any | undefined {
	if (!activeWSF) {
		return undefined;
	}
	if (!fs.existsSync(activeWSF.uri.fsPath + "/.vscode/settings.json")) {
		return undefined;
	}
	return JSON.parse(fs.readFileSync(activeWSF.uri.fsPath + "/.vscode/settings.json").toString());
}

function setSettingsFile(json: any) {
	if (!activeWSF) {
		return undefined;
	}
	if (!fs.existsSync(activeWSF.uri.fsPath + "/.vscode/settings.json")) {
		return undefined;
	}
	vscode.workspace.fs.writeFile(vscode.Uri.file(activeWSF.uri.fsPath + "/.vscode/settings.json"), new TextEncoder().encode(JSON.stringify(json)));
}

function needsConfiguring(): boolean {
	if (!activeWSF) {
		console.log("where am i");
		return false;
	}
	const json = getSettingsFile();
	if (!json) {
		return true;
	}
	const v = json["Lua.workspace.library"];
	return !v || !(v as Array<string>).includes(extPath + "/lua");
	/*const config = vscode.workspace.getConfiguration('settings', activeWSF.uri);
	const v = config.inspect("Lua.workspace.library");
	return !v || !v.workspaceValue || !(v.workspaceValue as Array<string>).includes(extPath + "/lua");*/
}

function isStormgroundWorkspace(): boolean {
	return activeWSF !== undefined && fs.existsSync(activeWSF.uri.fsPath + "/sgproject.json") && fs.existsSync(activeWSF.uri.fsPath + "/main.lua");
}

function checkAndModifyWorkspace(unrun?: boolean): void {
	if (!activeWSF) {
		return;
	}
	if (unrun) {
		runStatus?.dispose();
		runStatus = undefined;
	}
	runStatus?.hide();
	// console.log(`check state: ${isStormgroundWorkspace()}, ${needsConfiguring()}`);
	if (isStormgroundWorkspace() && !needsConfiguring()) {
		if (!runStatus) {
			// console.log("creating status bar item");
			runStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, undefined);
			runStatus.tooltip = "Run your Stormground Project";
			runStatus.command = "vscode-stormground.runProject";
		}
		runStatus.hide();
		runStatus.text = `$(zap) Run Project (${activeWSF.name})`;
		// console.log("configured, im showing");
		vscode.commands.executeCommand("setContext", "sg.showCmds", true);
		runStatus.show();
	}
	if (!isStormgroundWorkspace() || needsConfiguring()) {
		// console.log("not configured, im not showing");
		vscode.commands.executeCommand("setContext", "sg.showCmds", false);
		runStatus?.hide();
	}

	if (isStormgroundWorkspace() && needsConfiguring()) {
		vscode.window.showInformationMessage("Would you like to configure this workspace for Stormground?", "Yes", "No").then((v) => {
			if (v === 'Yes') {
				vscode.commands.executeCommand("vscode-stormground.configureWorkspace");
			}
		});
	}
}

export function activate(context: vscode.ExtensionContext) {
	// console.info("IVE STARTED");
	extPath = context.extensionPath;
	if (vscode.workspace.workspaceFolders) {
		activeWSF = vscode.workspace.workspaceFolders[0];
	}

	checkAndModifyWorkspace();

	vscode.window.onDidChangeActiveTextEditor((e) => {
		if (e) {
			activeWSF = vscode.workspace.getWorkspaceFolder(e.document.uri);
			checkAndModifyWorkspace();
		}
	});

	vscode.workspace.onDidChangeWorkspaceFolders((e) => {
		activeWSF = e.added[0];
		checkAndModifyWorkspace();
	});

	let disposable = vscode.commands.registerCommand('vscode-stormground.configureWorkspace', () => {
		if (!activeWSF) {
			// console.log("I have no clue where i am");
			return;
		}
		if (!needsConfiguring()) {
			console.info("Workspace is already configured");
			return;
		}
		console.log(`Configuring ${activeWSF.uri.fsPath + "/.vscode"}`);
		if (!fs.existsSync(activeWSF.uri.fsPath + "/.vscode")) {
			console.log("creating .vscode");
			fs.mkdirSync(activeWSF.uri.fsPath + "/.vscode");
		}
		if (!fs.existsSync(activeWSF.uri.fsPath + "/.vscode/settings.json")) {
			console.log("creating .vscode/settings.json");
			fs.writeFileSync(activeWSF.uri.fsPath + "/.vscode/settings.json", "{\n}");
		}
		const json = getSettingsFile();
		if (!json) {
			return;
		}
		json["Lua.workspace.library"] = [context.extensionPath + "/assets/lua"];
		setSettingsFile(json);
		/*const config = vscode.workspace.getConfiguration('settings',vscode.Uri.file(activeWSF.uri.fsPath + "/.vscode"));
		config.update("Lua.workspace.library", [context.extensionPath + "/lua"]);*/
		vscode.window.showInformationMessage("Configured for Stormground!");
		//checkAndModifyWorkspace(true);
	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand("vscode-stormground.runProject", () => {
		if (!activeWSF) {
			return;
		}
		console.log("Running " + activeWSF.name)
		const data = fs.readFileSync(activeWSF.uri.fsPath + "/sgproject.json").toString();
		const json = JSON.parse(data);
		for (let i = 0; i < vscode.window.terminals.length; ++i) {
			const term = vscode.window.terminals[i];
			if (term.name === `SG (${json["name"]})`) {
				term.sendText('clear');
				term.sendText(`./stormground -d \"${activeWSF.uri.fsPath}\"`);
				term.show(true);
				return;
			}
		}
		const term = vscode.window.createTerminal(`SG (${json["name"]})`);
		term.sendText(`cd ${context.extensionPath + "/assets"}`);
		vscode.commands.executeCommand("vscode-stormground.runProject");
	});

	disposable = vscode.commands.registerCommand("vscode-stormground.newProject", () => {
		const maincontent = "\nfunction onTick()\n\nend"
		if (!activeWSF) {

			const options: vscode.OpenDialogOptions = {
				openLabel: "Open",
				canSelectMany: false,
				canSelectFiles: false,
				canSelectFolders: true,
				title: "Open or Create workspace"
			}
			vscode.window.showOpenDialog(options).then((fileUri) => {
				if (!fileUri) {
					vscode.window.showInformationMessage("Canceled creating new project");
					return;
				}
				const uri = fileUri[0];
				const sgprojecturi = vscode.Uri.file(uri.fsPath + "/sgproject.json");
				const sgmainuri = vscode.Uri.file(uri.fsPath + "/main.lua");
				const name = uri.fsPath.split("/").pop();
				const sgproject = { monitorWidth: 96, monitorHeight: 96, name: name };
				vscode.workspace.fs.writeFile(sgprojecturi, new TextEncoder().encode(JSON.stringify(sgproject)));
				vscode.workspace.fs.writeFile(sgmainuri, new TextEncoder().encode(maincontent));
				//vscode.workspace.updateWorkspaceFolders(0, 0, { uri: uri, name: name });
				vscode.commands.executeCommand("vscode.openFolder", uri);
			});
			return;
		} else {
			vscode.window.showInputBox({ title: "Project Title", placeHolder: "My project" }).then(value => {
				if (!value) {
					return;
				}
				if (!activeWSF) {
					return;
				}
				const uri = vscode.Uri.file(activeWSF.uri.fsPath + "/../" + value);
				const sgprojecturi = vscode.Uri.file(uri.fsPath + "/sgproject.json");
				const sgmainuri = vscode.Uri.file(uri.fsPath + "/main.lua");
				vscode.workspace.fs.createDirectory(uri).then(() => {
					const sgproject = { monitorWidth: 96, monitorHeight: 96, name: value };
					vscode.workspace.fs.writeFile(sgprojecturi, new TextEncoder().encode(JSON.stringify(sgproject)));
					vscode.workspace.fs.writeFile(sgmainuri, new TextEncoder().encode(maincontent));
					vscode.workspace.updateWorkspaceFolders(0, 0, { uri: uri, name: value });
				});
			});
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
