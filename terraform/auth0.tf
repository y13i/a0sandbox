provider "auth0" {
  domain        = var.auth0_domain
  client_id     = var.auth0_client_id
  client_secret = var.auth0_client_secret
}

resource "auth0_connection" "default" {
  name            = "a0sandbox-default"
  strategy        = "auth0"
  enabled_clients = [auth0_client.a0sandbox_frontend.id]
}

resource "auth0_resource_server" "a0sandbox_backend" {
  name       = "a0sandbox Next.js API Routes"
  identifier = "https://${terraform.workspace}.vercel.app/api/"
}

resource "auth0_client" "a0sandbox_frontend" {
  name                       = "a0sandbox Next.js Frontend"
  app_type                   = "spa"
  token_endpoint_auth_method = "none"
  grant_types                = ["authorization_code"]
  initiate_login_uri         = "https://${terraform.workspace}.vercel.app/login"
  callbacks                  = ["https://${terraform.workspace}.vercel.app/callback", "http://localhost:3000/callback"]
  allowed_logout_urls        = ["https://${terraform.workspace}.vercel.app/", "http://localhost:3000/"]
  web_origins                = ["https://${terraform.workspace}.vercel.app", "http://localhost:3000"]

  jwt_configuration {
    alg = "RS256"
  }
}

resource "null_resource" "test2" {
  provisioner "local-exec" {
    command = "node --version"
  }
}

resource "null_resource" "test3" {
  provisioner "local-exec" {
    command = "curl https://example.com"
  }
}

resource "null_resource" "test4" {
  provisioner "local-exec" {
    command = "jq --version"
  }
}
