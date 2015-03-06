// get client id from grunt
var CLIENT_ID = "";
var url = "https://instagram.com/oauth/authorize/?client_id=" + CLIENT_ID + "&redirect_uri=" + window.location.origin   + "/src/auth/finished.html&response_type=token&scope=likes+relationships";
var authLink = document.getElementById("authLink").href = url;

chrome.storage.local.get('auth', function(code){
  console.log(code.auth);
});
