/**
 * http://usejsdoc.org/
 */

exports.signup = function(req, res) {
	res.render('signup.html', {
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