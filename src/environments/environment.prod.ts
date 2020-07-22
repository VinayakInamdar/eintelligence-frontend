
export const environment = {
  production: true,
  apiUrl: 'https://eintelligencebackend.azurewebsites.net/api/',
  openIdConnectSettings: {
    authority: 'https://eintelligenceidentity.azurewebsites.net/',
    client_id: 'tourmanagementclient',
    redirect_uri: 'https://eintelligence.azurewebsites.net/signin-oidc',
    scope: 'openid profile roles tourmanagementapi',
    response_type: 'id_token token',
    post_logout_redirect_uri: 'https://eintelligence.azurewebsites.net/',
  },
};