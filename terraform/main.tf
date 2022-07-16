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
