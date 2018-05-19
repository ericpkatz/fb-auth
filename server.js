const express = require('express');
const path = require('path');
const app = express();

const request = require('request');

app.engine('html', require('ejs').renderFile);

try{
  Object.assign(process.env, require('./env.js'));
}
catch(ex){
}

const { FACEBOOK_APP_ID, FACEBOOK_SECRET_ID } = process.env;
if(!FACEBOOK_APP_ID || !FACEBOOK_SECRET_ID){
  console.log('set FACEBOOK_APP_ID and FACEBOOK_SECRET_ID');
}

app.get('/', (req, res)=> {
  res.render(path.join(__dirname, 'index.html'), { FACEBOOK_APP_ID })
});

const redirectUrl = (req)=> {
  return req.protocol + '://' + req.get('host');
};

app.get('/facebook/login', (req, res, next)=> {
  const url = `https://www.facebook.com/v3.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirectUrl(req)}/facebook/login/callback&state={"{st=state123abc,ds=123456789}"}`;
  res.redirect(url);
});

app.get('/facebook/login/callback', (req, res, next)=> {
  const code = req.query.code;
  const url = `https://graph.facebook.com/v3.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirectUrl(req)}/facebook/login/callback&client_secret=${FACEBOOK_SECRET_ID}&code=${code}`
  request(url, (err, resp, body)=> {
    res.send(err || body);
  });
});

let port = process.env.PORT || 3000;
try {
  const fs = require('fs');

  var options = {
      key: fs.readFileSync( './encryption/localhost.key' ),
      cert: fs.readFileSync( './encryption/localhost.cert' ),
      requestCert: false,
      rejectUnauthorized: false
  };

    port = 443;
    const https = require('https');
    var server = https.createServer( options, app );
}
catch(ex){
  var server = require('http').createServer( app );

}

server.listen( port, function () {
    console.log( 'Express server listening on port ' + server.address().port );
} );
