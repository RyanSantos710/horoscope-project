var Twit = require('twit')
var request = require("request");

var T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

var stream = T.stream('statuses/filter', { track: [process.env.HASHTAG] })

stream.on('tweet', function (tweet) {
  var zodiacId = tweet.entities.hashtags[0].text;
  var zodiacSign = zodiacId.slice(12);
  console.log(zodiacSign);

  request.post({
    url: "https://sender.blockspring.com/api_v2/blocks/dba3c2ca01c063df9cdf9fc6f0cf93f9?api_key=" + process.env.HOROSCOPE_API,
    form: { sign: zodiacSign }
  },
  function(err, response, body) {
    console.log(body);
    if (body.length > 140){
      var messageOne = body.slice(0,120);
      var messageTwo = body.slice(120,240);
      var messageThankYou = body.slice(240,360) + "Thank you for using #FetchMyScope! Send feedback at @FetchMyScope";
      var delayLastMessage = 2000;
      var delayFirstMessage = 4000;

      T.post('statuses/update', { status: '@' + tweet.user.screen_name + " " + messageThankYou }, function(err, data, response) {
      })

      setTimeout(function(){
        T.post('statuses/update', { status: '@' + tweet.user.screen_name + " " + messageTwo }, function(err, data, response) {
        })
      },delayLastMessage);

      setTimeout(function(){
        T.post('statuses/update', { status: '@' + tweet.user.screen_name + " " + messageOne }, function(err, data, response) {
        })
      },delayFirstMessage);
    } else {
      T.post('statuses/update', { status: '@' + tweet.user.screen_name + " " + body }, function(err, data, response) {
      })
    }
  });
})
