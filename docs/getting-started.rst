The following documentation explains how to use the alpha version of the RADON integrated framework by means of the RADON IDE.

Access to the RADON IDE  
"""""""""""""""""""""""

Use the following `form <https://docs.google.com/forms/d/1uwmzq8DHY-UIQB_iIASb9f6LRcnck4YvxU6PvXX-NS8/edit>`_ to request access to the RADON IDE. An account will be created and the credentials will be sent via the email specified in the form.

After receiving the credentials, login to the RADON IDE (Figure 1) connecting to the `Che Login page <http://che-che.217.172.12.178.nip.io>`_ to access the main Che dashboard (Figure 2). In the *Workspaces tab* the list of already created workspaces is visible and it is possible to create new ones. 

.. figure:: imgs/IDE_Login.jpg

   Figure 1: RADON IDE Login.

.. figure:: imgs/EclipseCheDashboard_2.jpg

   Figure 2: IDE Dashboard.

Create a RADON workspace
""""""""""""""""""""""""
In the Eclipse Che dashboard select *Get Started* tab and then *Custom Workspace*. Copy the URL of the *RADON Devfile* available `here <https://raw.githubusercontent.com/radon-h2020/radon-ide/master/devfiles/radon/v0.0.2/devfile.yaml>`_ and paste it in the field *URL of devfile*
under *Devfile* section. Then click on *Load devfile* and once the RADON devfile has been loaded click on the *Create & Open* button (Figure 3).

.. figure:: imgs/LoadRADONDevfile.jpg

   Figure 3: Create a RADON Workspace.

As depicted in Figure 4, a RADON workspace is started. It provides the “radon-particles” modeling project with a directory structure compliant with the GMT and the set of integrated RADON tools enabled (i.e., GMT, VT, DT, DPT, CTT).

.. figure:: imgs/IDE_RADONWorkspace_Light.jpg

   Figure 4: RADON Workspace.

How to launch RADON tools 
"""""""""""""""""""""""""
Graphical Modeling Tool
***********************
The GMT can be used within the RADON IDE to model an application. To launch the GMT, click on the *radon-gmt* option, present on the *My Workspace* right panel, as depicted in Figure 5.

.. figure:: imgs/LaunchGMT_Light.jpg

   Figure 5: How to launch GMT.

The browser window of the GMT will be opened (Figure 6) to create or adapt existing TOSCA modeling entities as well as to compose new applications interacting with files and folders from the "modeling project" inside the workspace.

.. figure:: imgs/GMT.jpg

   Figure 6: GMT Dashboard.

The *Export to Filesystem* functionality (Figure 7), provided by the GMT permits to package and save a CSAR of a selected RADON Model to the workspace to process it using other RADON tools or to deploy it using the Orchestrator. The RADON model will be export in a CSAR file and will be store in the *radon-csar* folder (Figure 8).

.. figure:: imgs/GMT_Export.jpg

   Figure 7: Export CSAR.
   
.. figure:: imgs/GMT_csar_light.jpg

   Figure 8: *radon-csar* folder.

Verification Tool
*****************

The Verification Tool is used within the RADON IDE to verify that a RADON model conforms to the CDL specifications. The .cdl files defining the CDL specifications for a specific RADON model can be edited, imported and updated within the workspace of IDE (Figure 9). To get started, you can clone the `verification tool sample project <https://github.com/radon-h2020/demo-verification-tool-sample-project.git>`_ in the workspace, which contains a sample TOSCA model and a CDL specification. To clone this project use the Git functionalities provided in the workspace as described below:

1. Press *Ctrl+Shift+P* to open the command palette. Select the *Git:Clone* command and type the Repository URL of the verification tool sample project. 
2. Press *Enter* to clone the project in the workspace


.. figure:: imgs/VT_cdl_light.jpg

   Figure 9: Edit CDL specifications.

To verify that the RADON model conforms to these CDL specifications, make a right-click on the .cdl file and select the *Verify* option (Figure 10). The verification results are shown in the *RADON Verification Tool* output panel (Figure 11).
 
.. figure:: imgs/VT_verify_light.jpg

   Figure 10: Verification of CDL specifications by means of the VT.

.. figure:: imgs/VT_output_light.jpg

   Figure 11: RADON Verification Tool output panel.

Decomposition Tool
******************
The Decomposition Tool is used within the RADON IDE to optimize the deployment of a RADON model. To get started, you can clone the `decomposition tool sample project <https://github.com/radon-h2020/demo-decomposition-tool-sample-project.git>`_ in the workspace, which contains a *demo-app* project. To clone this project use the Git functionalities provided in the workspace as described below:

1. Press *Ctrl+Shift+P* to open the command palette. Select the *Git:Clone* command and type the Repository URL of the decomposition tool sample project. 
2. Press *Enter* to clone the project in the workspace

To invoke the optimize functionality of the DT, make a right-click on the service template (.yaml) and select the Optimize option (Figure 12). The service template will be updated according to the optimal deployment scheme, and the minimum operating cost will be printed in the Output window (View → Output) as depicted in Figure 13.
   
.. figure:: imgs/DT_optimize_light_2.jpg

   Figure 12: Optimize deployment by means of DT.
   
.. figure:: imgs/DT_output_light_2.jpg

   Figure 13: Decomposition Tool output window.

Defect Prediction Tool
**********************
The Defect Prediction Tool is used within the RADON IDE to check defects in a (Ansible) IaC script. To invoke the detection functionality of the DPT, make a right-click on a YAML-based Ansible file (i.e. .yaml file) or on the active editor with the open YAML file and select the Run Detection option (Figure 14).
The results (i.e., the metrics extracted from the script and defect-proneness) will be displayed in a new active tab(Figure 15).

.. figure:: imgs/DPT_detection_light.jpg

   Figure 14: Check defects by means of DPT
   
.. figure:: imgs/DPT_output_light.jpg

   Figure 15: Defect Prediction Tool output window.

Deploy the application
""""""""""""""""""""""

