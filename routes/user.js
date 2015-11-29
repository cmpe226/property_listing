var ejs = require('ejs');
var mysql = require('./user-dao');
var ERROR_MESSAGE = {
    "message" : "Error occurred",
    "success" : false,
    "status" : 401
};

function createUser(req,res) {
	if(verifyCreateParameters(req) == true) {
		var newUser = {
			UserName: req.body.username,
			Password: req.body.password,
			FirstName: req.body.firstname,
			LastName: req.body.lastname
		};

		var realEstateUser = false;
		if(typeof req.body.license !== 'undefined' && req.body.license.length > 1 ) {
			newUser.LicenseNumber = req.body.license;
			realEstateUser = true;
		}

		var propertyOwner = false;
		if(typeof req.body.propertyowner !== 'undefined') {
			propertyOwner = true;
		}

		if(realEstateUser) {
			mysql.insertNewRealEstateAgentSP(function(err,results) {
				if(err) {
					throw err;
				} else {
					res.render('signup',{accountCreated:true});
				}
			},newUser);
		} else if(propertyOwner) {
			mysql.insertNewPropertyOwnerSP(function(err,results) {
				if(err) {
					throw err;
				} else {
					res.render('signup',{accountCreated:true})
				}
			},newUser);
		} else {
			mysql.insertNewRegisteredUserSP(function(err,results) {
				if(err) {
					throw err;
				} else {
					res.render('signup',{accountCreated:true});
				}
			},newUser);
		}
	} else {
		res.render('index', ERROR_MESSAGE);
	}
}

function getUserById(req,res) {
	if(req.params.userid !== 'undefined') {
		mysql.getUserById(req.params.userid, function(err,results) {
			if(err) {
				throw err;
			} else {
				var user = results[0];
				res.send({
					userid: user.userid,
					username: user.username
				});
			}
		});
	} else {
		res.send(ERROR_MESSAGE);
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

function login(req,res) {
	if(verifyLoginParameters(req)) {
		var loginData = {UserName: req.body.username, Password: req.body.password};
		mysql.getUserLoginData(function(err,results) {
			if(err) {
				throw err;
			} else {
				if(results.length >= 1) {
					req.session.regenerate(function (err) {
						if (!err) {
							req.user = results[0];
							req.session.user = results[0];
							delete req.user.Password;
							res.locals.user = results[0];
							res.location('/');
							res.json(200, req.session.user);
						}
					});
				} else {
					res.render('signup',{showInvalidCredentials:true});
				}
			}
		},loginData);
	} else {
		res.send(ERROR_MESSAGE);
	}
}



function verifyCreateParameters(req) {
	if (typeof req.body.username !== 'undefined' && req.body.username.length > 2 &&
		typeof req.body.firstname !== 'undefined' && req.body.firstname.length > 2 &&
		typeof req.body.lastname !== 'undefined' && req.body.lastname.length > 2) {
		return true;
	} else {
		return false;
	}
}

function verifyLoginParameters(req) {
	if(typeof req.body.username !== 'undefined' && req.body.password !== 'undefined') {
		return true;
	} else {
		return false;
	}
}

exports.createUser=createUser;
exports.getUserById=getUserById;
exports.getAllUsers=getAllUsers;
exports.login=login;