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

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening on port ${port}`));
