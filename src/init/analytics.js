(function(e,t){var r=e.amplitude||{};var n=t.createElement("script");n.type="text/javascript";
  n.async=true;n.src="https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-2.0.4-min.js";
  var s=t.getElementsByTagName("script")[0];s.parentNode.insertBefore(n,s);r._q=[];
  function a(e){r[e]=function(){r._q.push([e].concat(Array.prototype.slice.call(arguments,0)))
  }}var i=["init","logEvent","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","setGlobalUserProperties"];
  for(var o=0;o<i.length;o++){a(i[o])}e.amplitude=r})(window,document);

  amplitude.init("{{amplitude_key}}");

  var setUser = function(){
    var instagramUrl = "https://api.instagram.com/v1/users/self/";
    $.ajax({
      url: instagramUrl,
      data: {
        access_token: authCode
      },
      success: function(response){
        amplitude.setUserId(response.data.username);
      },
      dataType: 'jsonp'
    });
  };

  var eventProperties = {
    appVersion: app.version
  };
  amplitude.logEvent("opened new tab", eventProperties);
