'use strict';

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');

//
var fabric_client = new Fabric_Client();

// setup the fabric network
var channel = fabric_client.newChannel('mychannel');
//var peer = fabric_client.newPeer('grpc://localhost:7051');
var peer_addr = (process.env.CORE_PEER_ADDRESS ? process.env.CORE_PEER_ADDRESS : 'localhost:7051')
console.log('peer address: ' + peer_addr)
var peer = fabric_client.newPeer('grpc://' + peer_addr);

channel.addPeer(peer);

//
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:'+store_path);
var tx_id = null;

exports.invoke = function (fcn, args) {
	console.log("function: " + fcn)
	console.log("args: " + args)
	// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
	return Fabric_Client.newDefaultKeyValueStore({ path: store_path
	}).then((state_store) => {
		// assign the store to the fabric client
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		// use the same location for the state store (where the users' certificate are kept)
		// and the crypto store (where the users' keys are kept)
		var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);

		// get the enrolled user from persistence, this user will sign all requests
		return fabric_client.getUserContext('user1', true);
	}).then((user_from_store) => {
		if (user_from_store && user_from_store.isEnrolled()) {
			console.log('Successfully loaded user1 from persistence');
			member_user = user_from_store;
		} else {
			throw new Error('Failed to get user1.... run registerUser.js');
		}

		const request = {
			//targets : --- letting this default to the peers assigned to the channel
			'chaincodeId': 'dataex',
			'fcn': fcn,
			'args': args
		};

		// send the query proposal to the peer
		return channel.queryByChaincode(request);
	});
}

//this.invoke('addDataSet', ['Ken', 'http://cnn.com'])
