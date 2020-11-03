import { JenkinsParams, CSAR_References } from './helpers';
import * as vscode from 'vscode';
import * as helper from './helpers';
import * as upload from './upload-template-interactive-action';
import { commands, window,  Uri } from 'vscode';
import * as path from 'path';

export let CURRENTLY_SELECTED_FILE: string;
export let CURRENT_DIR_PATH: string;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "radon-menu" is now active!');

	context.subscriptions.push(commands.registerCommand('radon-menu.deployCSAR', async (uri?: Uri) => {
		//let csarRefs:helper.CSAR_References={templateName:'',versionName:''};
		let csarRefs = {} as CSAR_References;
		
		if(uri){

			CURRENTLY_SELECTED_FILE = '';
			CURRENT_DIR_PATH = '';
			window.showInformationMessage(`Selected file is: ${uri.fsPath}`);

			let fileExtension = uri.fsPath.split('.').pop();
			if (fileExtension!! === 'csar') {
				CURRENTLY_SELECTED_FILE = uri.fsPath;
				window.showInformationMessage(`Selected file will be included in the process.`);
			} else {
				window.showWarningMessage(`Selected file will not be included.`);
			}

			CURRENT_DIR_PATH = path.resolve(path.dirname(uri.fsPath));

			let uploaded=await helper.isCSARUploaded(context,uri);
			if(uploaded){
				window.showInformationMessage("Authenticate to Template Library to get uploaded csar");
				await helper.authenticate(context);

				csarRefs=await helper.getCSARFromTL();

				if(csarRefs && csarRefs.templateName && csarRefs.versionName){

					let jenkinsParams: JenkinsParams;
					jenkinsParams = await helper.collectJenkinsParameters(context);
					let crumb = await helper.getCrumb(jenkinsParams);
					let result = await helper.triggerJenkinsJob(jenkinsParams,csarRefs,crumb);
					
					window.showInformationMessage(`The Jenkins job `+jenkinsParams.jenkinsURL+jenkinsParams.jenkinsJobName+` for deployment has been triggered`);
				}else{
					window.showErrorMessage("There was an error retrieving the csar from the Template Library")
				}
				
			}else{
				window.showInformationMessage("Authenticate to Template Library to uploaded csar");
				await helper.authenticate(context);

				const csarTemplate= await upload.uploadTemplateInteractiveAction(context);

				if(csarTemplate && csarTemplate.templateName && csarTemplate.versionName){
					const csarRefs={} as CSAR_References;
					csarRefs.templateName=csarTemplate.templateName;
					csarRefs.versionName=csarTemplate.versionName;

					let jenkinsParams: JenkinsParams;
					jenkinsParams = await helper.collectJenkinsParameters(context);
					let crumb = await helper.getCrumb(jenkinsParams);
					let result = await helper.triggerJenkinsJob(jenkinsParams,csarRefs,crumb);

					window.showInformationMessage(`The Jenkins job `+jenkinsParams.jenkinsURL+jenkinsParams.jenkinsJobName+` for deployment has been triggered`);
				}else{
					window.showErrorMessage("There was an error during the upload of csar to the Template Library")
				}
			}
		}

	}))

	let disposableDeployStatus = vscode.commands.registerCommand('radon-menu.deployStatus', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		//vscode.env.openExternal(vscode.Uri.parse("https://github.com/radon-h2020/radon-csars/blob/master/README.md"));
		vscode.env.openExternal(vscode.Uri.parse("https://github.com/radon-h2020/radon-ide/blob/master/deploymentStatus/README.md"));
		vscode.window.showInformationMessage('Opened deployment page');
	});


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

	//context.subscriptions.push(disposableGMT,disposableVT,disposableCTT,disposableDT,disposableDPT,disposableHelp);
	//context.subscriptions.push(disposableDeployCSAR,disposableDeployStatus,disposableHelp);
	context.subscriptions.push(disposableDeployStatus,disposableHelp,disposableMonitoring);
}

// this method is called when your extension is deactivated
export function deactivate() {}
