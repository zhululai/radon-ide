// helper class was used from: https://github.com/microsoft/vscode-extension-samples/blob/master/quickinput-sample/src/multiStepInput.ts

import { Uri, commands, DocumentHighlight } from 'vscode';
import { QuickPickItem, window, Disposable, QuickInputButton, QuickInput, QuickInputButtons, ThemeIcon, ExtensionContext } from 'vscode';
import * as tlRestApiCalls from "./tl-rest-api-calls";
import { parse } from 'node-html-parser';

export class InputFlowAction {
    static back = new InputFlowAction();
    static cancel = new InputFlowAction();
    static resume = new InputFlowAction();
}

export type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

export interface QuickPickParameters<T extends QuickPickItem> {
    title: string;
    step: number;
    totalSteps: number;
    items: T[];
    activeItem?: T;
    placeholder: string;
    buttons?: QuickInputButton[];
    shouldResume: () => Thenable<boolean>;
}

export interface InputBoxParameters {
    title: string;
    step: number;
    totalSteps: number;
    value: string;
    prompt: string;
    validate: (value: string) => Promise<string | undefined>;
    buttons?: QuickInputButton[];
    shouldResume: () => Thenable<boolean>;
}

export class MultiStepInput {

    static async run<T>(start: InputStep) {
        const input = new MultiStepInput();
        return input.stepThrough(start);
    }

    private current?: QuickInput;
    private steps: InputStep[] = [];

    private async stepThrough<T>(start: InputStep) {
        let step: InputStep | void = start;
        while (step) {
            this.steps.push(step);
            if (this.current) {
                this.current.enabled = false;
                this.current.busy = true;
            }
            try {
                step = await step(this);
            } catch (err) {
                if (err === InputFlowAction.back) {
                    this.steps.pop();
                    step = this.steps.pop();
                } else if (err === InputFlowAction.resume) {
                    step = this.steps.pop();
                } else if (err === InputFlowAction.cancel) {
                    step = undefined;
                } else {
                    throw err;
                }
            }
        }
        if (this.current) {
            this.current.dispose();
        }
    }

    async showQuickPick<T extends QuickPickItem, P extends QuickPickParameters<T>>({ title, step, totalSteps, items, activeItem, placeholder, buttons, shouldResume }: P, selectMultiple?: boolean) {
        const disposables: Disposable[] = [];
        try {
            return await new Promise<T | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
                const input = window.createQuickPick<T>();
                input.title = title;
                input.step = step;
                input.totalSteps = totalSteps;
                input.placeholder = placeholder;
                input.items = items;
                input.ignoreFocusOut = true;
                if (selectMultiple) {
                    input.canSelectMany = true;
                }
                if (activeItem) {
                    input.activeItems = [activeItem];
                }
                input.buttons = [
                    ...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
                    ...(buttons || [])
                ];
                disposables.push(
                    input.onDidTriggerButton(item => {
                        if (item === QuickInputButtons.Back) {
                            reject(InputFlowAction.back);
                        } else {
                            resolve(<any>item);
                        }
                    }),
                    input.onDidChangeSelection(items => resolve(items[0])),
                    input.onDidHide(() => {
                        (async () => {
                            reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
                        })()
                            .catch(reject);
                    })
                );
                if (this.current) {
                    this.current.dispose();
                }
                this.current = input;
                this.current.show();
            });
        } finally {
            disposables.forEach(d => d.dispose());
        }
    }

    async showInputBox<P extends InputBoxParameters>({ title, step, totalSteps, value, prompt, validate, buttons, shouldResume }: P, password?: boolean) {
        const disposables: Disposable[] = [];
        try {
            return await new Promise<string | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
                const input = window.createInputBox();
                input.title = title;
                input.step = step;
                input.totalSteps = totalSteps;
                input.value = value || '';
                if (password) {
                    input.password = password;
                }
                input.ignoreFocusOut = true;
                input.prompt = prompt;
                input.buttons = [
                    ...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
                    ...(buttons || [])
                ];
                let validating = validate('');
                disposables.push(
                    input.onDidTriggerButton(item => {
                        if (item === QuickInputButtons.Back) {
                            reject(InputFlowAction.back);
                        } else {
                            resolve(<any>item);
                        }
                    }),
                    input.onDidAccept(async () => {
                        const value = input.value;
                        input.enabled = false;
                        input.busy = true;
                        if (!(await validate(value))) {
                            resolve(value);
                        }
                        input.enabled = true;
                        input.busy = false;
                    }),
                    input.onDidChangeValue(async text => {
                        const current = validate(text);
                        validating = current;
                        const validationMessage = await current;
                        if (current === validating) {
                            input.validationMessage = validationMessage;
                        }
                    }),
                    input.onDidHide(() => {
                        (async () => {
                            reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
                        })()
                            .catch(reject);
                    })
                );
                if (this.current) {
                    this.current.dispose();
                }
                this.current = input;
                this.current.show();
            });
        } finally {
            disposables.forEach(d => d.dispose());
        }
    }

}

