/**
 * http://usejsdoc.org/
 */

var property = require('./property_dao');
var propertyListing = require('./property_listing_dao');

exports.doAddProperty = function(req, res, next) {
	var name = req.body.name;
	var street = req.body.street;
	var city = req.body.city;
	var state = req.body.state;
	var zip = req.body.zip;
	var desc = req.body.desc;
	var ownerId = req.body.ownerId;
	var agentId = req.session.user.ID;

	var data = '"' + name + '","' + street + '","' + city + '","' + state
			+ '",' + zip + ',"' + desc + '",' + ownerId + ',' + agentId;

	// test log
	console.log("Property Data: " + data);

	property.addProperty(data, function(err) {
		throw err;
	}, function(rows) {
		console.log(rows);
	});

	// res.redirect('/listings/100');
	req.agentId = agentId;
	next();
}

exports.showPropertiesForAgent = function showPropertiesForAgent(req, res) {
	if (!req.session.user) {
		res.locals.user = {};
		res.locals.user.Username = "Guest";
		res.locals.user.guest = true;
	} else {
		res.locals.user = req.session.user;
		res.locals.user.guest = false;
	}

	if (!req.agentId) {

		req.agentId = req.session.user.ID;
	}

	property.getPropertyByAgentId(req.agentId, function(rows) {
		res.render('properties', {
			properties : rows
		});
	}, function(error) {
		console.log(error);
	});
}

exports.showAddListing = function showAddListing(req, res) {
	if (!req.session.user) {
		res.locals.user = {};
		res.locals.user.Username = "Guest";
		res.locals.user.guest = true;
	} else {
		res.locals.user = req.session.user;
		res.locals.user.guest = false;
	}

	var PropertyID = req.body.PropertyID;
	res.render('addListing', {
		propertyID : PropertyID
	});
}

exports.addListing = function addListing(req, res) {
	if (!req.session.user) {
		res.locals.user = {};
		res.locals.user.Username = "Guest";
		res.locals.user.guest = true;
	} else {
		res.locals.user = req.session.user;
		res.locals.user.guest = false;
	}

	var propertyID = req.body.propertyID;
	var salePrice = req.body.saleprice;
	property.createListing(propertyID, salePrice, function(rows) {
		res.redirect('/listings/' + rows.insertId);
	}, function(error) {
		console.log(error);
	});
}

exports.deleteListing = function deleteListing(req, res) {
	var listingID = req.body.listingId;
	propertyListing.deleteListing(listingID, function(rows) {
		console.log("delete successful");
		console.log(rows);
		res.redirect('/home');
	}, function(error) {
		console.log(error);
	});
}