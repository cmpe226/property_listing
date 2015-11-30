/**
 * http://usejsdoc.org/
 */

var propertyDAO = require('./property_dao');
var propertyListingDAO = require('./property_listing_dao');
exports.signup = function(req, res) {
	if (req.session.user) {
		res.redirect("/home");
	} else {
		res.render('signup', {
			title : 'Express'
		});
	}
};

exports.propertydetails = function(req, res) {
	res.render('propertydetail.html', {
		title : 'Express'
	});
};

exports.listing = function(req, res) {

	res.render('listing.html', {
		title : 'Express'
	});
};

exports.addproperty = function(req, res) {
	res.render('addproperty.html', {
		title : 'Express'
	});
};

exports.getProperties = function(req, res) {
	propertyDAO.getAllProperties(function(rows) {
		for ( var i in rows) {
			console.log(rows[i]);
		}
	}, function(error) {
		throw error;
	});
}

exports.getPropertiesById = function(req, res) {
	propertyDAO.getPropertyById(100, function(rows) {
		res.render('propertydetail.html', {
			title : 'Express'
		});
	}, function(error) {
		throw error;
	});
}

exports.showHomePage = function(req, res) {
	if (!req.session.user) {
		res.locals.user = {};
		res.locals.user.Username = "Guest";
		res.locals.user.guest = true;
	} else {
		res.locals.user = req.session.user;
		res.locals.user.guest = false;
	}

	res.render("index", {
		listings : req.result
	});
}

// ===================FUNCTION TO FETCH TOP LISTINGS==========
exports.getTopListings = function getTopListings(req, res, next) {
	propertyListingDAO.getTopListings(function(rows) {
		req.topListings = rows[0];
		return next();
	}, function(error) {
		console.log(error);
	});
}

exports.getListingsForIds = function getListingsForIds(req, res, next) {
	var ids = [];
	for (var i = 0; i < req.topListings.length; i++) {
		ids.push(req.topListings[i].ListingId);
	}
	propertyListingDAO.getListingForIdSet(ids, function(rows) {
		req.result = rows;
		return next();
	}, function(error) {
		console.log(error);
	});
}
// ===================END OF FUNCTION TO FETCH TOP LISTINGS==========

// ====================FUNCTIONS TO SHOW PROPERTY DETAILS PAGE

function getPropertyListingById(req, res, next) {
	propertyListingDAO.getListingById(req.params.id, function(rows) {
		req.property = rows[0];
		return next();
	}, function(error) {
		console.log(error);
	});
}

function getPropertyFeatures(req, res, next) {
	propertyDAO.getFeaturesForProperty(req.params.id, function(rows) {
		req.features = rows;
		return next();
	}, function(error) {
		console.log(error);
	});
}

function renderPropertyDetails(req, res) {
	res.render('propertydetail', {
		title : 'Express',
		property : req.property,
		features : req.features,
		user : req.session.user
	});
}

exports.getPropertyListingById = getPropertyListingById;
exports.getPropertyFeatures = getPropertyFeatures;
exports.renderPropertyDetails = renderPropertyDetails;

// ====================END OF FUNCTIONS TO SHOW PROPERTY DETAILS PAGE

// ===================SEARCH========================
function performSearch(req, res) {
	var q = req.query.q;
	propertyListingDAO.getListingByCity(q, function(rows) {
		res.render('search_result', {
			results : rows
		});
	}, function(error) {
		console.log(error);
	});
}
exports.performSearch = performSearch;

// ===================END OF SEARCH========================
