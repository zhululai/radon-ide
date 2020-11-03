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

As depicted in Figure 4, a RADON workspace is started. It provides the “radon-particles” modeling project with a directory structure compliant with the GMT and the set of integrated RADON tools enabled (i.e., GMT, VT, DT, DPT).

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
2. Press *Enter* to clone the project in the workspave


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
2. Press *Enter* to clone the project in the workspave

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

xOpera SaaS
***********

The xOpera SaaS orchestrator is used to deploy the application blueprint (CSAR)
within the RADON IDE. Initially, the TOSCA opera orchestrator was available
only as a CLI tool (it can be be downloaded from the Python Package Index:
https://pypi.org/project/opera/)

The SaaS orchestrator has been developed with the integration in mind and
includes the API allowing managing all orchestrator functions and the
integration with KeyCloak identity manager that allows easy integration with
other identity management services.

Apart from Identity Manager (KeyCloak) and a web GUI, the orchestrator has also
Che and Visual Studio Code plugin that provides the ability to create and run
deployment projects created inside the SaaS orchestrator.

There are currently two commands that can be invoked from the explorer Eclipse
Che Theia/Visual Studio Code context. These are:

- "xOpera SaaS: Create project from CSAR"
- "xOpera SaaS: Delete login info"

The authentication to the SaaS component is performed in the similar way as
this is done for the Template library. This means that when using the SaaS
plugin the first time, the user will be prompted to select his preferred way
of logging in. This can be either through an XLAB KeyCloak instance or through
any of the connected identity providers (like RADON IDE KeyCloak). After that
the login data will be saved and the user will be able to invoke the plugin
commands (if the user would want to remove his saved login data he could click
on the "xOpera SaaS: Delete login info" option).

The main command is "xOpera SaaS: Create project from CSAR". By invoking this,
the plugin currently allows users to:

- create a new workspace
- create a new project in a new or existing workspace
- deploy a project

The functions through the plugin are a bit limited, as it is more convenient
than other actions are performed through the Opera SaaS web interface.

.. figure:: imgs/xopera-saas/deploy_csar.png

   Figure 16: Deployment of the CSAR.

User can invoke the main plugin actions by right clicking on the compressed
TOSCA CSAR (file should include .zip or .csar extension). Then the plugin will
interactively guide him through the creation of workspace and the project.

.. figure:: imgs/xopera-saas/create_project.png

   Figure 17: Creating a new project.

After that you will be asked if you want to deploy the CSAR from the project.
The deployment process starts right away and gives you the deployment outputs
from the xOpera SaaS orchestrator. Then the plugin will then redirect you to
the SaaS UI where you will be able to see your created workspace and project.

.. figure:: imgs/xopera-saas/redirect.png

   Figure 18: The xOpera SaaS plugin redirection.

Deploy the application
""""""""""""""""""""""

To start the deployment process, select the CSAR, stored in the radon-csar project, make a right-click on it and select the *Deploy* option as depicted in Figure 21.
During the deployment process, the CSAR will be published to the Template Library and a Jenkins job will be triggered to manage the deployment of the CSAR with the Orchestrator.

.. figure:: imgs/Deploy_CSAR_light.jpg

   Figure 19: Deploy of the CSAR.

Other RADON Commands
""""""""""""""""""""
From the command palette of the IDE (shown with *Ctrl+Shift+P*), a RADON menu (Figure 17) is available to perform the following actions:

- Visualize the status of the deployment of a CSAR by selecting the *Show Deployment Status* option. Once this command is selected, a browser window connecting to the output console of the Jenkins that manages the deployment process will be opened;
- Open the RADON Help Page by selecting the *Open Help Page* option. Once this command is selected a browser window connecting to the RADON methodology, GitHub page will be opened.

.. figure:: imgs/RADON_menu_light.jpg

   Figure 20: RADON menu in the command palette.

   
   