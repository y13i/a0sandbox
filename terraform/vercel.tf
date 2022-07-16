provider "vercel" {
  api_token = var.vercel_api_token
}

resource "vercel_project" "default" {
  name      = terraform.workspace
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
      value  = auth0_client.a0sandbox_frontend.client_id
      target = ["production"]
    },
    {
      key    = "NEXT_PUBLIC_BASE_URI"
      value  = "https://${terraform.workspace}.vercel.app"
      target = ["production"]
    },
  ]
}

output "project_url" {
  value = "https://${terraform.workspace}.vercel.app/"
}
