terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.6"
    }

    auth0 = {
      source  = "auth0/auth0"
      version = "~> 0.33"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_token
}

provider "auth0" {
  domain        = var.auth0_domain
  client_id     = var.auth0_client_id
  client_secret = var.auth0_client_secret
}
