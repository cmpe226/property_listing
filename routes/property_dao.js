/**
 * http://usejsdoc.org/
 */

var connection_mysql = require('./mysql')
function getAllProperties(success, failure) {
	var connection = connection_mysql.getConnection;
	var queryString = 'SELECT * FROM PropertyListing.Property;';
	connection.query(queryString, function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
	connection.end();
}

function getPropertyById(id, success, failure) {
	connection.connect();
	var queryString = 'SELECT * FROM PropertyListing.Property where PropertyID = ?;';
	connection.query(queryString, [ id ], function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
	connection.end();
}

function deleteProperty(id, success, failure) {
	connection.connect();
	var queryString = 'DELETE FROM `PropertyListing`.`Property` WHERE PropertyID = ?;';
	connection.query(queryString, [ id ], function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
	connection.end();
}

function createProperty() {
	"INSERT INTO `PropertyListing`.`Property` (`PropertyID`, `Street`, `City`, `State`,`Zip`, `Description`, `OwnerId`, `AgentId`) VALUES (<{PropertyID: }>, <{Street: }>, <{City: }>, <{State: }>, <{Zip: }>, <{Description: }>, <{OwnerId: }>, <{AgentId: }>);";
}

exports.getAllProperties = getAllProperties;
exports.getPropertyById = getPropertyById;
exports.deleteProperty = deleteProperty;
exports.createProperty = createProperty;