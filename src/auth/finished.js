if (getPage() === "finished"){
  access_token = location.hash.split("=")[1];
  setAuth(access_token);
}
