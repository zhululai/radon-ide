// helper class was used from: https://github.com/microsoft/vscode-extension-samples/blob/master/quickinput-sample/src/multiStepInput.ts

import {window} from 'vscode';
import { parse } from 'node-html-parser';


export class JenkinsParams{
    jenkinsURL: string;
    jenkinsUsername: string;
    jenkinsPassword: string;
    jenkinsJobName:string;
    jenkinsToken:string;
    cookie_jar: string;

    constructor(){
        this.jenkinsURL="";
        this.jenkinsUsername="";
        this.jenkinsPassword="";
        this.jenkinsJobName="";
        this.jenkinsToken="";
		this.cookie_jar="";
    }
}

export class CSAR_References {
    templateName: string;
    versionName: string;

    constructor(){
        this.templateName="";
        this.versionName="";
    }

}

const DEFAULT_JenkinsURL="http://217.172.12.165:8080/";
const DEFAULT_JenkinsJob="job/ENG/job/IDE-plugin/job/Template-Library-Deploy";
const DEFAULT_JenkinsToken="toy-app";

export function runCmd(cmd:any)
{
  console.log("Run CMD: "+cmd);

  var child_process = require('child_process');

  var resp = child_process.execSync(cmd);
  var result = resp.toString('UTF8');

  return result;
}

export async function getCrumb(jenkinsParams:JenkinsParams):Promise<any> {
    //var cmd = `curl --silent --cookie-jar `+ jenkinsParams.cookie_jar +` '`+jenkinsParams.jenkinsURL+`crumbIssuer/api/xml?xpath=concat\(//crumbRequestField,%22:%22,//crumb\)' -u `+jenkinsParams.jenkinsUsername+`:`+jenkinsParams.jenkinsPassword;  
    var cmd = "curl --silent --cookie-jar "+ jenkinsParams.cookie_jar +" \""+jenkinsParams.jenkinsURL+"crumbIssuer/api/xml?xpath=concat\(//crumbRequestField,%22:%22,//crumb\)\" -u "+jenkinsParams.jenkinsUsername+":"+jenkinsParams.jenkinsPassword;  

    var result = runCmd(cmd);
    console.log("Get Jenkins crumb..."+result);

    managCmdError(result);

    return result;
}

export async function triggerJenkinsJob(jenkinsParams:JenkinsParams,csarReferences:CSAR_References,crumb:string):Promise<any> {

    var cmd = `curl -X POST --cookie `+ jenkinsParams.cookie_jar +` `+jenkinsParams.jenkinsURL+DEFAULT_JenkinsJob+`/buildWithParameters?token=`+jenkinsParams.jenkinsToken+` -F csar_reference=`+csarReferences.templateName+` -F csar_version=`+csarReferences.versionName+` -H `+crumb+` -u `+jenkinsParams.jenkinsUsername+`:`+jenkinsParams.jenkinsPassword+` -v`;  
    
    var result = runCmd(cmd)
    console.log("Trigger Jenkins job..."+result);

    managCmdError(result);

    return result;
}


export function managCmdError(result:any){

    if(result.includes("<head>")){
        const root = parse(result);
        const title=root.querySelector('title').innerHTML;
        if (title.includes('Error')) { 
            window.showErrorMessage(title);
        }else{
            window.showInformationMessage(title);
        }
    }
    
    return;

}