# a0sandbox

## Usage

1. Create a new repo templating this.
2. Create a new workspace on [Terraform Cloud](https://app.terraform.io/) with Version Control Workflow and connect to the repo.
3. Go to the workspace settings and set the `Terraform Working Directory` to `terraform`.
4. Create a new tenant on Auth0.
5. Create Terraform Cloud [application on Auth0](https://manage.auth0.com/#/applications) and allow Management API access.
6. Fill the Terraform Variables `auth0_domain`, `auth0_client_id` and `auth0_client_secret` with the values from the app created in the previous step.
7. Fill the Terraform Variable `github_repo` with the name of the new repo. (e.g. `username/reponame`)
8. Fill the Terraform Variable `project_name` with your desired name. **It must be globally unique**.
9. If you don't have the `vercel_api_token` in your [Global Variable Set](https://www.terraform.io/cloud-docs/workspaces/variables#scope), fill it with a [Vercel token](https://vercel.com/account/tokens).
10. Plan & Apply. Visit the `project_url` displayed in the `Outputs` section. 🐥🐥🐥