export async function authenticate(context: ExtensionContext) {
    const loginTitle = 'Login to Template library';

    class MyButton implements QuickInputButton {
        constructor(public iconPath: ThemeIcon, public tooltip: string) { }
    }

    const backButton = new MyButton(new ThemeIcon("debug-reverse-continue"), 'Back');

    let userName: string = '';

    async function collectInputs() {
        let currentUserResponse = await tlRestApiCalls.getCurrentUser();

        if (currentUserResponse && tlRestApiCalls.SUCCESSFULL_STATUS_CODES.includes(currentUserResponse.status) && currentUserResponse.data instanceof Object) {
            window.showInformationMessage('Native or KeyCloak user was found!');
            return;
        } else {
            if (currentUserResponse) {
                window.showInformationMessage('You will need to login as a KeyCloak or native TPS user!');
                await MultiStepInput.run(input => inputUsername(input));
                return;
            } else {
                window.showErrorMessage('It looks like that Template library REST API is not accessible!');
                return;
            }
        }
    }

    async function inputUsername(input: MultiStepInput): Promise<any> {
        let username = await input.showInputBox({
            title: loginTitle,
            step: 1,
            totalSteps: 2,
            value: userName,
            prompt: 'Username',
            validate: validateEmpty,
            shouldResume: shouldResume
        });

        userName = username;

        return (input: MultiStepInput) => inputPassword(input, username);
    }

    async function inputPassword(input: MultiStepInput, username: string): Promise<any> {
        let password = await input.showInputBox({
            title: loginTitle,
            step: 2,
            totalSteps: 2,
            value: '',
            prompt: 'Password',
            buttons: [backButton],
            validate: validateEmpty,
            shouldResume: shouldResume
        }, true);


        if (password instanceof MyButton) {
            return (input: MultiStepInput) => inputUsername(input);
        }

        let loginResponse = await tlRestApiCalls.postNativeLogin(username, password);
        if (loginResponse && tlRestApiCalls.SUCCESSFULL_STATUS_CODES.includes(loginResponse.status)) {
            window.showInformationMessage('Native login has been successful!');
            return;
        } else {
            if (loginResponse) {
                window.showErrorMessage(loginResponse.data);
            } else {
                window.showErrorMessage('Native TPS login attempt has failed! Please try again.');
            }
            return (input: MultiStepInput) => inputUsername(input);
        }
    }

    function shouldResume() {
        return new Promise<boolean>((resolve, reject) => {
        });
    }

    async function validateEmpty(value: string) {
        return value === '' ? 'Emtpy value is not allowed' : undefined;
    }

    const state = await collectInputs();
    window.showInformationMessage('Template library login action has finished.');
}

export interface JenkinsParams{
    jenkinsURL: string;
    jenkinsUsername: string;
    jenkinsPassword: string;
    jenkinsJobName:string;
    jenkinsToken:string;
    cookie_jar: string;
}

const DEFAULT_JenkinsURL="http://217.172.12.165:8080/";
const DEFAULT_JenkinsJob="job/ENG/job/IDE-plugin/job/Template-Library-Deploy";
const DEFAULT_JenkinsToken="toy-app";

