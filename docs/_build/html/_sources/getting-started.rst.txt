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

1. Press *Ctlt+Shift+P* to open the command palette. Select the *Git:Clone* command and type the Repository URL of the verification tool sample project. 
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

1. Press *Ctlt+Shift+P* to open the command palette. Select the *Git:Clone* command and type the Repository URL of the decomposition tool sample project. 
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

The Continuous Testing Tool (CTT) is used within the RADON IDE to define and execute tests, which are specified in a CSAR for a system under test (SUT). To get started, you can clone the `CTT sample project <https://github.com/radon-h2020/demo-ctt-imageresize>`_. To clone this project use the Git functionalities provided in the workspace as described below:

1. Press *Ctlt+Shift+P* to open the command palette. Select the *Git:Clone* command and type the above repository URL of the CTT sample project. 
2. Press *Enter* to clone the project in the workspace

In the folder *radon-ctt/*, you will find sample CSAR files for the SUT and the test infrastructure (TI). These files are exports from the service templates that can also be found in the RADON Particles. Hence, for using other SUT and TI CSAR files, users will need to export them via GMT. 

To create a CTT configuration for an SUT CSAR file, make a right-click on the file, e.g., *sut-ec2.csar*, and select "Create test configuration" (Figure 17).

.. figure:: imgs/CTT_create_config.png

   Figure 17: Creating a configuration file template for a CSAR.

You fill find a new configuration file next to the CSAR file, e.g., *sut-ec2_testconfig.yml*. Double-click on the configuration file and it will be shown in the editor. Once the configuration file has been completed, the execution can by triggered by a right-click on the file and selecting "Execute test configuration" (Figure 18). 

.. figure:: imgs/CTT_trigger_execution.png

   Figure 18: Executing CTT based on a configuration file.

CTT will now execute all steps of the CTT workflow, including the deployment of the SUT and the CSAR, as well as executing the tests and fetching the results. After a successful execution, the results are stored in the configured folder (Figure 19).

.. figure:: imgs/CTT_results.png

   Figure 19: Results of the test execution.


Other RADON Commands
""""""""""""""""""""
From the command palette of the IDE (shown with *Ctrl+Shift+P*), a RADON menu (Figure 20) is available to perform the following actions:

- Visualize the status of the deployment of a CSAR by selecting the *Show Deployment Status* option. Once this command is selected, a browser window connecting to the output console of the Jenkins that manages the deployment process will be opened;
- Open the RADON Help Page by selecting the *Open Help Page* option. Once this command is selected a browser window connecting to the RADON methodology, GitHub page will be opened.

.. figure:: imgs/RADON_menu_light.jpg

   Figure 20: RADON menu in the command palette.

   
   