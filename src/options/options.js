var app = require('./../app.js');
var config = require('./../config.js');
var util = require('./../util.js');

var $ = require('jquery');

function showStats(){
  $(".stats").removeClass('hidden');
  app.getTotalTabsOpened().then(function(tabs){
    $('#totalNumber').text(util.numberWithCommas(tabs));
  });
}

if (app.getPage() === "options"){
  $("#authLink").attr('href', config.AUTH_URL);
  var intervalCounter = 0;
  var settings = {};
  var $loopSettings = $("input[name='loop']");
  var $gridSettings = $("input[name='grid']");
  app.getAuth();

  pageInterval = window.setInterval(function(){
    if (app.authCode === ""){
      $("#loggedIn").addClass("hidden");
      $("#loggedOut").removeClass("hidden");
    } else {
      $("#loggedIn").removeClass("hidden");
      $("#loggedOut").addClass("hidden");
    }
    if (intervalCounter > 4){
      window.clearInterval(pageInterval);
    } else {
      intervalCounter++;
    }
  }, 500);

  $("#disconnect").click(function(){
    app.setAuth('');
    $("#disconnected").removeClass("hidden");
    $("#loggedOut").removeClass("hidden");
    $("#loggedIn").addClass("hidden");
  });

  chrome.storage.local.get('options', function(cb){
    var options = cb.options;
    if (!options){
      return;
    }
    for (var i in $loopSettings) {
      if ($loopSettings[i].value == options.loop){
        $loopSettings[i].checked = true;
      }
    }

  });
  chrome.storage.local.get('layoutSettings', function(cb){
    var layoutSettings = cb.layoutSettings;
    if (!layoutSettings){
      return;
    }
    for (var i in $gridSettings) {
      if ($gridSettings[i].value == layoutSettings){
        $gridSettings[i].checked = true;
      }
    }
  });

  $loopSettings.on('change', function(event){
    settings.loop = event.target.value;
    chrome.storage.local.set({options: {loop: event.target.value}});

    // logging
    var eventProperties = {loopType: event.target.dataset.label};
    amplitude.logEvent("changed settings", eventProperties);
    app.toast("Settings updated to " + event.target.dataset.label, 2000);
  });

  $gridSettings.on('change', function(event){
    settings.grid = event.target.value;
    chrome.storage.local.set({layoutSettings: event.target.value});

    // logging
    var eventProperties = {
      gridSetting: event.target.dataset.label
    };
    amplitude.logEvent("changed settings", eventProperties);
    app.toast("Settings updated to " + event.target.dataset.label, 2000);
  });
}
