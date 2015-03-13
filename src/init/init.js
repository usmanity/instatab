{{timer_start}}
// constants from config
var CLIENT_ID = "{{client_id}}";
var REDIRECT_URI = "chrome-extension://"+ window.location.origin.split("//")[1] +"/src/auth/finished.html";
var AUTH_URL = "https://instagram.com/oauth/authorize/?client_id=" + CLIENT_ID + "&redirect_uri=" + REDIRECT_URI + "&response_type=token&scope=likes+relationships";

var app = chrome.runtime.getManifest();
var authButtonCounter = 0;
var authCode;

// save and retrieve from chrome local storage
function setAuth(code){
  chrome.storage.local.set({'auth': code});
  authCode = code;
}
function getAuth(){
  chrome.storage.local.get('auth', function(code){
    authCode = code.auth;
  });
}
function getPage(){
  return $('body').data('page');
}
function processTime(ms){
  var seconds = ms * 1000;
  var timeSince = moment(seconds).fromNow(true);
  var now = moment();
  var diffInSeconds = now.diff(moment(seconds), 'seconds');
  var diffInMinutes = now.diff(moment(seconds), 'minutes');
  if (diffInMinutes > 60 || timeSince.indexOf('hour') !== -1){
    return Math.round(parseFloat(diffInMinutes / 60)) + 'h';
  } else if (timeSince.indexOf('minute') === -1){
    return diffInSeconds + 's';
  } else {
    return diffInMinutes + 'm';
  }
}

// a log in the dom
var _log = function(data){
  if (typeof(data) !== "object"){
    $(".log").text(data);
  };
};

console.info("Thanks for using Tabby, you're running on version " + app.version);
