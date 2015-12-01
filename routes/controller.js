/**
 * http://usejsdoc.org/
 */

var property = require('./property_dao');

exports.doAddProperty = function(req, res) {
	var name = req.body.name;
	var street = req.body.street;
	var city = req.body.city;
	var state = req.body.state;
	var zip = req.body.zip;
	var desc = req.body.desc;
	var ownerId = req.body.ownerId;
	var agentId = req.session.user.ID;

	var data = '"' +name + '","' + street + '","' + city + '","' + state + '",' + zip + ',"'
			+ desc + '",' + ownerId + ',' + agentId;

	// test log
	console.log("Property Data: " + data);

	property.addProperty(data, function(err) {
		throw err;
	}, function(rows) {
		console.log(rows);
	});

	// res.redirect('/listings/100');
	// res.render('/showPropertiesForAgent', {agentId: agentId});
}