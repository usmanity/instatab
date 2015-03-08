if (getPage() === "options"){
  $("#authLink").attr('href', AUTH_URL);
  var intervalCounter = 0;

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
    console.log(authCode);
  }, 500);

  $("#disconnect").click(function(){
    setAuth('');
    $("#disconnected").removeClass("hidden");
    $("#loggedOut").removeClass("hidden");
    $("#loggedIn").addClass("hidden");
  });
}
