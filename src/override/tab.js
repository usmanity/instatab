var init = require('./../init/init.js');
var config = require('./../config.js');
var util = require('./../util.js');

var getInstagramFeed = function(){
  var instagramUrl = "https://api.instagram.com/v1/users/self/feed";
  $.ajax({
    url: instagramUrl,
    data: {
      access_token: init.authCode,
      count: config.count
    },
    success: function(response){
      displayFeed(response);
    },
    error: function(){
        window.setTimeout(function(){
          $(".disconnected").removeClass('hidden');
        }, 500);
    },
    dataType: 'jsonp'
  });
};

var displayFeed = function(feed){
  var totalPhotos = 8;
  getSettings('layoutSettings').then(function(settings){
    if (settings == 'grid'){
      totalPhotos = 8;
      return 'low_resolution';
    } else if (settings == 'single'){
      totalPhotos = 1;
      return 'standard_resolution';
    } else {
      return 'standard_resolution';
    }
  }, function(error){
    totalPhotos = 8;
    if (amplitude) {
      amplitude.logEvent(error);
    }
    return 'standard_resolution';
  }).then(function(resolution){
    amplitude.logEvent("resolution", { res: resolution});
    amplitude.logEvent("totalPhotos", {count: totalPhotos});
    for (var i = 0; i < totalPhotos; i++){
        var post = feed.data[i];
        var timeSince = init.processTime(post.created_time);
        var imageUrl = post.images[resolution].url;
        var username = post.user;
        var $el = $("<div class='container'></div>");
        var type = feed.data[i].type;
        if (type === "image"){
          var $container = $("<span class='photo' data-href='"+ post.link +"' data-id='" + post.id + "'><img src='" + imageUrl + "'></span>");
        } else {
          var videoUrl = post.videos[resolution].url;
          var $container = $("<video loop src='" + videoUrl + "'></video>");
        }
        var $username = $("<a class='username'>" + username.username + "</a>").attr("href", "https://instagram.com/" + username.username);
        var $avatar = $("<span class='avatar'></span>").css({
          "background-image": "url(" + username.profile_picture + ")"
        });
        var $time = $("<span class='time'>"+ timeSince +"</span>");
        var $heart = $("<span class='heart' data-id='' style='display:none;'></span>");
        if (post.caption){
          var $caption = $("<span class='caption'>"+ post.caption.text +"</span>")
        } else {
          var $caption = $("<span class='caption hidden'></span>")
        }
        var $liked = $("<span class='liked hidden'></span>")
        $username.prepend($avatar).append($time);
        $container.append($heart).append($caption).append($liked);
        if (post.user_has_liked){
          $liked.removeClass('hidden');
        }
        $el.append($username).append($container);
        if (type === "video"){
          var $play = $("<div class='play'></div>");
          $el.append($play);
        }
        $el.on('click', event, handleSingleClick).on('dblClick', event, handleDoubleClick);
        if (i < 4){
          $(".first-row").append($el);
        } else {
          $(".second-row").append($el);
        }
    }
  })

  getSettings('options').then(function(settings){
    var loopSetting = settings.loop === 'true';
    $("video").attr('loop', loopSetting);
  });
  $(".container").on("click", event, handleSingleClick).on("dblclick", event, handleDoubleClick);
  util.timer.end();
};

function play(event){
  $(event.target).parent().find('video').trigger('play');
  $(event.target).parent().find('.play').addClass('hidden');
  $(event.target).parent().unbind('click').click(pause);
}

function pause(){
  $(this).find('video').trigger('pause');
  $(this).find('.play').removeClass('hidden');
  $(this).unbind('click').click(play);
}

function getSettings(option){
  var deferred = D();
  chrome.storage.local.get(option, function(cb){
    var options = cb[option];
    if (!options) {
      var error = option + ' not found';
      deferred.reject(error);
    }
    deferred.resolve(options);
  });
  return deferred.promise;
}

function handleSingleClick(event){
    clicks++;
    if (clicks === 1){
        if (event.target.tagName === "IMG" || event.target.className.indexOf('caption') === 0){
            clickTimer = setTimeout(function(){
                clicks = 0;
                window.location = $(event.target).parent().data('href');
            }, delay);
        } else {
            clickTimer = setTimeout(function(){
                clicks = 0;
                play(event);
            }, delay);
        }
    } else {
        clearTimeout(clickTimer);
        if (!LIKING){
            likeThis(event.target);
        }
        clicks = 0;
    }
}

function handleDoubleClick(event){
    clicks = 0;
    clearTimeout(clickTimer);
    if (!LIKING){
        likeThis(event.target);
    }
    event.preventDefault();
}

function likeThis(post){
    LIKING = true;
    $(post).siblings('.heart').removeClass('hidden').fadeIn(300);
    var instagramUrl = "https://api.instagram.com/v1/media/" + post.parentElement.dataset.id +"/likes?access_token=" + init.authCode;
    $.post(instagramUrl, {
        url: instagramUrl,
        data: {
            access_token: init.authCode
        },
        success: function(data){
            var likeTimer = window.setTimeout(function(){
                $(post).siblings('.heart').fadeOut(300).siblings('.liked').removeClass('hidden');
                window.clearTimeout(likeTimer);
                LIKING = false;
            }, 500);
        },
        error: function(error){
            var likeTimer = window.setTimeout(function(){
                $(post).siblings('.heart').fadeOut(300);
                window.clearTimeout(likeTimer);
                LIKING = false;
            }, 500);
        },
        dataType: 'json'
    });
}

if (init.getPage() === 'tab') {
    $("#authLink").attr("href", config.AUTH_URL);
    getSettings('layoutSettings').then(function(layout){
        $(".feed").addClass(layout);
    }, function(error){
        if (amplitude) {
          amplitude.logEvent(error);
        }
        $(".feed").addClass('grid');
    });

    init.getAuth().then(function(auth){
        if (auth !== undefined && auth !== "") {
            getInstagramFeed();
            $('.auth-button').addClass('hidden');
            setUser();
        } else {
            $('.auth-button').removeClass('hidden');
        }
    });
}
