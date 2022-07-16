resource "vercel_project" "default" {
  name = terraform.workspace

  git_repository = {
    type = "github"
    repo = var.github_repo
  }
}
