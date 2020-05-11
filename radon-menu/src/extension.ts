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

	let disposableDeployCSAR = vscode.commands.registerCommand('radon-menu.deployCSAR', (uri:vscode.Uri) => {
	// The code you place here will be executed every time your command is executed

	//const simpleGitPromise = require('simple-git/promise')("projects/radon-csars");
	//let path= e.fsPath();
	//pushCsarToGitHubRepository();
	const repo="github.com/radon-h2020/radon-csars.git";
	// User name and password of your GitHub
	const userName = 'radon-dev';
	const password = 'radon-h2020';

	//const simpleGitPromise = require('simple-git/promise')();
	
	// Set up GitHub url like this so no manual entry of user pass needed
	//const gitHubUrl = 'https://${userName}:${password}@${repo}';
	//simpleGitPromise.addRemote('origin',gitHubUrl);
	var path = require('path')
	var filePath=uri.fsPath;
	var fileName=path.parse(filePath).base;
	
	var mkdirp = require('mkdirp');
    var repoPath = 'd:/test/projects/radon-csars';
	mkdirp.sync(repoPath);
	
	require('simple-git/promise')(repoPath).addRemote('origin', 'https://${userName}:${password}@github.com/radon-h2020/radon-csars.git');
	
	// require('simple-git/promise')(repoPath).init();
	// console.info("Dopo init");
	// require('simple-git/promise')(repoPath).add(fileName);
	// console.info("Dopo add");
	// require('simple-git/promise')(repoPath).commit("Commit of csar");
	// console.info("Dopo commit");
	// require('simple-git/promise')(repoPath).addRemote('origin', 'https://${userName}:${password}@github.com/radon-h2020/radon-csars.git');
	// console.info("Dopo remote");
	// require('simple-git/promise')(repoPath).push('origin', 'master');
	// simpleGitPromise
    //  .init()
    //  .add('./*')
    //  .commit("first commit!")
    //  .addRemote('origin', 'https://${userName}:${password}@github.com/radon-h2020/radon-csars.git')
    //  .push('origin', 'master');
		vscode.window.showInformationMessage('Deployment process started: '+fileName);
	});

	let disposableDeployStatus = vscode.commands.registerCommand('radon-menu.deployStatus', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.env.openExternal(vscode.Uri.parse("http://operations.radon-h2020.eu:8080/"));
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

	context.subscriptions.push(disposableGMT,disposableVT,disposableCTT,disposableDT,disposableDPT,disposableHelp);
}

function pushCsarToGitHubRepository(csarPath:string, repo:string) {

	// User name and password of your GitHub
	const userName = 'radon-dev';
	const password = 'radon-h2020';

	const simpleGitPromise = require('simple-git/promise')("projects/radon-csars");
	
	// Set up GitHub url like this so no manual entry of user pass needed
	const gitHubUrl = 'https://${userName}:${password}@${repo}';
	
	// add local git config like username and email
	//simpleGit.addConfig('user.email','balvinder294@gmail.com');
	//simpleGit.addConfig('user.name','Balvinder Singh');

	// Add remore repo url as origin to repo
	simpleGitPromise.addRemote('origin',gitHubUrl);

	// Add all files for commit
  	simpleGitPromise.add(csarPath)
    .then(
       (addSuccess:any) => {
          console.log(addSuccess);
       }, (failedAd:any) => {
          console.log('adding csar file failed');
    });

	// Commit files as Initial Commit
	simpleGitPromise.commit('Commit csar by simplegit')
   	.then(
      (successCommit:any) => {
        console.log(successCommit);
     }, (failed:any) => {
        console.log('failed commmit csar');
	 });
	 
	// Finally push to online repository
	simpleGitPromise.push('origin','master')
	.then((success:any) => {
		console.log('repo successfully pushed csar');
	},(failed:any)=> {
		console.log('repo push csar failed');
	});
  }

// this method is called when your extension is deactivated
export function deactivate() {}
