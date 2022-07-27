# a0sandbox

## Usage

1. Create a new repo forking this.
2. Create a new workspace on [Terraform Cloud](https://app.terraform.io/) with Version Control Workflow and connect to the repo. Note that its name will also be used as the name of Vercel project (must be unique).
3. Go to the workspace settings and set the `Terraform Working Directory` to `terraform`.
4. Create a new tenant on Auth0.
5. Create Terraform Cloud [application on Auth0](https://manage.auth0.com/#/applications) and allow Management API access.
6. Fill the Terraform Variables `auth0_domain`, `auth0_client_id` and `auth0_client_secret` with the values from the app created in the previous step.
7. Fill the Terraform Variable `github_repo` with the name of the new repo. (e.g. `username/reponame`)
8. (If you don't have the `vercel_api_token` variable globally) fill it with a [Vercel token](https://vercel.com/account/tokens).
9. Plan & Apply. Visit the `project_url` displayed in the `Outputs` section. 🐥🐥🐥
