var url = "https://instagram.com/oauth/authorize/?client_id=fdd685e3f1674541bf50829b962e9d1d&redirect_uri=" + window.location.origin   + "/src/auth/finished.html&response_type=token&scope=likes+relationships";
var authLink = document.getElementById("authLink").href = url;

chrome.storage.local.get('auth', function(code){
  console.log(code.auth);
});
