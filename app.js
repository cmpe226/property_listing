/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , usermysql = require('./routes/user-mysql')
    , http = require('http')
    , path = require('path')
    , mysql = require('mysql');

var cors = require('cors');
var session = require('express-session');
var auth = require('./routes/auth');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || '127.0.0.1');
// app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
// app.set('ip', process.env.OPENSHIFT_NODEJS_IP);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(cors());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'CMPE226',
    resave: false,
    saveUninitialized: true//,
    //cookie: { maxAge: 15 * 60 * 1000 }
}));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//GETS
app.get('/user', user.getUserById);
//app.get('/users', user.getAllUsers);

//POSTS
app.post('/user', user.createUser);

//DELETES
//app.delete('/user/:userid', user.deleteRegisteredUser);


app.use('/', routes.index);
app.use('/login', auth.login);
app.use('/register', auth.register);


http.createServer(app).listen(app.get('port'), app.get('ip'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});