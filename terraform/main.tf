terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.11"
    }

    auth0 = {
      source  = "auth0/auth0"
      version = "~> 0.40"
    }
  }
}
