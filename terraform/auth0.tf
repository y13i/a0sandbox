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

resource "auth0_connection" "db" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  name            = "db"
  strategy        = "auth0"
  enabled_clients = [auth0_client.frontend.id]
}

resource "auth0_resource_server" "backend_vercel" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  name       = "Next.js Backend (Vercel)"
  identifier = "https://${var.project_name}.vercel.app/api/"
}

resource "auth0_resource_server" "backend_localhost" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  name       = "Next.js Backend (localhost)"
  identifier = "http://localhost:3000/api/"
}

resource "auth0_client" "frontend" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  name                       = "Next.js Frontend"
  app_type                   = "spa"
  token_endpoint_auth_method = "none"
  grant_types                = ["authorization_code"]
  initiate_login_uri         = "https://${var.project_name}.vercel.app/auth/login"
  callbacks                  = ["https://${var.project_name}.vercel.app/auth/callback", "http://localhost:3000/auth/callback"]
  allowed_logout_urls        = ["https://${var.project_name}.vercel.app/", "http://localhost:3000/"]
  web_origins                = ["https://${var.project_name}.vercel.app", "http://localhost:3000"]
  allowed_origins            = ["https://${var.project_name}.vercel.app", "http://localhost:3000"]

  jwt_configuration {
    alg = "RS256"
  }
}

resource "auth0_client" "extensibility" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  name                       = "extensibility"
  app_type                   = "non_interactive"
  token_endpoint_auth_method = "client_secret_post"
  grant_types                = ["client_credentials"]

  jwt_configuration {
    alg = "RS256"
  }
}

resource "auth0_client_grant" "extensibility" {
  client_id = auth0_client.extensibility.id
  audience  = "${var.auth0_domain}/api/v2/"
  scope     = ["read:users", "update:users_app_metadata"]
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

  dependencies {
    name    = "auth0"
    version = "latest"
  }

  dependencies {
    name    = "winston"
    version = "latest"
  }

  secrets {
    name  = "domain"
    value = var.auth0_domain
  }

  secrets {
    name  = "client_id"
    value = auth0_client.extensibility.client_id
  }

  secrets {
    name  = "client_secret"
    value = auth0_client.extensibility.client_secret
  }
}

resource "auth0_trigger_binding" "post_login" {
  trigger = "post-login"

  actions {
    id           = auth0_action.post_login.id
    display_name = auth0_action.post_login.name
  }
}

# resource "auth0_action" "pre_user_registration" {
#   name    = "pre-user-registration"
#   runtime = "node16"
#   code    = file("./auth0/pre_user_registration.js")
#   deploy  = true

#   supported_triggers {
#     id      = "pre-user-registration"
#     version = "v2"
#   }
# }

# resource "auth0_trigger_binding" "pre_user_registration" {
#   trigger = "pre-user-registration"

#   actions {
#     id           = auth0_action.pre_user_registration.id
#     display_name = auth0_action.pre_user_registration.name
#   }
# }

# resource "auth0_action" "post_user_registration" {
#   name    = "post-user-registration"
#   runtime = "node16"
#   code    = file("./auth0/post_user_registration.js")
#   deploy  = true

#   supported_triggers {
#     id      = "post-user-registration"
#     version = "v2"
#   }
# }

# resource "auth0_trigger_binding" "post_user_registration" {
#   trigger = "post-user-registration"

#   actions {
#     id           = auth0_action.post_user_registration.id
#     display_name = auth0_action.post_user_registration.name
#   }
# }
