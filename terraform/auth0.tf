provider "auth0" {
  domain        = var.auth0_domain
  client_id     = var.auth0_client_id
  client_secret = var.auth0_client_secret
}
resource "null_resource" "delete_default_resources" {
  provisioner "local-exec" {
    command = file("./auth0/delete_default_resources.sh")

    environment = {
      DOMAIN        = var.auth0_domain
      CLIENT_ID     = var.auth0_client_id
      CLIENT_SECRET = var.auth0_client_secret
    }
  }
}

resource "auth0_connection" "default" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  name            = "a0sandbox-default"
  strategy        = "auth0"
  enabled_clients = [auth0_client.a0sandbox_frontend.id]
}

resource "auth0_resource_server" "a0sandbox_backend" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  name       = "a0sandbox Next.js API Routes"
  identifier = "https://${var.project_name}.vercel.app/api/"
}

resource "auth0_client" "a0sandbox_frontend" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  name                       = "a0sandbox Next.js Frontend"
  app_type                   = "spa"
  token_endpoint_auth_method = "none"
  grant_types                = ["authorization_code"]
  initiate_login_uri         = "https://${var.project_name}.vercel.app/login"
  callbacks                  = ["https://${var.project_name}.vercel.app/callback", "http://localhost:3000/callback"]
  allowed_logout_urls        = ["https://${var.project_name}.vercel.app/", "http://localhost:3000/"]
  web_origins                = ["https://${var.project_name}.vercel.app", "http://localhost:3000"]

  jwt_configuration {
    alg = "RS256"
  }
}

resource "auth0_action" "post_login" {
  name    = "post-login"
  runtime = "node16"
  code    = file("./auth0/post_login.js")
  deploy  = true

  supported_triggers {
    id      = "post-login"
    version = "v3"
  }
}

resource "auth0_trigger_binding" "post_login" {
  trigger = "post-login"

  actions {
    id           = auth0_action.post_login.id
    display_name = auth0_action.post_login.name
  }
}
