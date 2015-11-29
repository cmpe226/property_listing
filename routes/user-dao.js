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
	var query = "select * from allusers where id = ?";
	var connection = mysql.getConnection;

	connection.query(query,[id],function(err,results) {
		if(err) {
			throw err;
		} else {
			callback(err,results);
		}
	});
}

function getUserLoginData(callback,loginData) {
	var query = 'select ID,Username,Password ' +
	'from ( ' +
		' select AgentId as ID,Username,Password '  +
	' from PropertyListing.RealEstateAgent ' +
	' union ' +
	' select UserID as ID, Username, Password ' +
	' from PropertyListing.RegisteredUser ' +
	' union ' +
	' select OwnerId as ID,Username, Password' +
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

function editUserData(callback,updatedUserInfo) {
	var table = '';
	var field = '';
	if(updatedUserInfo.type === 2) {
		table = 'RealEstateAgent';
		field = 'AgentId';
	} else if( updatedUserInfo.type === 3) {
		table = 'PropertyOwner';
		field = 'OwnerId';
	} else {
		table = 'RegisteredUser';
		field = 'UserID';
	}
	var connection = mysql.getConnection;
	var updateProfileQuery = 'UPDATE Profile SET FirstName =  ? , LastName = ? WHERE ProfileID = ?';
	connection.query(updateProfileQuery,[updatedUserInfo.FirstName,updatedUserInfo.LastName,updatedUserInfo.profileid],function(err,results) {
		if(updatedUserInfo.Password) {
			var query = 'UPDATE ' + table + ' SET Password = ? where ' + field + ' = ?;';
			connection.query(query,[updatedUserInfo.Password],function(err,result) {
				if(err) {
					throw err;
				} else {
					callback(err,result);
				}
			});
		} else {
			callback(err,results);
		}
	});
}

function setUserPhoto(callback,photoLocation,profileid) {
	var query = "UPDATE Profile SET Photo = ? where ProfileID = ?"
	var connection = mysql.getConnection;
	connection.query(query,[photoLocation,profileid],function(err,result){
		callback(err,result);
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
exports.editUserData=editUserData;
exports.getUserById=getUserById;
exports.getAllUsers=getAllUsers;
exports.getUserLoginData=getUserLoginData;
exports.setUserPhoto=setUserPhoto;
