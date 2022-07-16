provider "vercel" {
  api_token = var.vercel_api_token
}

resource "vercel_project" "default" {
  name = terraform.workspace

  git_repository = {
    type = "github"
    repo = var.github_repo
  }

  framework = "nextjs"
}

output "project_url" {
  value = "https://${terraform.workspace}.vercel.app/"
}
