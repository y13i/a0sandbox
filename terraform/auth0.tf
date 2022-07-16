provider "auth0" {
  domain        = var.auth0_domain
  client_id     = var.auth0_client_id
  client_secret = var.auth0_client_secret
}

resource "auth0_connection" "default" {
  name     = "default"
  strategy = "auth0"
}

resource "auth0_resource_server" "a0sandbox_backend" {
  name       = "a0sandbox Next.js API Routes"
  identifier = "https://${terraform.workspace}.vercel.app/api/"
}
