function showStats(){
  $(".stats").removeClass('hidden');
  getTotalTabsOpened().then(function(tabs){
    $('#totalNumber').text(numberWithCommas(tabs));
  });
}
if (getPage() === "options"){
  $("#authLink").attr('href', AUTH_URL);
  var intervalCounter = 0;
  var settings = {};
  var $loopSettings = $("input[name='loop']");
  var $gridSettings = $("input[name='grid']");
  getAuth();

  pageInterval = window.setInterval(function(){
    if (authCode === ""){
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
    setAuth('');
    $("#disconnected").removeClass("hidden");
    $("#loggedOut").removeClass("hidden");
    $("#loggedIn").addClass("hidden");
  });
  $(window).konami();
  $(window).on('konami', function() {
    console.log("Tributes disabled!");
    chrome.storage.local.set({rekt: 'dabes'});
    amplitude.logEvent('konami enabled');
    toast('<strong>Konami enabled!</strong><br> You will now see beta features throughout InstaTab!', 2000);
    showStats();
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
    toast("Settings updated to " + event.target.dataset.label, 2000);
  });

  $gridSettings.on('change', function(event){
    settings.grid = event.target.value;
    chrome.storage.local.set({layoutSettings: event.target.value});

    // logging
    var eventProperties = {gridSetting: event.target.dataset.label};
    amplitude.logEvent("changed settings", eventProperties);
    toast("Settings updated to " + event.target.dataset.label, 2000);
  });
}
