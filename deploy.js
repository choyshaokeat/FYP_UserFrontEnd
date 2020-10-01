const express = require('express');
const path = require('path');

const https = require("https"),
  fs = require("fs");

const options = {
  key: fs.readFileSync("/home/deploy/cert/server.key"),
  cert: fs.readFileSync("/home/deploy/cert/foododo_co.crt"),
  requestCert: true,
  ca: fs.readFileSync('/home/deploy/cert/foododo_co.ca-bundle'),
  rejectUnauthorized: false 
}

const app = express();

app.use(express.static(__dirname + '/dist/Foododo'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/Foododo/index.html'));
});

var port = process.env.PORT || 3000;
https.createServer(options, app).listen(443);
console.log(`App is listening to port ${port}`)
