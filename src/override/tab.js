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
  for (var i = 0; i < 8; i++){

    console.log(feed.data[i].type);

      var post = feed.data[i];
      var imageUrl = post.images.standard_resolution.url;
      var username = post.user;
      var $el = $("<div class='container'></div>");
      if (feed.data[i].type === "image"){
        var $container = $("<a class='photo' href='"+ post.link +"'><img src='" + imageUrl + "'></a>");
      } else {
        var $container = $("<a class='video' href='"+ post.link +"'><img src='" + imageUrl + "'></a>");
        $container.append("<span class='play'></span>")
      }
      var $username = $("<a class='username'>" + username.username + "</a>");
      $username.css({
        "background-image": "url(" + username.profile_picture + ")"
      }).attr("href", "https://instagram.com/" + username.username)
      // if (post.user_has_liked){
      //   $heart.addClass('liked');
      // }
      $el.append($username).append($container);
      if (i < 4){
        $(".first-row").append($el);
      } else {
        $(".second-row").append($el);
      }
  }
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
