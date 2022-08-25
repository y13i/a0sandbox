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
  enabled_clients = [auth0_client.frontend.id, auth0_client.saml.id, auth0_client.oidc.id]
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
  grant_types                = ["authorization_code", "refresh_token"]
  initiate_login_uri         = "https://${var.project_name}.vercel.app/auth/login"
  callbacks                  = ["https://${var.project_name}.vercel.app/auth/callback", "http://localhost:3000/auth/callback"]
  allowed_logout_urls        = ["https://${var.project_name}.vercel.app/", "http://localhost:3000/"]
  web_origins                = ["https://${var.project_name}.vercel.app", "http://localhost:3000"]
  allowed_origins            = ["https://${var.project_name}.vercel.app", "http://localhost:3000"]

  jwt_configuration {
    alg = "RS256"
  }
}

resource "auth0_client" "saml" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  name                       = "SAML IdP"
  app_type                   = "regular_web"
  token_endpoint_auth_method = "client_secret_post"
  grant_types                = ["authorization_code", "refresh_token"]
  callbacks                  = ["https://${var.auth0_domain}/login/callback?connection=saml"]

  addons {
    samlp {
      audience                           = "urn:auth0:${split(".", var.auth0_domain)[0]}:saml"
      create_upn_claim                   = true
      digest_algorithm                   = "sha256"
      include_attribute_name_format      = true
      lifetime_in_seconds                = 3600
      map_identities                     = true
      map_unknown_claims_as_is           = true
      name_identifier_format             = "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"
      passthrough_claims_with_no_mapping = true
      signature_algorithm                = "rsa-sha256"
      typed_attributes                   = true
    }
  }
}

resource "auth0_connection" "saml" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  name            = "saml"
  strategy        = "samlp"
  enabled_clients = [auth0_client.frontend.id]
  show_as_button  = true

  options {
    signing_cert        = auth0_client.saml.signing_keys[0]["cert"]
    sign_in_endpoint    = "https://${var.auth0_domain}/samlp/${auth0_client.saml.client_id}"
    sign_out_endpoint   = "https://${var.auth0_domain}/samlp/${auth0_client.saml.client_id}/logout"
    metadata_url        = "https://${var.auth0_domain}/samlp/metadata/${auth0_client.saml.client_id}"
    signature_algorithm = "rsa-sha256"
    digest_algorithm    = "sha256"
  }
}

resource "auth0_client" "oidc" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  name                       = "OIDC IdP"
  app_type                   = "regular_web"
  token_endpoint_auth_method = "client_secret_post"
  grant_types                = ["authorization_code", "refresh_token"]
  callbacks                  = ["https://${var.auth0_domain}/login/callback"]

  jwt_configuration {
    alg = "RS256"
  }
}

resource "auth0_connection" "oidc" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  name            = "oidc"
  display_name    = "oidc"
  strategy        = "oidc"
  enabled_clients = [auth0_client.frontend.id]
  show_as_button  = true

  options {
    authorization_endpoint = "https://${var.auth0_domain}/authorize"
    client_id              = auth0_client.oidc.client_id
    client_secret          = auth0_client.oidc.client_secret
    discovery_url          = "https://${var.auth0_domain}/.well-known/openid-configuration"
    issuer                 = "https://${var.auth0_domain}/"
    jwks_uri               = "https://${var.auth0_domain}/.well-known/jwks.json"
    scopes                 = ["openid", "profile", "email"]
    token_endpoint         = "https://${var.auth0_domain}/oauth/token"
    type                   = "back_channel"
    userinfo_endpoint      = "https://${var.auth0_domain}/userinfo"
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
  depends_on = [
    null_resource.delete_default_resources
  ]

  client_id = auth0_client.extensibility.id
  audience  = "https://${var.auth0_domain}/api/v2/"
  scope     = ["read:users", "update:users_app_metadata"]
}

resource "auth0_action" "post_login" {
  depends_on = [
    null_resource.delete_default_resources
  ]

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
    version = "2.42.0"
  }

  dependencies {
    name    = "winston"
    version = "3.8.1"
  }

  secrets {
    name  = "domain"
    value = var.auth0_domain
  }

  secrets {
    name  = "clientId"
    value = auth0_client.extensibility.client_id
  }

  secrets {
    name  = "clientSecret"
    value = auth0_client.extensibility.client_secret
  }
}

resource "auth0_trigger_binding" "post_login" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  trigger = "post-login"

  actions {
    id           = auth0_action.post_login.id
    display_name = auth0_action.post_login.name
  }
}

resource "auth0_action" "pre_user_registration" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  name    = "pre-user-registration"
  runtime = "node16"
  code    = file("./auth0/pre_user_registration.js")
  deploy  = true

  supported_triggers {
    id      = "pre-user-registration"
    version = "v2"
  }
}

resource "auth0_trigger_binding" "pre_user_registration" {
  depends_on = [
    null_resource.delete_default_resources
  ]

  trigger = "pre-user-registration"

  actions {
    id           = auth0_action.pre_user_registration.id
    display_name = auth0_action.pre_user_registration.name
  }
}

# resource "auth0_action" "post_user_registration" {
#   depends_on = [
#     null_resource.delete_default_resources
#   ]

#   name    = "post-user-registration"
#   runtime = "node16"
#   code    = file("./auth0/post_user_registration.js")
#   deploy  = true

#   supported_triggers {
#     id      = "post-user-registration"
#     version = "v2"
#   }

#   dependencies {
#     name    = "auth0"
#     version = "2.42.0"
#   }

#   dependencies {
#     name    = "winston"
#     version = "3.8.1"
#   }

#   secrets {
#     name  = "domain"
#     value = var.auth0_domain
#   }

#   secrets {
#     name  = "clientId"
#     value = auth0_client.extensibility.client_id
#   }

#   secrets {
#     name  = "clientSecret"
#     value = auth0_client.extensibility.client_secret
#   }
# }

# resource "auth0_trigger_binding" "post_user_registration" {
#   depends_on = [
#     null_resource.delete_default_resources
#   ]

#   trigger = "post-user-registration"

#   actions {
#     id           = auth0_action.post_user_registration.id
#     display_name = auth0_action.post_user_registration.name
#   }
# }