To start the deployment process, select the CSAR, stored in the radon-csar project, make a right-click on it and select the *Deploy* option as depicted in Figure 21.
During the deployment process, the CSAR will be published to the Template Library and a Jenkins job will be triggered to manage the deployment of the CSAR with the Orchestrator.

.. figure:: imgs/Deploy_CSAR_light.jpg

   Figure 16: Deploy of the CSAR.

Continuous Testing Tool 
***********************

The Continuous Testing Tool (CTT) provides the means to deploy the applicaiton that is supposed to be tested, the so-called system under test (SUT), and a testing agent, the so-called test infrastructure (TI), that executes the defined tests against the SUT. 
After the deployment has succeeded, the defined test is executed and the results are obtained. 
The complete functionality of the tool is described in the `CTT documentation <https://continuous-testing-tool.readthedocs.io/en/latest/>`_.

In this documentation, we go through the test of the "ServerlessToDoListAPI" and an endpoint test that makes sure that the deployment was successful. The SUT is FaaS-based implementation of a ToDo-list using AWS services, especially AWS lambda functions. The TI consists of a Docker container of a test agent for CTT that is deployed on top of an AWS EC2 instance.

To make this example work, some information is needed beforehand: AWS Access Key ID, AWS Secret Access Key, AWS EC2 SSH Key Type (e.g., ``OPENSSH``, ``RSA``), AWS EC2 SSH Key, AWS EC2 SSH Key Name, AWS VPC Subnet ID.

The concrete steps are as follows:

**1. Preparing the Workspace with Credentials**
In order to use CTT in the context of the RADON IDE, some credentials need to be provided when the workspace is created. 
In the future, this step will be made more comfortable to conduct. 
The said credentials are required in order to deploy the SUT and the TI on the respective service providers’ infrastructures (e.g., AWS).

These credentials need to be filled in into the workspace configuration ``devfile.yaml`` before the workspace is created.
The following code listing shows an exemplary excerpt of the ``devfile.yaml``’s CTT ``env``-section on how the fields need to be populated with the credentials. ::

  env:
   - name: OPERA_SSH_USER
     value: "ubuntu"
   - name: OPERA_SSH_IDENTITY_FILE
     value: "/tmp/aws-ec2"
   - name: AWS_ACCESS_KEY_ID
     value: "AKSDF4353SFD3NMGXHERWQ"
   - name: AWS_SECRET_ACCESS_KEY
     value: "6QYMAS4sdfhAHDJ1L+pfgqZt/9OcxUN8a1/vg/ly"
   - name: KEY_TYPE
     value: "OPENSSH"
   - name: SSH_PRIV_KEY
     value: >
       c3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAA
       NhAAAAAwEAAQAAAxUA9DcKpAwyCTystithD
       [..]
       Akawm0cQ55NZ76el6jzUWBDePeT7mmWUCfm
       kVpfAebH2+m6/F/KpFE2Q8aFBhWSVD3SmX5
       YPAAAAAAECCwQ=

