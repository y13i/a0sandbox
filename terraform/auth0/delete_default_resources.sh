access_token=$(curl -s --request POST \
  --url "https://${DOMAIN}/oauth/token" \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' \
  --data "client_id=${CLIENT_ID}" \
  --data "client_secret=${CLIENT_SECRET}" \
  --data "audience=https://${DOMAIN}/api/v2/" \
  | jq -r ".access_token")

default_client_id=$(curl -s --request GET \
  --url "https://${DOMAIN}/api/v2/clients" \
  --header "authorization: Bearer ${access_token}" \
  | jq -r '.[] | select(.name == "Default App") | .client_id')

curl -s --request DELETE \
  --url "https://${DOMAIN}/api/v2/clients/${default_client_id}" \
  --header "authorization: Bearer ${access_token}"

connections=$(curl -s --request GET \
  --url "https://${DOMAIN}/api/v2/connections" \
  --header "authorization: Bearer ${access_token}")
  
default_database_connection_id=$(echo $connections \
  | jq -r '.[] | select(.name == "Username-Password-Authentication") | .id')

curl -s --request DELETE \
  --url "https://${DOMAIN}/api/v2/connections/${default_database_connection_id}" \
  --header "authorization: Bearer ${access_token}"
  
default_google_connection_id=$(echo $connections \
  | jq -r '.[] | select(.name == "google-oauth2") | .id')

curl -s --request DELETE \
  --url "https://${DOMAIN}/api/v2/connections/${default_google_connection_id}" \
  --header "authorization: Bearer ${access_token}"
