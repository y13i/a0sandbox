provider "auth0" {
  domain        = var.auth0_domain
  client_id     = var.auth0_client_id
  client_secret = var.auth0_client_secret
}

resource "auth0_connection" "default" {
  name     = "a0sandbox default"
  strategy = "auth0"
}

resource "auth0_resource_server" "a0sandbox_backend" {
  name       = "a0sandbox Next.js API Routes"
  identifier = "https://${terraform.workspace}.vercel.app/api/"
}

resource "auth0_client" "a0sandbox_frontend" {
  name                = "a0sandbox Next.js Frontend"
  app_type            = "spa"
  initiate_login_uri  = "https://${terraform.workspace}.vercel.app/login"
  callbacks           = ["https://${terraform.workspace}.vercel.app/callback"]
  allowed_logout_urls = ["https://${terraform.workspace}.vercel.app/"]
}
