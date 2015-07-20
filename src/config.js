var config = {};

config.CLIENT_ID = "{{client_id}}";

config.REDIRECT_URI = [
    "chrome-extension://",
    window.location.origin.split("//")[1],
    "/src/auth/finished.html"
].join('');

config.AUTH_URL = [
    "https://instagram.com/oauth/authorize/?client_id=",
    config.CLIENT_ID,
    "&redirect_uri=",
    config.REDIRECT_URI,
    "&response_type=token&scope=likes+relationships+comments"
].join('');

config.count = 15;

module.exports = config;