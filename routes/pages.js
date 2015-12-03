/**
 * http://usejsdoc.org/
 */

var propertyDAO = require('./property_dao');
var propertyListingDAO = require('./property_listing_dao');
var userDao = require('./user-dao');
exports.signup = function(req, res) {
	if (req.session.user) {
		res.redirect("/home");
	} else {
		res.render('signup', {
			title : 'Express'
		});
	}
};

exports.adminLoginPage = function(req,res) {
	res.render("adminlogin");
}

exports.propertydetails = function(req, res) {
	res.render('propertydetail', {
		title : 'Express'
	});
};

exports.listing = function(req, res) {

	res.render('listing.html', {
		title : 'Express'
	});
};

exports.addproperty = function(req, res) {
	res.render('addproperty', {
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
		console.log(rows[0]);
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

exports.getBookmarks = function(req,res,next) {
	var bookmarks = [];
	if(req.session.user) {
		userDao.getBookmarks(req.session.user.ID,function(err,result) {
			bookmarks = result;
			req.session.bookmarks = bookmarks;
			res.locals.bookmarks = bookmarks;
			return next();
		});
	} else {
		return next();
	}
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
		for ( var i in rows) {
			console.log(rows[i]);
		}
		req.property = rows[0];
		console.log(req.property);
		return next();
	}, function(error) {
		console.log(error);
	});
}

function getPropertyFeatures(req, res, next) {
	propertyDAO.getFeaturesForProperty(req.params.id, function(rows) {
		console.log("setting features.. ", rows);
		req.features = rows;
		return next();
	}, function(error) {
		console.log(error);
	});
}

function renderPropertyDetails(req, res) {
	var userData = {};
	if(req.session.user && req.session.user.type) {
		userData.type = req.session.user.type;
	}

	res.render('propertydetail', {
		title : 'Express',
		property : req.property,
		features : req.features,
		user:userData
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

exports.showAdminConsole = function(req,res) {
	if(req.session.user && req.session.user.ID === -1) {
		userDao.getAllUsers(30,function(err,results) {
			res.locals.users = results;
			propertyListingDAO.getAllListings(function(result) {
				res.locals.listings = result;
				res.render('adminconsole');
			});
		});
	} else {
		res.redirect("/home");
	}
}
