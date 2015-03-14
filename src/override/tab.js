var getInstagramFeed = function(){
  var instagramUrl = "https://api.instagram.com/v1/users/self/feed";
  $.ajax({
    url: instagramUrl,
    data: {
      access_token: authCode
    },
    success: function(response){
      displayFeed(response);
    },
    dataType: 'jsonp'
  });
};

var displayFeed = function(feed){
  var landom = Math.floor(Math.random() * 8 + 1);
  for (var i = 0; i < 8; i++){
      var post = feed.data[i];
      var timeSince = processTime(post.created_time);
      var imageUrl = post.images.standard_resolution.url;
      var username = post.user;
      var $el = $("<div class='container'></div>");
      if (feed.data[i].type === "image"){
        var $container = $("<a class='photo' href='"+ post.link +"'><img src='" + imageUrl + "'></a>");
      } else {
        var videoUrl = post.videos.standard_resolution.url;
        var $container = $("<video controls loop preload='true' src='" + videoUrl + "'></video>");
        feed.data[i];
      }
      var $username = $("<a class='username'>" + username.username + "</a>").attr("href", "https://instagram.com/" + username.username);
      var $avatar = $("<span class='avatar'></span>").css({
        "background-image": "url(" + username.profile_picture + ")"
      });
      var $time = $("<span class='time'>"+ timeSince +"</span>");
      $username.prepend($avatar).append($time);
      // if (post.user_has_liked){
      //   $heart.addClass('liked');
      // }
      var $pin = $("<div class='pin'></div>")
      $el.append($username).append($container);
      if (landom === i){
        $el.append($pin);
      }
      if (i < 4){
        $(".first-row").append($el);
      } else {
        $(".second-row").append($el);
      }
  }
  {{timer_end}}
};

if (getPage() === 'tab'){
  $("#authLink").attr("href", AUTH_URL)
  getAuthInterval = window.setInterval(function(){
    getAuth();
    if (authCode !== undefined && authCode !== ""){
      getInstagramFeed();
      $('.auth-button').addClass('hidden')
      window.clearInterval(getAuthInterval);
    } else {
      $('.auth-button').removeClass('hidden')
    }
    if (intervalCounter > 9){
      window.clearInterval(getAuthInterval);
    }
  }, 25);
}
