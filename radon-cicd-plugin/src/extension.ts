import { JenkinsParams, CSAR_References } from './helpers';
import * as vscode from 'vscode';
import * as helper from './helpers';
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
	console.log('Congratulations, your extension "radon-cicd-plugin" is now active!');

	context.subscriptions.push(commands.registerCommand('radon-cicd-plugin.configCI', async (uri?: Uri) => {
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

	context.subscriptions.push(commands.registerCommand('radon-cicd-plugin.triggerCI', async (uri?: Uri) => {
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
}

// this method is called when your extension is deactivated
export function deactivate() {}  
