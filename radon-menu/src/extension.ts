// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "radon-menu" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposableGMT = vscode.commands.registerCommand('radon-menu.startGMT', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Graphical Modelling Tool started');
	});

	let disposableVT = vscode.commands.registerCommand('radon-menu.startVT', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Verification Tool started');
	});

	let disposableCTT = vscode.commands.registerCommand('radon-menu.startCTT', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Continuous Testing Tool started');
	});

	let disposableDT = vscode.commands.registerCommand('radon-menu.startDT', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Decomposition Tool started');
	});

	let disposableDPT = vscode.commands.registerCommand('radon-menu.startDPT', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Defect Prediction Tool started');
	});

	let disposableDeployCSAR = vscode.commands.registerCommand('radon-menu.deployCSAR', () => {
		// The code you place here will be executed every time your command is executed

		vscode.window.showInformationMessage('Deployment process started');
	});

	let disposableDeployStatus = vscode.commands.registerCommand('radon-menu.deployStatus', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.env.openExternal(vscode.Uri.parse("https://www.google.it/"));
		vscode.window.showInformationMessage('Opened deployment page');
	});


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposableHelp = vscode.commands.registerCommand('radon-menu.startHelp', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.env.openExternal(vscode.Uri.parse("https://www.google.it/"));
		vscode.window.showInformationMessage('Opened RADON Help page');
	});

	context.subscriptions.push(disposableGMT,disposableVT,disposableCTT,disposableDT,disposableDPT,disposableHelp);
}

// this method is called when your extension is deactivated
export function deactivate() {}
