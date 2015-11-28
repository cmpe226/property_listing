/**
 * http://usejsdoc.org/
 */

var propertyDAO = require('./property_dao');
exports.signup = function(req, res) {
	res.render('signup.ejs', {
		title : 'Express'
	});
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
	propertyDAO.getPropertyById(function(rows) {
		for ( var i in rows) {
			console.log(rows[i]);
		}
	}, function(error) {
		throw error;
	});
}