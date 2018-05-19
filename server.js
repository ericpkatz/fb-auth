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
if(!FACEBOOK_APP_ID){
  console.log('set FACEBOOK_APP_ID');
}

app.get('/', (req, res)=> res.render(path.join(__dirname, 'index.html'), { FACEBOOK_APP_ID }));

app.get('/facebook/login', (req, res, next)=> {
  const url = `https://www.facebook.com/v3.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=https://ek-fb-testing.herokuapp.com/facebook/login/callback&state={"{st=state123abc,ds=123456789}"}`;
  res.redirect(url);
});

app.get('/facebook/login/callback', (req, res, next)=> {
  //https://ek-fb-testing.herokuapp.com/facebook/login/callback?code=AQBMJFF1qHetzErP85Y4tbM4vrqx8WH3dnbk3oHsSPEgFxsRDHtRiO4HLkow9Se5ISOR9O-usoXdz2rXRpda21xGfGmD0geIA6pa-Yc7IYS-gYB3fz0olgknKcxfjU-8PMcCmaoJ6cAJvOjpH1sAeK156ICWhvTnrP5tyWa1ybkmtWG6u--5SAqULNYTkULwf5ecdE41WGQE9pMuEZdHfv7X6XaPCu4dYQ4YWCP2LNZSBVHs3kmQ9P-0SkC92nF9G_lMveCQnp9WZplHFJCslQDDgnLS7pzhC1VVXr6dtkfhD2uP3cZg2wGur5c7AT0IbvM&state=%7B%22%7Bst%3Dstate123abc%2Cds%3D123456789%7D%22%7D#_=_;
  const code = req.query.code;
  const url = `https://graph.facebook.com/v3.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&redirect_uri={redirect-uri}&client_secret=${FACEBOOK_SECRET_ID}&code=${code}`
  request(url, (err, resp, body)=> {
    res.send(err || body);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening on port ${port}`));
