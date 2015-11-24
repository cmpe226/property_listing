//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var client = require('./services/client_service');
var guard = require('./services/guard_service');
//var profile = require('./services/profile');
//var member = require('./services/member');

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){

	console.log("listening on user queue");
	cnn.queue('client_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			client.handle_request(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
			
		});
	});
	
	console.log("listening on guard_queue");
	cnn.queue('guard_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			guard.handle_request(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
			
		});
	});
	
//	console.log("listening on profile_queue");
//	cnn.queue('profile_queue', function(q){
//		q.subscribe(function(message, headers, deliveryInfo, m){
//			util.log(util.format( deliveryInfo.routingKey, message));
//			util.log("Message: "+JSON.stringify(message));
//			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
//			profile.handle_request(message, function(err,res){
//
//				//return index sent
//				cnn.publish(m.replyTo, res, {
//					contentType:'application/json',
//					contentEncoding:'utf-8',
//					correlationId:m.correlationId
//				});
//			});
//		});
//	});
//	
//	console.log("listening on member_queue");
//	cnn.queue('member_queue', function(q){
//		q.subscribe(function(message, headers, deliveryInfo, m){
//			util.log(util.format( deliveryInfo.routingKey, message));
//			util.log("Message: "+JSON.stringify(message));
//			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
//			member.handle_request(message, function(err,res){
//
//				//return index sent
//				cnn.publish(m.replyTo, res, {
//					contentType:'application/json',
//					contentEncoding:'utf-8',
//					correlationId:m.correlationId
//				});
//			});
//		});
//	});
	
});

