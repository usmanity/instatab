var CLIENT_ID = "{{client_id}}";
var REDIRECT_URI = "{{redirect_uri}}";
var AUTH_URL = "https://instagram.com/oauth/authorize/?client_id=" + CLIENT_ID + "&redirect_uri=" + REDIRECT_URI + "&response_type=token&scope=likes+relationships";

var app = chrome.runtime.getManifest();
var authButtonCounter = 0;
var authCode = '';


// save and retrieve from chrome local storage
function setAuth(){
  chrome.storage.local.set({ 'auth': authCode });
}

function getAuth(){
  chrome.storage.local.get('auth');
}

// a log in the dom
var _log = function(data){
  if (typeof(data) !== "object"){
    $(".log").text(data);
  };
};
