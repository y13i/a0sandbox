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

resource "null_resource" "delete_default_resources" {
  provisioner "local-exec" {
    command = <<-EOS
      access_token=$(curl -s --request POST \
        --url "https://$${DOMAIN}/oauth/token" \
        --header 'content-type: application/x-www-form-urlencoded' \
        --data 'grant_type=client_credentials' \
        --data "client_id=$${CLIENT_ID}" \
        --data "client_secret=$${CLIENT_SECRET}" \
        --data "audience=https://$${DOMAIN}/api/v2/" \
        | jq -r ".access_token")

      default_client_id=$(curl -s --request GET \
        --url "https://$${DOMAIN}/api/v2/clients" \
        --header "authorization: Bearer $${access_token}" \
        | jq -r '.[] | select(.name == "Default App") | .client_id')

      curl -s --request DELETE \
        --url "https://$${DOMAIN}/api/v2/clients/$${default_client_id}" \
        --header "authorization: Bearer $${access_token}"
        
      default_database_connection_id=$(curl -s --request GET \
        --url "https://$${DOMAIN}/api/v2/connections" \
        --header "authorization: Bearer $${access_token}" \
        | jq -r '.[] | select(.name == "Username-Password-Authentication") | .id')

      curl -s --request DELETE \
        --url "https://$${DOMAIN}/api/v2/connections/$${default_database_connection_id}" \
        --header "authorization: Bearer $${access_token}"
        
      default_google_connection_id=$(curl -s --request GET \
        --url "https://$${DOMAIN}/api/v2/connections" \
        --header "authorization: Bearer $${access_token}" \
        | jq -r '.[] | select(.name == "google-oauth2") | .id')

      curl -s --request DELETE \
        --url "https://$${DOMAIN}/api/v2/connections/$${default_google_connection_id}" \
        --header "authorization: Bearer $${access_token}"
    EOS

    environment = {
      DOMAIN        = var.auth0_domain
      CLIENT_ID     = var.auth0_client_id
      CLIENT_SECRET = var.auth0_client_secret
    }
  }
}
