/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), usermysql = require('./routes/user-dao'), http = require('http'), path = require('path'), mysql = require('mysql'),
	bodyParser = require('body-parser')
	,cookieParser = require('cookie-parser');

var cors = require('cors');
var session = require('express-session');

var app = express();
var pages = require('./routes/pages');
var controller = require('./routes/controller');
var connection = require('./routes/mysql')

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
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(session({
	cookieName: 'session',
	secret: 'random_string_goes_here',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

var conn = connection.getConnection;

conn.connect(function(err){
	  if(err){
	    console.log('Error connecting to Db: ' + err);
	    return;
	  }
	  console.log('Connection established');
	});

// GETS
app.get('/user/:userid', user.getUserById);
// app.get('/users', user.getAllUsers);

// POSTS
app.post('/user', user.createUser);
app.post('/doAddProperty', controller.doAddProperty);
app.post('/submitEditProfile',user.submitEditProfile);

// DELETES
// app.delete('/user/:userid', user.deleteRegisteredUser);
app.post('/login', user.login);

app.get('/', pages.signup);
app.get('/propertydetails', authenticate, pages.propertydetails);
app.get('/listing', authenticate,pages.listing);
app.get('/addproperty',authenticate, pages.addproperty);
app.get('/properties', authenticate,pages.getProperties);
app.get('/editprofile',authenticate,user.editProfile);

//Do not authenitcate the login page
app.get('/', pages.signup);
app.get('/propertydetails', authenticate, pages.propertydetails);
app.get('/listing', authenticate,pages.listing);
app.get('/addproperty',authenticate, pages.addproperty);
app.get('/properties', authenticate,pages.getProperties);
app.get('/editprofile',authenticate,user.editProfile);

app.get('/listings/:id', pages.getPropertyListingById, pages.getPropertyFeatures,
		pages.renderPropertyDetails);

//CHANGE THIS TO TRUE WHEN WE DEMO! - This does the authentication
var DEVMODE = false;
function authenticate(req,res,next) {
	if (req.session.user || DEVMODE) {
		next();
	} else {
		res.redirect('/');
	}
};

http.createServer(app).listen(app.get('port'), app.get('ip'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});