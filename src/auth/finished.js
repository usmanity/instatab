var app = require('./../app.js');

if (app.getPage() === "finished"){
  access_token = location.hash.split("=")[1];
  app.setAuth(access_token);
}
