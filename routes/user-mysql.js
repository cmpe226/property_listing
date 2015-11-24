var ejs= require('ejs');
var mysql = require('mysql');
var Chance = require('chance');
var crypto = require('crypto');
var CONNECTION_POOL = false;


//var pool = mysql.createPool({
//	connectionLimit: 3,
//	host     : 'us-cdbr-iron-east-02.cleardb.net',
//    user     : 'b6138a04494eed',
//    password : 'c592d894',
//    database : 'ad_fcc7aab1bbdc042'
//	host : 'localhost',
//	user : 'root',
//	password : 'warri0rs',
//	database : 'wms'
//});

function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
    	user     : 'root',
    	password : 'warri0rs',
    	database : 'rels'
//		host : 'localhost',
//		user : 'root',
//		password : 'warri0rs',
//		database : 'wms'
	});
	return connection;
}

function getPooledConnection(callback) {
	pool.getConnection(function(err, connection) {
		callback(err,connection);
	});
}

//function insertNewUserRecord(callback,user) {
//	var chance = new Chance();
//	var user_id = chance.ssn();
//	createCrypto(user.password, function(err,pass) {
//		var query = "INSERT INTO user (user_id,first_name,last_name,address,city,state,zip_code,phone_number,password,salt,email) values " +
//		"( "+ "'" + user_id + "'," +  "'" + user.first_name + "'" + "," + "'" + user.last_name + "'" + "," +
//			"'" + user.address + "'" + "," + "'" + user.city + "'" + "," + "'" + user.state + "'" + "," + "'" + user.zip_code + "'" + "," +
//			"'" + user.phone_number + "'" + "," + pass.key  + "," +  pass.salt + "," + "'" + user.email + "'" +
//		" )";
//		var query = "INSERT INTO user SET ?";
//		console.log(query);
//
//		var connection = getConnection();
//		connection.query(query, function(err,result) {
//			if(err) {
//				throw err;
//			} else {
//				result.user_id = user_id;
//				callback(err,result);
//			}
//		});
//		connection.end();
//
//	});
//}

function insertNewRegisteredUser(callback,user) {
	var query = "INSERT INTO registereduser SET ?";
	console.log(query);

	var connection = getConnection();
	connection.query(query, user, function(err,result) {
		if(err) {
			throw err;
		} else {
			result.user = user;
			callback(err,result);
		}
	});
	connection.end();
}

function getUserProfileData(email,callback) {
}

function getUserById(id,callback) {
	var query = 'select user.userid, user.username ' +
				'from registereduser users' +
				'where userid  = ' + id;
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

function getAllUsers(callback) {
	var query = 'select user.user_id, user.first_name, user.last_name, user.address, ' + 
    				'user.city, user.state, user.zip_code, user.phone_number, user.email ' + 
				'from user ';
	console.log(query);
	if(CONNECTION_POOL) {

	} else {
		var connection = getConnection();
		connection.query(query,function(err,results) {
			if(err) {
				throw err;
			} else {
				callback(err,results);
			}
		});
	}
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


exports.getPooledConnection=getPooledConnection;
exports.insertNewRegisteredUser=insertNewRegisteredUser;
exports.getUserById=getUserById;
exports.getAllUsers=getAllUsers;
