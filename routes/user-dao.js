var ejs= require('ejs');
var mysql = require('./mysql');
var Chance = require('chance');
var crypto = require('crypto');
var REGISTERED_USER_TABLE = 'RegisteredUser';
var REALESTATE_AGENT_TABLE = 'RealEstateAgent';
var PROFILE_TABLE = 'Profile';

function insertNewRegisteredUser(callback,registereduser) {
	var query = "INSERT INTO " + REGISTERED_USER_TABLE + " SET ?";
	var connection = mysql.getConnection;
	connection.query(query, registereduser, function(err,result) {
		if(err) {
			throw err;
		} else {
			callback(err,result);
		}
	});
	connection.end();
}

function insertNewProfile(callback,profiledata) {
	var query = "INSERT INTO " + PROFILE_TABLE + " SET ?" ;
	var connection = mysql.getConnection;
	connection.query(query,profiledata,function(err,result) {
		if(err) {
			throw err;
		} else {
			callback(err,result);
		}
	});
}

function insertNewRealEstateAgent(callback,realestateagent) {
	var query = "INSERT INTO " + REALESTATE_AGENT_TABLE + " SET ?";
	var connection = mysql.getConnection;
	connection.query(query,realestateagent,function(err,result) {
		if(err) {
			throw err;
		} else {
			callback(err,result);
		}
	});
}

function getUserProfileData(email,callback) {
}

function insertNewRegisteredUserSP(callback,fullUserData) {
	var query = "CALL usercreations(?,?,?,?)"
	var connection = mysql.getConnection;
	connection.query(query,[fullUserData.FirstName,fullUserData.LastName,fullUserData.UserName, fullUserData.Password],function(err,result) {
		if(err) {
			throw err;
		} else {
			callback(err,result);
		}
	});
}

function insertNewRealEstateAgentSP(callback,fullUserData) {
	var query = "CALL agentcreations(?,?,?,?,?)"
	var connection = mysql.getConnection;
	connection.query(query,[fullUserData.FirstName,fullUserData.LastName,fullUserData.LicenseNumber,fullUserData.UserName, fullUserData.Password],function(err,result) {
		if(err) {
			throw err;
		} else {
			callback(err,result);
		}
	});
}

function insertNewPropertyOwnerSP(callback,fullUserData) {
	var query = "CALL propertyownercreation(?,?,?,?)"
	var connection = mysql.getConnection;
	connection.query(query,[fullUserData.FirstName,fullUserData.LastName,fullUserData.UserName, fullUserData.Password],function(err,result) {
		if(err) {
			throw err;
		} else {
			callback(err,result);
		}
	});
}

function getUserById(id,callback) {
	var query = 'select user.userid, user.username ' +
				'from ' + CLIENT_TABLE + ' user ' +
				'where user.userid  = ' + id;
	console.log(query);
	var connection = getConnection();
	connection.query(query,function(err,results) {
		if(err) {
			throw err;
		} else {
			callback(err,results);
		}
	});
}

function getUserLoginData(callback,loginData) {
	var query = 'select Username,Password ' +
	'from ( ' +
		' select Username,Password '  +
	' from PropertyListing.RealEstateAgent ' +
	' union ' +
	' select Username, Password ' +
	' from PropertyListing.RegisteredUser ' +
	' union ' +
	' select Username, Password' +
	' from PropertyListing.PropertyOwner ' +
    ') t ' +
	' where t.Username = ? and t.Password = ?';
	var connection = mysql.getConnection;
	connection.query(query,[loginData.UserName,loginData.Password],function(err,results) {
		if(err) {
			throw err;
		} else {
			callback(err,results);
		}
	});
}

function getAllUsers(callback) {
	var query = '';
	console.log(query);
	var connection = mysql.getConnection();
	connection.query(query,function(err,results) {
		if(err) {
			throw err;
		} else {
			callback(err,results);
		}
	});

}

function createCrypto(pwd,callback) {
	crypto.randomBytes(16, function(ex, salt) {
		if(ex) {
			throw ex;
		} else {
			crypto.pbkdf2(pwd, salt, 10000, 32, function(err, key) {
				if(err) {
					throw err;
				} else {
//					console.log("key:" + mysql.escape(key) + "->" + mysql.escape(Buffer(salt, 'binary')));
					var pass = {
							key: mysql.escape(key),
							salt: mysql.escape(Buffer(salt,'binary'))
					};
					callback(err,pass);
				}
			});
			
		}
	});
}


exports.insertNewRegisteredUser=insertNewRegisteredUser;
exports.insertNewRealEstateAgent=insertNewRealEstateAgent;
exports.insertNewProfile=insertNewProfile;
exports.insertNewRegisteredUserSP=insertNewRegisteredUserSP;
exports.insertNewRealEstateAgentSP=insertNewRealEstateAgentSP;
exports.insertNewPropertyOwnerSP=insertNewPropertyOwnerSP;
exports.getUserById=getUserById;
exports.getAllUsers=getAllUsers;
exports.getUserLoginData=getUserLoginData;
