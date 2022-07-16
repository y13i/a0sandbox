# a0sandbox

## Usage

1. Create a new repo forking this.
2. Create a new workspace on Terraform Cloud with Version Control Workflow and connect to the repo. Note that its name will also be used as the name of Vercel project (must be unique).
3. Create a new tenant on Auth0.
4. Create Terraform Cloud [application on Auth0](https://manage.auth0.com/#/applications) and allow Management API access.
5. Fill the Terraform Variables `auth0_domain`, `auth0_client_id` and `auth0_client_secret` with the values from the app created in the previous step.
