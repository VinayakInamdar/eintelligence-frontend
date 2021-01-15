export const environment = {
  production: true,
  stripe_key: 'pk_test_L4apfqRUqsnf9DlZceFAy4Wx',
  stripe_secreTkey: 'sk_test_K75p6KZMy95Lm1Ojt9ZW3Nsu00wxom9G1z',
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