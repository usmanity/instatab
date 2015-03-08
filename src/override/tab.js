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
    if (feed.data[i].type === "image"){
      var post = feed.data[i];
      console.log(post);
      var imageUrl = post.images.standard_resolution.url;
      var username = post.user;
      var $el = $("<div class='photo'></div>");
      var $photo = $("<img src='" + imageUrl + "'>")
      var $username = $("<a class='username'>" + username.username + "</a>");
      $username.css({
        "background-image": "url(" + username.profile_picture + ")"
      }).attr("href", "https://instagram.com/" + username.username)
      $el.append($photo);
      if (i < 4){
        $(".first-row").append($el);
      } else {
        $(".second-row").append($el);
      }
    }
  }
};

if (getPage() === 'tab'){
  getAuthInterval = window.setInterval(function(){
    getAuth();
    if (authCode !== undefined){
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
