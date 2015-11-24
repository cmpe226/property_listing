var express = require('express');

var index = express();

index.all('/', function (req, res) {
  //if ('user' in req.session) {
    res.render('index.html');
  //} else {
  //  res.render('login.html');
  //}
});

exports.index = index;