var getInstagramFeed = function(){
  var instagramUrl = "https://api.instagram.com/v1/users/self/feed";
  $.ajax({
    url: instagramUrl,
    data: {
      access_token: authCode,
      count: COUNT
    },
    success: function(response){
      displayFeed(response);
    },
    error: function(){
        $(".disconnected").removeClass('hidden');
    },
    dataType: 'jsonp'
  });
};

var displayFeed = function(feed){
  // var landom = Math.floor(Math.random() * 8 + 1);
  for (var i = 0; i < 8; i++){
      var post = feed.data[i];
      var timeSince = processTime(post.created_time);
      var imageUrl = post.images.standard_resolution.url;
      var username = post.user;
      var $el = $("<div class='container'></div>");
      var type = feed.data[i].type;
      if (type === "image"){
        var $container = $("<span class='photo' data-href='"+ post.link +"' data-id='" + post.id + "'><img src='" + imageUrl + "'></span>");
      } else {
        var videoUrl = post.videos.standard_resolution.url;
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
      }
      var $liked = $("<span class='liked hidden'></span>")
      $username.prepend($avatar).append($time);
      $container.append($heart).append($caption).append($liked);
      if (post.user_has_liked){
        $liked.removeClass('hidden');
      }
      var $pin = $("<div class='pin'></div>");
      $el.append($username).append($container);
      if (type === "video"){
        var $play = $("<div class='play'></div>");
        $el.append($play);
      }
      // if (landom === i){
        // $el.append($pin);
      // }
      //$el.on('click', event, handleSingleClick).on('dblClick', event, handleDoubleClick);
      if (i < 4){
        $(".first-row").append($el);
      } else {
        $(".second-row").append($el);
      }
  }
  getSettings().then(function(settings){
    var loopSetting = settings.loop === 'true';
    $("video").attr('loop', loopSetting);
  });
  $(".container").on("click", event, handleSingleClick).on("dblclick", event, handleDoubleClick);
  {{timer_end}}
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

function getSettings(){
  return new Promise(function (fulfill, reject){
    chrome.storage.local.get('options', function(cb){
      var options = cb.options;
      if (!options) {
        reject();
      }
      fulfill(options);
    });
  })
}

function handleSingleClick(event){
    clicks++;
    if (clicks === 1){
        if (event.target.tagName === "IMG"){
            clickTimer = setTimeout(function(){
                window.location = $(event.target).parent().data('href');
                clicks = 0;
            }, delay);
        } else {
            clickTimer = setTimeout(function(){
                play(event);
                clicks = 0;
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

    var instagramUrl = "https://api.instagram.com/v1/media/" + post.parentElement.dataset.id +"/likes?access_token=" + authCode;
    $.post(instagramUrl, {
        url: instagramUrl,
        data: {
            access_token: authCode
        },
        success: function(data){
            var likeTimer = window.setTimeout(function(){
                $(post).siblings('.heart').fadeOut(300).siblings('.liked').removeClass('hidden');
                window.clearTimeout(likeTimer);
                LIKING = false;
                amplitude.logEvent("liked photo", eventProperties);
            }, 700);
        },
        error: function(error){
            var likeTimer = window.setTimeout(function(){
                $(post).siblings('.heart').fadeOut(300);
                window.clearTimeout(likeTimer);
                LIKING = false;
            }, 700);

        },
        dataType: 'json'
    });
}

if (getPage() === 'tab'){
  $("#authLink").attr("href", AUTH_URL);
  getAuth().then(function(){
    if (authCode !== undefined && authCode !== ""){
      getInstagramFeed();
      $('.auth-button').addClass('hidden');
    } else {
      $('.auth-button').removeClass('hidden')
    }
  });
}
