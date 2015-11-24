var ejs = require('ejs');
var mysql = require('./user-mysql');

var CLIENT_TABLE= 'user';
var ERROR_MESSAGE = {
    "message" : "Error occurred",
    "success" : false,
    "status" : 401
};

function createUser(req,res) {
	if(verifyCreateParameters(req) == true) {
		var newUser = {
			username: req.body.username,
			password: req.body.password
		};
		mysql.insertNewRegisteredUser(function(err, results) {
			if(err) {
				throw err;
			} else {
				res.render('index',{username:newUser.username});
			}
		},newUser);
	} else {
		res.render('index', ERROR_MESSAGE);
	}
}

function getUserById(req,res) {
	if(req.params.id !== 'undefined') {
		mysql.getUserById(req.params.id, function(err,results) {
			if(err) {
				throw err;
			} else {
				var user = results[0];
				res.send({
					id: user.userid,
					username: user.username
				});
			}
		});
	} else {
		res.render('index', ERROR_MESSAGE);
	}
}

function getAllUsers(req,res) {
	mysql.getAllUsers(function(err,result) {
		if(err) {
			throw err;
		} else {
			var users = []
			for(var i = 0; i < result.length; i++) {
				var user = result[i];
				var userObj = {
						id: user.user_id,
						first_name: user.first_name,
						last_name: user.last_name,
						address: user.address,
						city: user.city,
						state: user.state,
						zip_codeCode: user.zip_code,
						phone_number: user.phone_number,
						email: user.email
				};
				users.push(userObj);
			}
			res.send(users);
		}
	});
}



function verifyCreateParameters(req) {
	if (typeof req.body.username !== 'undefined' && req.body.username.length > 2) {
		return true;
	} else {
		return false;
	}
}

exports.createUser=createUser;
exports.getUserById=getUserById;
exports.getAllUsers=getAllUsers;