{{timer_start}}
// constants from config
var CLIENT_ID = "{{client_id}}";
var REDIRECT_URI = "chrome-extension://"+ window.location.origin.split("//")[1] +"/src/auth/finished.html";
var AUTH_URL = "https://instagram.com/oauth/authorize/?client_id=" + CLIENT_ID + "&redirect_uri=" + REDIRECT_URI + "&response_type=token&scope=likes+relationships+comments";

var app = chrome.runtime.getManifest();
var authButtonCounter = 0;
var authCode;
var delay = 500;
var clicks = 0;
var clickTimer = null;
var loro;
var COUNT = 15;
var LIKING;

// save and retrieve from chrome local storage
function setAuth(code){
  chrome.storage.local.set({'auth': code});
  authCode = code;
}

function getAuth(){
  return new Promise(function(fulfill, reject){
    chrome.storage.local.get('auth', function(code){
      authCode = code.auth;
      fulfill();
    });
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

function getStats(){
  var level;
  chrome.storage.local.get('hinis', function(current){
    level = current;
    console.log(level);
    if (level){
      if (level.hinis > 10){
        loro = true;
        amplitude.logEvent('ten tabs opened');
        chrome.storage.local.set({
          'hinis': 0
        });
      } else {
        chrome.storage.local.set({
          'hinis': level.hinis + 1
        });
      }
    } else {
      chrome.storage.local.set({
        'hinis': 1
      });
    }
  });

  chrome.storage.local.get('total', function(current){
    level = current;
    console.log(level);
    if (level){
      chrome.storage.local.set({
        'total': level.total + 1
      });
    } else {
      chrome.storage.local.set({
        'total': 1
      });
    }
  });
}

function checkForTribute(){
  chrome.storage.local.get('rekt', function(air){
    if (air.rekt){
      return;
    } else {
      getStats();
    }
  });
}

checkForTribute();
console.info("Thanks for using InstaTab, you're running on version " + app.version);
