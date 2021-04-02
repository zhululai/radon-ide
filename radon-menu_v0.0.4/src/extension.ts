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
	let disposableHelp = vscode.commands.registerCommand('radon-menu.startHelp', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.env.openExternal(vscode.Uri.parse("https://github.com/radon-h2020/radon-methodology#table-of-contents"));
		vscode.window.showInformationMessage('Opened RADON Help page');
	});

	let disposableMonitoring = vscode.commands.registerCommand('radon-menu.openMonitoring', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.env.openExternal(vscode.Uri.parse("http://3.127.254.144:3000/"));
		vscode.window.showInformationMessage('Opened RADON Monitoring page');
	});

	let disposableDeployment = vscode.commands.registerCommand('radon-menu.showDeploymentStatus', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.env.openExternal(vscode.Uri.parse("https://saas-xopera.xlab.si/ui/"));
		vscode.window.showInformationMessage('Opened xOpera SaaS UI');
	});

	context.subscriptions.push(disposableHelp,disposableMonitoring,disposableDeployment);
}

// this method is called when your extension is deactivated
export function deactivate() {}  
