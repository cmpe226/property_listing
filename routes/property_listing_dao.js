var connection_mysql = require('./mysql')
function getAllListings(success, failure) {
	var connection = connection_mysql.getConnection;
	var queryString = 'SELECT ListingID, ListingDateTime, Viewcount, Street, City, State, Zip, Description  FROM PropertyListing.Listing, PropertyListing.Property where Listing.PropertyID = Property.PropertyID;';
	console.log("Query", queryString);
	connection.query(queryString, function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
}

function getListingById(id, success, failure) {
	var connection = connection_mysql.getConnection;

	// Increment view count
	var query = "UPDATE `PropertyListing`.`Listing` SET Viewcount = ViewCount + 1 WHERE `ListingID` = ?;"
	console.log("Query", query);
	connection.query(query, [ id ], function(err, rows, fields) {
		if (err) {
			console.log("error");
			failure(err);
		}
	});

	var queryString = "SELECT ListingID, ListingDateTime, SalePrice, SoldPrice,"
			+ " Property.PropertyID, Viewcount, SoldDate, Street, City, State, Zip,"
			+ " Description, Property.Name AS 'PropertyName', AgentProfile.FirstName AS 'AgentFName',"
			+ " AgentProfile.LastName AS 'AgentLName', AgentProfile.Email AS 'AgentEmail', "
			+ "AgentProfile.contact AS 'AgentContact', AgentProfile.Photo AS 'AgentPhoto', "
			+ "OwnerProfile.FirstName AS 'OwnerFName', OwnerProfile.LastName AS 'OwnerLName', "
			+ "OwnerProfile.Email AS 'OwnerEmail', OwnerProfile.contact AS 'OwnerContact', "
			+ "OwnerProfile.Photo AS 'OwnerPhoto', Property.AgentId AS 'AgentId' FROM PropertyListing.Listing, "
			+ "PropertyListing.Property, PropertyListing.PropertyOwner, PropertyListing.RealEstateAgent, "
			+ "PropertyListing.Profile OwnerProfile, PropertyListing.Profile AgentProfile "
			+ "WHERE ListingID = ? AND Listing.PropertyID = Property.PropertyID AND "
			+ "PropertyOwner.OwnerId = Property.OwnerId AND Property.AgentId = RealEstateAgent.AgentId "
			+ "AND OwnerProfile.ProfileID = PropertyOwner.ProfileID AND "
			+ "AgentProfile.ProfileID = RealEstateAgent.ProfileID; ";
	console.log("Query", queryString);
	connection.query(queryString, [ id ], function(err, rows, fields) {
		if (err) {
			console.log("error");
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

function getListingByCity(q, success, failure) {
	var connection = connection_mysql.getConnection;
	var queryString = 'SELECT  * FROM `PropertyListing`.`searchview` where `City` like \'%'
			+ q + '%\';';
	console.log("Query", queryString);
	connection.query(queryString, q, function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
}

function getTopListings(success, failure) {
	var connection = connection_mysql.getConnection;
	var queryString = 'CALL `PropertyListing`.`TopListing`();';
	connection.query(queryString, function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
}

function getListingForIdSet(ids, success, failure) {
	var connection = connection_mysql.getConnection;
	var idstring = JSON.stringify(ids);
	var queryString = 'select * from `PropertyListing`.`searchview` where ListingID In (?) ORDER BY FIELD(ListingID,?);';
	console.log("Query", queryString);
	connection.query(queryString, [ ids, ids ], function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
}

function deleteListing(id, success, failure) {
	var connection = connection_mysql.getConnection;
	var queryString = 'DELETE FROM `PropertyListing`.`Listing` WHERE ListingID = ?;';
	console.log("Query", queryString);
	connection.query(queryString, [ id ], function(err, rows, fields) {
		if (err) {
			failure(err);
		} else {
			success(rows);
		}
	});
}

exports.getAllListings = getAllListings;
exports.getListingById = getListingById;
exports.deleteProperty = deleteProperty;
exports.getListingByCity = getListingByCity;
exports.getTopListings = getTopListings;
exports.getListingForIdSet = getListingForIdSet;
exports.deleteListing = deleteListing;