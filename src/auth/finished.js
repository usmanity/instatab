var CLIENT_ID = {{client_id}};
var url = window.location.href;
var code = document.getElementById("code");
var authCode = window.location.href.split('#')[1].split("=")[1];

function setAuth(){
  chrome.storage.local.set({ 'auth': authCode });
}

setAuth();
