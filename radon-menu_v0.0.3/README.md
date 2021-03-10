# radon-menu README

This plugin provides a RADON menu with custom RADON commands.

## Features

- RADON command to trigger CI of a CSAR
- RADON command to show CI status
- RADON command to open the RADON documentation page
- RADON command to open the RADON Monitoring page

## Requirements


## Extension Settings


## Known Issues


## Release Notes

### 0.0.1

Initial release

The deployment process of a CSAR is managed by a Jenkins job. The job is triggered when a CSAR is uploaded on the temporary repository "radon-csar" available here https://github.com/radon-h2020/radon-csars

### 0.0.2

The CI process of a CSAR is managed by a Jenkins job. The user can upload the CSAR on the Template Library and trigger a Jenkins job which will manage the deployment process of the CSAR interacting with the Orchestrator.
