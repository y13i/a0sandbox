variable "vercel_api_token" {}
variable "github_repo" {}
variable "auth0_domain" {}
variable "auth0_client_id" {}
variable "auth0_client_secret" {}

variable "vercel_origin" {
  default = "https://${terraform.workspace}.vercel.app"
}
