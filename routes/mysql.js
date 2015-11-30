/**
 * http://usejsdoc.org/
 */

var mysql = require('mysql');

function getConnection(){
	
	var connection = mysql.createConnection({
	    host     : "52.33.120.11",
    	user     : "cmpe226",
    	password : "root",
        //host     : "localhost",
        //user     : "root",
        //password : "warri0rs",
    	database : "PropertyListing"
	});
	return connection;
}

exports.getConnection = getConnection();