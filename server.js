const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/Foododo'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/Foododo/index.html'));
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log(`App is listening to port ${port}`)
