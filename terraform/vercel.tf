provider "vercel" {
  api_token = var.vercel_api_token
}

resource "vercel_project" "default" {
  name      = var.project_name
  framework = "nextjs"


  git_repository = {
    type = "github"
    repo = var.github_repo
  }

  environment = [
    {
      key    = "NEXT_PUBLIC_AUTH0_DOMAIN"
      value  = var.auth0_domain
      target = ["production"]
    },
    {
      key    = "NEXT_PUBLIC_AUTH0_CLIENT_ID"
      value  = auth0_client.frontend.client_id
      target = ["production"]
    },
    {
      key    = "NEXT_PUBLIC_BASE_URI"
      value  = "https://${var.project_name}.vercel.app"
      target = ["production"]
    },
  ]
}

resource "vercel_deployment" "initial_deploy" {
  project_id = vercel_project.default.id
  ref        = "main"
}

output "project_url" {
  value = "https://${var.project_name}.vercel.app/"
}