Once these variables are set, the workspace can be created.

**2. Configuring the Test Scenario**
Once the workspace is started and completely loaded, we create a new directory that holds all files that are needed to execute CTT. 
In this example, we name it ``ServerlessToDoList``.
The CSAR files of the *Serverless ToDo-List API* service template and the *CTT Deployment Test Agent* are put into this directory, as well as an ``inputs.yaml`` file that provides some inputs needed for the deployment of the TI. 
It is necessary to fill in the fields ``vpc_subnet_id`` with the VPC subnet ID on AWS the instance is supposed to be deployed to, and ``ssh_key_name`` represents the SSH key name that is stored in AWS for deploying EC2 instances.
The field ``ssh_key_file`` should stay as is.
The following code listing shows an exemplary ``inputs.yaml`` file. ::

  ---
  vpc_subnet_id: "subnet-04706a8b41abdefa5"
  ssh_key_name: "awsec2"
  ssh_key_file: "/tmp/aws-ec2"
  ...

The configuration of the CTT execution itself is specified by a YAML configuration file. In this file, the following properties need to be defined:

- Name for the test configuration [``name``]
- Folder, the artifacts are placed in [``repository_url``]
- SUT CSAR path (relative to the folder) [``sut_tosca_path``]
- SUT inputs file (optional, relative to the folder) [``sut_inputs_path``]
- TI CSAR path (relative to the folder) [``ti_tosca_path``]
- TI inputs file (optional, relative to the folder) [``ti_inputs_path``]
- Test Id of the test to be executed (not yet taken into account) [``test_id``]
- Results output file path (relative to configuration file) [``result_destination_path``]

The following code listing shows an exemplary CTT configuration file named ``ctt_config.yaml``. ::

  {
    "name": "ServerlessToDoList-DeploymentTest",
    "repository_url": "ServerlessToDoList",
    "sut_tosca_path": "todolist.csar",
    "ti_tosca_path": "deploymentTestAgent.csar",
    "ti_inputs_path": "inputs.yaml",
    "test_id": "test_1",
    "result_destination_path": "serverless-test-results.zip"
  }

Please note that the folder property is currently named ``repository_url`` for technical reasons. In the future, this property will be renamed.

The resulting scenario can be seen in Figure 17.

.. figure:: imgs/CTT_scenario.png

   Figure 17: Severless ToDo-List API scenario in the RADON IDE

**3. Executing CTT**

After all preparations are finished, you can right-click on the ``ctt_config.yaml`` file and choose the option ``RadonCTT: Execute test configuration``.

The progress can be seen in the output panel (see Figure 18) and a progress bar appears on the lower right.

.. figure:: imgs/CTT_progress_log.png

   Figure 18: Progress log in the output panel of the RADON IDE

Depending on the underlying infrastructure, this process can take some time until the process is finished.
Once the process is finished, you can find the results in a ZIP-file located in the place you specified in the configuration file in ``result_destination_path`` (in this example, this would be ``serverless-test-results.zip``).



Other RADON Commands
""""""""""""""""""""
From the command palette of the IDE (shown with *Ctrl+Shift+P*), a RADON menu (Figure 20) is available to perform the following actions:

- Visualize the status of the deployment of a CSAR by selecting the *Show Deployment Status* option. Once this command is selected, a browser window connecting to the output console of the Jenkins that manages the deployment process will be opened;
- Open the RADON Help Page by selecting the *Open Help Page* option. Once this command is selected a browser window connecting to the RADON methodology, GitHub page will be opened.

.. figure:: imgs/RADON_menu_light.jpg

   Figure 20: RADON menu in the command palette.

   
   
