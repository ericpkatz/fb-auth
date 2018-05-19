const express = require('express');
const path = require('path');
const app = express();
app.engine('html', require('ejs').renderFile);

try{
  Object.assign(process.env, require('./env.js'));
}
catch(ex){
}

app.get('/', (req, res)=> res.render(path.join(__dirname, 'index.html')));

app.listen(3000);
