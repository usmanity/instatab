var url = "https://instagram.com/oauth/authorize/?client_id=fdd685e3f1674541bf50829b962e9d1d&redirect_uri=" + window.location.origin   + "/src/auth/finished.html&response_type=token&scope=likes+relationships";
$("#authLink").attr('href', url);
var authCode = false;
chrome.storage.local.get('auth', function(code){
  authCode = code.auth;
  if (authCode !== ""){
    $("#loggedOut").addClass("hidden");
  } else {
    $("#loggedIn").addClass("hidden");
  }
});

$("#disconnect").click(function(){
  chrome.storage.local.set({'auth': ''});
  authCode = '';
  $("#disconnected").removeClass("hidden");
  $("#loggedIn").addClass("hidden");
});
