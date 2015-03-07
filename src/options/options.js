$("#authLink").attr('href', AUTH_URL);
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
