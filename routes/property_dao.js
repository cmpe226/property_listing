/**
 * http://usejsdoc.org/
 */

var connection_mysql = require('./mysql')
function getAllProperties(success, failure) {
	var connection = connection_mysql.getConnection;
	var queryString = 'SELECT * FROM PropertyListing.Property;';
	console.log("Query", queryString);
	connection.query(queryString, function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
}

function getPropertyById(id, success, failure) {
	var connection = connection_mysql.getConnection;
	var queryString = 'SELECT * FROM PropertyListing.Property where PropertyID = ?;';
	console.log("Query", queryString);
	connection.query(queryString, [ id ], function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
}

exports.getPropertyByAgentId = function getPropertyByAgentId(agentId, success,
		failure) {
	var connection = connection_mysql.getConnection;
	var queryString = 'SELECT * FROM `PropertyListing`.`Property` where AgentId = ?;';
	console.log("Query", queryString);
	connection.query(queryString, [ agentId ], function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
}

function deleteProperty(id, success, failure) {
	var connection = connection_mysql.getConnection;
	var queryString = 'DELETE FROM `PropertyListing`.`Property` WHERE PropertyID = ?;';
	console.log("Query", queryString);
	connection.query(queryString, [ id ], function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
}

function addProperty(data, failure, success) {
	var connection = connection_mysql.getConnection;
	var queryString = 'INSERT INTO `PropertyListing`.`Property`(Name, Street, City, State, Zip, Description, OwnerId, AgentId) VALUES ('
			+ data + ');';
	console.log("Query", queryString);
	connection.query(queryString, function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
}

function createListing(propertyID, saleprice, success, failure) {
	var connection = connection_mysql.getConnection;
	var query = 'INSERT INTO `PropertyListing`.`Listing`	(`SalePrice`,	`SoldPrice`,	`PropertyID`,	`Viewcount`)	VALUES	(?,	0,	?,	0);';
	console.log("Query", query);
	connection.query(query, [ saleprice, propertyID ], function(err,
			rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
}

function getFeaturesForProperty(id, success, failure) {
	var connection = connection_mysql.getConnection;
	var queryString = "SELECT * FROM PropertyListing.Property_features where PropertyId=?;";
	console.log("Query", queryString);
	connection.query(queryString, [ id ], function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
}
exports.getAllProperties = getAllProperties;
exports.getPropertyById = getPropertyById;
exports.deleteProperty = deleteProperty;
exports.createListing = createListing;
exports.getFeaturesForProperty = getFeaturesForProperty;
exports.addProperty = addProperty;