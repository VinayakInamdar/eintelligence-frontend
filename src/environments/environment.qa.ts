export const environment = {
  production: false,
  apiUrl: 'https://testbackend.azurewebsites.net/api/',
  frontedUrl: 'https://testapp.vncedge.com/',
  openIdConnectSettings: {
    authority: 'https://testlogin.vncedge.com',
    client_id: 'testclient',
    redirect_uri: 'https://testapp.vncedge.com/appWithoutSidebarAuthentication/signin-oidc',
    scope: 'openid profile roles tourmanagementapi',
    response_type: 'id_token token',
    post_logout_redirect_uri: 'https://testapp.vncedge.com/',
    automaticSilentRenew: true,
    silent_redirect_uri: 'https://testapp.vncedge.com/appWithoutSidebarAuthentication/redirect-silentrenew',
    loadUserInfo: true
  }
};

