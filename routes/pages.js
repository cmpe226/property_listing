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