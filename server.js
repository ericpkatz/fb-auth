const express = require('express');
const path = require('path');
const app = express();
app.engine('html', require('ejs').renderFile);

try{
  Object.assign(process.env, require('./env.js'));
}
catch(ex){
}

const { FACEBOOK_APP_ID } = process.env;
if(!FACEBOOK_APP_ID){
  console.log('set FACEBOOK_APP_ID');
}

app.get('/', (req, res)=> res.render(path.join(__dirname, 'index.html'), { FACEBOOK_APP_ID }));

app.get('/facebook/login', (req, res, next)=> {
  const url = `https://www.facebook.com/v3.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=https://google.com/&state={"{st=state123abc,ds=123456789}"}`;
  res.redirect(url);
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening on port ${port}`));
