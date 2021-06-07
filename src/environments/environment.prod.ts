export const environment = {
  production: true,
  stripe_key: 'pk_test_L4apfqRUqsnf9DlZceFAy4Wx',
  stripe_secreTkey: 'sk_test_K75p6KZMy95Lm1Ojt9ZW3Nsu00wxom9G1z',
  apiUrl: 'https://eintelligencebackend.azurewebsites.net/api/',
  facebook_appSecret: 'c487f4d66242b62431eb4bb26d785b84',
  facebook_appid: '448186179555932',//my
  facebook_appToken: '448186179555932|GnYxyy4pqi6B_f49gfVUkVwrMfM',
  facebook_userToken: 'EAAGXn3oGklwBAEDY2dpA11KLDG0hhHYWi9pts9qmPJxXs6Ywb4UOq6SRhvr5kFpNDeUrHkG1rIZCxHJMxQS3U7UurncvEnjuuaD4aLmKDAT5uIoSb3QWSE92GkLWOS0Oqub7ZAIcxwtMBAaLOSQWqEiwsMuqaugO5XwiXJx97ekfXeuB8cnQhISZAtINl8ZD',
  facebook_pageid : '102988865108273',//my
  openIdConnectSettings: {
    authority: 'https://eintelligenceidentity.azurewebsites.net/',
    client_id: 'tourmanagementclient',
    redirect_uri: 'https://eintelligence.azurewebsites.net/signin-oidc',
    scope: 'openid profile roles tourmanagementapi',
    response_type: 'id_token token',
    post_logout_redirect_uri: 'https://eintelligence.azurewebsites.net/',
  },
};