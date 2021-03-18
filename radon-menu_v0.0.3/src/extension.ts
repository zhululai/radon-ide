import { JenkinsParams, CSAR_References } from './helpers';
import * as vscode from 'vscode';
import * as helper from './helpers';
import * as upload from './upload-template-interactive-action';
import { commands, window,  Uri } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export let CURRENTLY_SELECTED_FILE: string;
export let CURRENT_DIR_PATH: string;

export class ConfigParameters{
    CSAR_name: string;
    CSAR_version: string;
    Jenkins_URL: string;
    Jenkins_username: string;
    Jenkins_password: string;
    Jenkins_job: string;
    Jenkins_job_token: string;
	cookie_jar: string;

    constructor(){
        this.CSAR_name="";
        this.CSAR_version="";
        this.Jenkins_URL="";
        this.Jenkins_username="";
        this.Jenkins_password="";
        this.Jenkins_job="";
        this.Jenkins_job_token="";
		this.cookie_jar="/tmp/cookies";
    }
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "radon-menu" is now active!');

	context.subscriptions.push(commands.registerCommand('radon-menu.configCI', async (uri?: Uri) => {
		//let csarRefs = {} as CSAR_References;
		
		if(uri){

			CURRENTLY_SELECTED_FILE = '';
			CURRENT_DIR_PATH = '';
			window.showInformationMessage(`Selected file is: ${uri.fsPath}`);

			let fileExtension = uri.fsPath.split('.').pop();
			if (fileExtension!! === 'csar') {
				CURRENTLY_SELECTED_FILE = uri.fsPath;
				window.showInformationMessage(`Selected file will be included in the process.`);

				CURRENT_DIR_PATH = path.resolve(path.dirname(uri.fsPath));
				console.log(CURRENT_DIR_PATH);
				var fileName= path.parse(uri.fsPath).base;
				var name=fileName.split(".").shift();

				var configParams = new ConfigParameters();

				fs.writeFile(CURRENT_DIR_PATH+"/"+'CI_config_'+name+'.yaml', JSON.stringify(configParams,null,1),  function(err) {
					if (err) {
					return console.error(err);
					}
    				window.showInformationMessage("CI config file for the CSAR "+name+" created!");
				});

			} else {
				window.showWarningMessage(`Selected file will not be included.`);
			}

		}

	}))

/* 	context.subscriptions.push(commands.registerCommand('radon-menu.triggerCI', async (uri?: Uri) => {
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

	})) */

	context.subscriptions.push(commands.registerCommand('radon-menu.triggerCI', async (uri?: Uri) => {
		let csarRefs: CSAR_References=new CSAR_References();
		let jenkinsParams: JenkinsParams= new JenkinsParams();
		
		if(uri){

			CURRENTLY_SELECTED_FILE = '';
			CURRENT_DIR_PATH = '';
			window.showInformationMessage(`Selected file is: ${uri.fsPath}`);

			let fileExtension = uri.fsPath.split('.').pop();
			if (fileExtension!! === 'yaml') {
				CURRENTLY_SELECTED_FILE = uri.fsPath;
				window.showInformationMessage(`Selected file will be included in the process.`);
			} else {
				window.showWarningMessage(`Selected file will not be included.`);
			}

			CURRENT_DIR_PATH = path.resolve(path.dirname(uri.fsPath));
			
			const yaml = require('js-yaml');
			
        	try {
				
           		let fileContent = await fs.readFileSync(uri.fsPath, 'utf8');
				
            	let yamlData = yaml.load(fileContent);
				
				if(!Object.keys(yamlData).includes("CSAR_name" || "CSAR_version" ||"Jenkins_URL" || "Jenkins_username" || "Jenkins_password" || "Jenkins_job" || "Jenkins_job_token" || "cookie_jar")){
					throw new Error(`One of the mandatory field is not present in the given config file`);
				}
				else{
					var params:ConfigParameters = JSON.parse(JSON.stringify(yamlData));
					
					csarRefs.templateName=params.CSAR_name;
					csarRefs.versionName=params.CSAR_version;

					console.log("Csar Ref: "+JSON.stringify(csarRefs));

					jenkinsParams.jenkinsURL=params.Jenkins_URL;
					jenkinsParams.jenkinsUsername=params.Jenkins_username;
					jenkinsParams.jenkinsPassword=params.Jenkins_password;
					jenkinsParams.jenkinsJobName=params.Jenkins_job;
					jenkinsParams.jenkinsToken=params.Jenkins_job_token;
					jenkinsParams.cookie_jar=params.cookie_jar;

					console.log("jenkinsParams: "+JSON.stringify(jenkinsParams));

					window.showInformationMessage("Trigger CI configuration parameters have been set");

					let crumb = await helper.getCrumb(jenkinsParams);
				 	let result = await helper.triggerJenkinsJob(jenkinsParams,csarRefs,crumb);
					
				 	window.showInformationMessage(`The Jenkins job `+jenkinsParams.jenkinsURL+jenkinsParams.jenkinsJobName+` for deployment has been triggered`);
				}
            
       		} catch (e) {
            	window.showErrorMessage(`Failed to start the CI process: `+e);
       		}
		}
	}))

	/*let disposableDeployStatus = vscode.commands.registerCommand('radon-menu.CIStatus', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		//vscode.env.openExternal(vscode.Uri.parse("https://github.com/radon-h2020/radon-csars/blob/master/README.md"));
		vscode.env.openExternal(vscode.Uri.parse("https://github.com/radon-h2020/radon-ide/blob/master/CIStatus/README.md"));
		vscode.window.showInformationMessage('Opened CI Status page');
	});*/


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

	//context.subscriptions.push(disposableGMT,disposableVT,disposableCTT,disposableDT,disposableDPT,disposableHelp);
	//context.subscriptions.push(disposableDeployCSAR,disposableDeployStatus,disposableHelp);
	//context.subscriptions.push(disposableDeployStatus,disposableHelp,disposableMonitoring,disposableDeployment);
	context.subscriptions.push(disposableHelp,disposableMonitoring,disposableDeployment);
}

// this method is called when your extension is deactivated
export function deactivate() {}  
