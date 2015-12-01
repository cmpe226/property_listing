var ejs = require('ejs');
var mysql = require('./user-dao');
var bkmrk = require('./bookmarks-dao');
var property = require('./property_dao');
var ERROR_MESSAGE = {
    "message" : "Error occurred",
    "success" : false,
    "status" : 401
};
var fs = require('fs');

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
							mysql.getUserById(results[0].ID,results[0].Username,results[0].Password,function(err,results2) {
								if(err) {
									throw err;
								} else {
									req.user = results[0];
									req.user.type = results2[0].type;
									req.user.profileid = results2[0].ProfileID;
									req.session.user = results[0];
									req.session.user.type = results2[0].type;
									req.session.user.profileid = results2[0].ProfileID;
									res.locals.user = results[0];
									res.location('/');
									res.redirect("/home");
								}
							});
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

function adminLogin(req,res) {
	if(verifyLoginParameters(req)) {
		var adminLoginData = {Username: req.body.username, Password: req.body.password};
		mysql.getUserLoginData(function(err,results) {
			if(results && results[0].ID === -1) {
				mysql.getUserById(results[0].ID,results[0].Username,results[0].Password, function(err,results2) {
					if(!err) {
						req.user = results[0];
						req.user.type = results2[0].type;
						req.user.profileid = results2[0].ProfileID;
						req.session.user = results[0];
						req.session.user.type = results2[0].type;
						req.session.user.profileid = results2[0].ProfileID;
						res.locals.user = results[0];
						res.location('/');
						res.redirect("/home");

					}
				})
			}
		},adminLoginData);
	} else {
		res.send(ERROR_MESSAGE);
	}
}

function logOut(req,res) {
	req.session.destroy(function(err) {
		res.redirect("/");
	});
}

function showEditProfile(req,res) {
	var ID = req.session.user.ID;
	var username = req.session.user.Username;
	var password = req.session.user.Password;
	mysql.getUserById(ID,username,password,function(err,results) {
		if(results.length > 0) {
			res.locals.user = req.session.user;
			res.render("editprofile",{user:results[0]});
		}
		else {
			res.send(ERROR_MESSAGE);
		}
	});


}

function submitEditProfile(req,res) {
	var updatedInfo = {};
	updatedInfo.FirstName = req.body.firstname;
	updatedInfo.firstname = req.body.firstname;
	updatedInfo.LastName = req.body.lastname;
	updatedInfo.lastname = req.body.lastname;
	updatedInfo.type = req.session.user.type;
	updatedInfo.profileid = req.session.user.profileid;

	if(req.body.password !== '*****') {
		updatedInfo.Password = req.body.password;
	}
	mysql.editUserData(function(err,result) {
		if(err) {
			throw err;
		} else {
			if(req.files && req.files.image && req.files.image.name) {
				fs.readFile(req.files.image.path, function(err,data) {
					var fileName = req.files.image.name;
					var path = __dirname +  "/../public/images/uploads/" + fileName;
					fs.writeFile(path,data,function(err) {
						console.log("image uploaded.")
						mysql.setUserPhoto(function(err,result){
							if(err) {
								throw err;
							} else {
								updatedInfo.photo = '/images/uploads/' + fileName;
								res.render("editprofile",{user:updatedInfo, success:true});
							}
						},'/images/uploads/' + fileName,req.session.user.profileid);
					});
				});
			} else {
				res.render("editprofile",{user:updatedInfo, success:true});
			}
		}
	},updatedInfo);
}

//Delete Profile and it'll cascade
function deleteUser(req,res) {
	var id = req.body.id;
	var username = req.body.username;
	var password = req.body.password;
	mysql.getUserById(id,username,password,function(err,result) {
		mysql.deleteUser(id,result[0].type,function(err,result){
			if(!err) {
				req.session.destroy(function(err) {
					res.render("signup",{deletedAccount:true})
				});
			}
		});
	});
}

function addBookmark(req, res){
	var listingId = req.body.listingId;
	var userId =  req.session.user.ID;
	console.log("Bookmark Listing Id: " + listingId + " " + userId);
	
	bkmrk.createBookmark(function(err, result){
		if(!err){
			console.log(result);
		}
		else
			throw(err);
	}, listingId, userId);
	
	res.redirect('/home');
}

function deleteProperty(req, res){
	var propertyId = req.body.propertyId;
	var agentId = req.body.agentId;
	var userId =  req.session.user.ID;
	console.log("Delete Property Id: " + propertyId + " " + userId + " " + agentId);
	
	if(agentId == userId){
	property.deleteProperty(propertyId, function(rows){
		if(!err){
			console.log(rows);
		}
		else
			throw(err);
	}, function(err){
		console.log(err);
		throw(err);
	});
	}
	else{
		//dont allow to delete
		console.log('Only the Agent that created the property can delete it.')
	}
	
	res.redirect('/home');
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
exports.adminLogin=adminLogin;
exports.editProfile=showEditProfile;
exports.submitEditProfile=submitEditProfile;
exports.deleteUser=deleteUser;
exports.logOut=logOut;
exports.addBookmark=addBookmark;
exports.deleteProperty=deleteProperty;
