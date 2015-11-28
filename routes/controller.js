/**
 * http://usejsdoc.org/
 */

exports.doAddProperty = function(req, res) {
	  var street = req.body.street;
	  var city = req.body.city;
	  var state = req.body.state;
	  var zip = req.body.zip;
	  var desc = req.body.desc;
	  var ownerId = req.body.ownerId;
	  
	  //test log
	  console.log("Street: " + street + " City: " + city);
	  
	  /*
	   * Call method to add into db here
	   * respond accordingly
	   */
}