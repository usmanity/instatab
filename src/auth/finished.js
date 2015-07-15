var init = require('./../init/init.js');

if (init.getPage() === "finished"){
  access_token = location.hash.split("=")[1];
  init.setAuth(access_token);
}
