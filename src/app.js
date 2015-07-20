var util = require('./util.js');
var config = require('./config.js');
var $ = require('jquery');
var moment = require('moment');
var D = require('d.js');

util.timer.start();

var authButtonCounter = 0;
var delay = 400;
var clicks = 0;
var clickTimer = null;
var loro;
var LIKING;

var app = {};

app.manifest = chrome.runtime.getManifest();
app.authCode = undefined;

// save and retrieve from chrome local storage
app.setAuth = function (code){
  chrome.storage.local.set({'auth': code});
  this.authCode = code;
}

app.getAuth = function (){
  var deferred = D();
  chrome.storage.local.get('auth', function(code){
    this.authCode = code.auth;
    deferred.resolve(this.authCode);
  }.bind(this));
  return deferred.promise;
}

app.getPage = function (){
  return $('body').data('page');
}

app.processTime = function (ms){
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

app.updateStats = function (){
  chrome.storage.local.get('hinis', function(level){
    if (level.hinis){
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
  chrome.storage.local.get('total', function(level){
    if (level.total){
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

app.getTotalTabsOpened = function (){
  var deferred = D();
  chrome.storage.local.get('total', function(level){
    if (level.total) {
      deferred.resolve(level.total);
    } else {
      deferred.reject({});
    }
  });
  return deferred.promise;
}

app.toast = function (message, delay){
  $('.alert-container').removeClass('hidden').html(message);
  window.setTimeout(function(){
    $('.alert-container').addClass('hidden');
  }, delay);
}

console.info("Thanks for using InstaTab, you're running on version " + app.manifest.version);

module.exports = app;