export async function collectJenkinsParameters(context: ExtensionContext) {

    class MyButton implements QuickInputButton {
        constructor(public iconPath: ThemeIcon, public tooltip: string) { }
    }

    const backButton = new MyButton(new ThemeIcon("debug-reverse-continue"), 'Back');

    async function collectInputs() {

        const state = {} as Partial<JenkinsParams>;
        state.cookie_jar='/tmp/cookies';

        window.showInformationMessage('You will need to specify Jenkins parameters!');
        await MultiStepInput.run(input => inputJenkinsURL(input, state));
        return state as JenkinsParams;
    }

    let jenkinsURL: string = DEFAULT_JenkinsURL;
    const getJenkinsParametersTitle="Insert Jenkins parameters to deploy CSAR"

    async function inputJenkinsURL(input: MultiStepInput, state: Partial<JenkinsParams>): Promise<any> {

        let jenkinsurl = await input.showInputBox({
            title: getJenkinsParametersTitle,
            step: 1,
            totalSteps: 5,
            value:jenkinsURL,
            prompt: 'Jenkins Server URL',
            validate: validateEmpty,
            shouldResume: shouldResume
        });

        state.jenkinsURL = jenkinsurl;

        return (input: MultiStepInput) => inputJenkinsUsername(input, state);
    }

    async function inputJenkinsUsername(input: MultiStepInput, state: Partial<JenkinsParams>): Promise<any> {

        let jenkinsusername = await input.showInputBox({
            title: getJenkinsParametersTitle,
            step: 2,
            totalSteps: 5,
            value: '',
            prompt: 'Jenkins username',
            buttons: [backButton],
            validate: validateEmpty,
            shouldResume: shouldResume
        });

        if(jenkinsusername  instanceof MyButton) {
            return (input: MultiStepInput) => inputJenkinsURL(input,state);
        }

        state.jenkinsUsername = jenkinsusername;

        return (input: MultiStepInput) => inputJenkinsPassword(input, state);
    }

    async function inputJenkinsPassword(input: MultiStepInput, state: Partial<JenkinsParams>): Promise<any> {

        let jenkinspassword = await input.showInputBox({
            title: getJenkinsParametersTitle,
            step: 3,
            totalSteps: 5,
            value: '',
            prompt: 'Jenkins Password',
            buttons: [backButton],
            validate: validateEmpty,
            shouldResume: shouldResume
        },true);

        if(jenkinspassword  instanceof MyButton) {
            return (input: MultiStepInput) => inputJenkinsUsername(input,state);
        }

        state.jenkinsPassword= jenkinspassword;

        return (input: MultiStepInput) => inputJenkinsJobName(input, state);
    }

    async function inputJenkinsJobName(input: MultiStepInput, state: Partial<JenkinsParams>): Promise<any> {

        let jenkinsJobName = await input.showInputBox({
            title: getJenkinsParametersTitle,
            step: 4,
            totalSteps: 5,
            value: DEFAULT_JenkinsJob,
            prompt: 'Jenkins job to trigger',
            buttons: [backButton],
            validate: validateEmpty,
            shouldResume: shouldResume
        });

        if(jenkinsJobName  instanceof MyButton) {
            return (input: MultiStepInput) => inputJenkinsUsername(input,state);
        }

        state.jenkinsJobName= jenkinsJobName;

        return (input: MultiStepInput) => inputJenkinsToken(input, state);;
    }

    async function inputJenkinsToken(input: MultiStepInput, state: Partial<JenkinsParams>): Promise<any> {

        let jenkinstoken = await input.showInputBox({
            title: getJenkinsParametersTitle,
            step: 5,
            totalSteps: 5,
            value: DEFAULT_JenkinsToken,
            prompt: 'Jenkins Token',
            buttons: [backButton],
            validate: validateEmpty,
            shouldResume: shouldResume
        });

        if(jenkinstoken  instanceof MyButton) {
            return (input: MultiStepInput) => inputJenkinsJobName(input,state);
        }

        state.jenkinsToken= jenkinstoken;

        return;
    }


    function shouldResume() {
        return new Promise<boolean>((resolve, reject) => {
        });
    }

    async function validateEmpty(value: string) {
        return value === '' ? 'Emtpy value is not allowed' : undefined;
    }

    const state = await collectInputs();
    window.showInformationMessage('Collect Jenkins parameters action has finished.');
    return state;
}

export async function isCSARUploaded(context: ExtensionContext,uri:Uri):Promise<boolean> {
    
    class MyButton implements QuickInputButton {
        constructor(public iconPath: ThemeIcon, public tooltip: string) { }
    }

    const backButton = new MyButton(new ThemeIcon("debug-reverse-continue"), 'Back');

    const pickActionTitle = 'Is the selected csar already uploaded on the Template Library?';
    const uploadedTitle = 'Yes';
    const notUpladedTitle = 'No';

    
    let input=new MultiStepInput();
    let pickActionOptions = ['yes', 'no'].map(label => ({ label }));

    let pick = await input.showQuickPick({
        title: pickActionTitle,
        step: 1,
        totalSteps: 1,
        placeholder: 'Pick the responce',
        items: pickActionOptions,
        activeItem: pickActionOptions[0],
        shouldResume: shouldResume
    });

    if (pick === pickActionOptions[0]) {
        window.showInformationMessage('The csar is already uploaded on the Template Library')
        return true;
    } else {
        window.showInformationMessage('The csar must be uploaded on the Template Library')
        return false;
    }
}

function shouldResume() {
    return new Promise<boolean>((resolve, reject) => {
    });
}

