/**
 * http://usejsdoc.org/
 */
var mysql = require('./mysql');

var BOOKMARKS_TABLE = 'Bookmarks';

function createBookmark(callback, listingId, userId){
	var query = "INSERT INTO " + BOOKMARKS_TABLE + "(ListingId, UserId) VALUES ("+ listingId +", "+ userId +")" ;
	var connection = mysql.getConnection;
	connection.query(query,function(err,result) {
		if(err) {
			throw err;
		} else {
			callback(err,result);
		}
	});
	
}

exports.createBookmark = createBookmark;