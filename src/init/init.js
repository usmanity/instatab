{{timer_start}}
// constants from config
var CLIENT_ID = "{{client_id}}";
var REDIRECT_URI = "chrome-extension://"+ window.location.origin.split("//")[1] +"/src/auth/finished.html";
var AUTH_URL = "https://instagram.com/oauth/authorize/?client_id=" + CLIENT_ID + "&redirect_uri=" + REDIRECT_URI + "&response_type=token&scope=likes+relationships";

var app = chrome.runtime.getManifest();
var authButtonCounter = 0;
var authCode;
var delay = 500;
var clicks = 0;
var clickTimer = null;
var loro;

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
// function getTribute(){
//   var level;
//   chrome.storage.local.get('hinis', function(current){
//     level = current;
//     if (level){
//       if (level.hinis > 10){
//         loro = true;
//         chrome.storage.local.set({
//           'hinis': 0
//         });
//       } else {
//         chrome.storage.local.set({
//           'hinis': level.hinis + 1
//         });
//       }
//     } else {
//       chrome.storage.local.set({
//         'hinis': 1
//       });
//     }
//   });
// }
// function checkForTribute(){
//   chrome.storage.local.get('rekt', function(air){
//     if (air.rekt){
//       return;
//     } else {
//       getTribute();
//     }
//   });
// }

// to options page for new users
// var first_run = false;
// if (!localStorage['ran_before']) {
//   first_run = true;
//   localStorage['ran_before'] = '1';
// }
//
// if (first_run) {
//   chrome.tabs.create({url: "src/options/index.html"});
// }

// checkForTribute();
console.info("Thanks for using InstaTab, you're running on version " + app.version);