async function validateEmpty(value: string) {
    return value === '' ? 'Emtpy value is not allowed' : undefined;
}

const getCSARNameFromTL = 'Retrieve CSAR from Template Library'; 

export interface CSAR_References {
    templateName: string,
    versionName: string;
}

export async function getCSARFromTL(): Promise<any>{

    class MyButton implements QuickInputButton {
        constructor(public iconPath: ThemeIcon, public tooltip: string) { }
    }

    const backButton = new MyButton(new ThemeIcon("debug-reverse-continue"), 'Back');

    async function collectInputs() {
        const state = {} as Partial<CSAR_References>;
        await MultiStepInput.run(input => inputCSARName(input, state));
        return state as CSAR_References;
    }

    async function inputCSARName(input: MultiStepInput, state: Partial<CSAR_References>): Promise<any> {
        let pick = await input.showInputBox({
            title: getCSARNameFromTL,
            step: 1,
            totalSteps: 3,
            value: '',
            prompt: 'Insert CSAR name',
            validate: validateEmpty,
            shouldResume: shouldResume
        });
        
        const inputName=pick;
        let csarNamesResponse = await tlRestApiCalls.getCSARsFromName(inputName);

        if (csarNamesResponse && tlRestApiCalls.SUCCESSFULL_STATUS_CODES.includes(csarNamesResponse.status)) {
            const templates: Array<Object> = csarNamesResponse.data;
            const templateNames = templates.map((templateElem: any) => templateElem.name).map(label => ({ label }));
           
            let templateNamePick = await input.showQuickPick({
                title: getCSARNameFromTL,
                step: 2,
                totalSteps: 3,
                placeholder: 'Pick a csar name',
                items: templateNames,
                activeItem: templateNames[0],
                buttons: [backButton],
                shouldResume: shouldResume
            });
    
            if (templateNamePick instanceof MyButton) {
                return (input: MultiStepInput) => inputCSARName(input,state);
            }
    
            const csarName = templateNamePick!!.label;
            state.templateName=csarName;
            return (input: MultiStepInput) => pickCSARVersions(input, csarName, state);
        } else {
            if (csarNamesResponse) {
                window.showErrorMessage(csarNamesResponse.data);
            } else {
                window.showErrorMessage('There was an error when retrieving csar from Template Library.');
            }
            return;
        }
    }

    async function pickCSARVersions(input:MultiStepInput, csarName:string,state:Partial<CSAR_References>): Promise<any>  {

        class MyButton implements QuickInputButton {
            constructor(public iconPath: ThemeIcon, public tooltip: string) { }
        }
    
        const backButton = new MyButton(new ThemeIcon("debug-reverse-continue"), 'Back');
    
        let csarVersions = await tlRestApiCalls.getTemplateVersions(csarName);
    
        if (csarVersions && tlRestApiCalls.SUCCESSFULL_STATUS_CODES.includes(csarVersions.status)) {
           const versions: Array<Object> = csarVersions.data;
           const versionNames = versions.map((versionElem: any) => versionElem.versionName).map(label => ({ label }));
          
           let versionNamePick = await input.showQuickPick({
               title: getCSARNameFromTL,
               step: 3,
               totalSteps: 3,
               placeholder: 'Pick a version name',
               items: versionNames,
               activeItem: versionNames[0],
               buttons: [backButton],
               shouldResume: shouldResume
           });
    
           if (versionNamePick instanceof MyButton) {
               return (input: MultiStepInput) => inputCSARName(input,state);
           }
    
           const csarVersion = versionNamePick!!.label;
           state.versionName=csarVersion;
           return ;
       } else {
           if (csarVersions) {
               window.showErrorMessage(csarVersions.data);
           } else {
               window.showErrorMessage('There was an error when retrieving csar versions from Template Library.');
           }
           return;
       }
    }

    const state = await collectInputs();
    return state;
}

export function runCmd(cmd:any)
{
  console.log("Run CMD: "+cmd);

  var child_process = require('child_process');

  var resp = child_process.execSync(cmd);
  var result = resp.toString('UTF8');

  return result;
}

export async function getCrumb(jenkinsParams:JenkinsParams):Promise<any> {
    var cmd = `curl --silent --cookie-jar `+ jenkinsParams.cookie_jar +` '`+jenkinsParams.jenkinsURL+`crumbIssuer/api/xml?xpath=concat\(//crumbRequestField,%22:%22,//crumb\)' -u `+jenkinsParams.jenkinsUsername+`:`+jenkinsParams.jenkinsPassword;  
    
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