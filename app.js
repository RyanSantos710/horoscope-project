var Twit = require('twit')
var request = require("request");

var T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

var stream = T.stream('statuses/filter', { track: process.env.HASHTAG })
var client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

stream.on('tweet', function (tweet) {
  console.log(tweet.user.screen_name)
  console.log(tweet.text)
  request.post({
    url: "https://sender.blockspring.com/api_v2/blocks/dba3c2ca01c063df9cdf9fc6f0cf93f9?api_key=" + process.env.HOROSCOPE_API,
    form: { sign: "cancer"}
  },
  function(err, response, body) {
    console.log(body);
    /* Save for now. Ask Samer about cutting due to character length
       T.post('statuses/update', { status: '@' + tweet.user.screen_name + " " + body }, function(err, data, response) {
       })
       */
    client.messages.create({
      to: process.env.P_NUMBER,
      from: process.env.T_NUMBER,
      body: body,
    }, function(err, message) {
      console.log(message.sid);
    });
  });
})
