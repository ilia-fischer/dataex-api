'use strict'

var invoke = require('./scripts/invoke')
var query = require('./scripts/query')

exports.overview = function(req, resp) {
	var msg = "Blockchain Secured Data Exchange Platform. ";
	msg += "POST /dataset to add new dataset. ";
	msg += "GET /dataset/:datasetid to get dataset info. ";
	msg += "POST /dataset/:datasetid to update dataset. ";
	msg += "DELETE /dataset/:datasetid to delete a dataset";
	resp.json(msg);
	resp.end();
}

exports.addDataSet = function(req, resp) {
	console.log("adding dataset: " + JSON.stringify(req.body));
	var response = invoke.invoke("addDataSet", [JSON.stringify(req.body)]);
	response.then((results) => {
		console.log('Send transaction promise and event listener promise have completed');
		// check the results in the order the promises were added to the promise all list
		if (results && results[0] && results[0].status === 'SUCCESS') {
			console.log('Successfully sent transaction to the orderer.');
		} else {
			console.error('Failed to order the transaction. Error code: ' + response.status);
		}

		if(results && results[1] && results[1].event_status === 'VALID') {
			console.log('Successfully committed the change to the ledger by the peer');
			resp.send(results[1]);
			resp.end()
		} else {
			console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
			resp.status(500).send('Transaction failed to be committed to the ledger due to ::'+results[1].event_status)
			resp.end()
		}
	}).catch((err) => {
		console.error('Failed to invoke successfully :: ' + err);
		resp.status(500).send('Failed to invoke successfully :: ' + err)
		resp.end()
	});	
}

exports.accessDataSet = function(req, resp) {
	console.log("accessing dataset: " + req.body.url);
	var response = invoke.invoke("accessDataSet", [req.body.url, req.body.consumer]);
	response.then((results) => {
		console.log('Send transaction promise and event listener promise have completed');
		// check the results in the order the promises were added to the promise all list
		if (results && results[0] && results[0].status === 'SUCCESS') {
			console.log('Successfully sent transaction to the orderer.');
		} else {
			console.error('Failed to order the transaction. Error code: ' + response.status);
		}

		if(results && results[1] && results[1].event_status === 'VALID') {
			console.log('Successfully committed the change to the ledger by the peer');
			resp.send(results[1]);
			resp.end()
		} else {
			console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
			resp.status(500).send('Transaction failed to be committed to the ledger due to ::'+results[1].event_status)
			resp.end()
		}
	}).catch((err) => {
		console.error('Failed to invoke successfully :: ' + err);
		resp.status(500).send('Failed to invoke successfully :: ' + err)
		resp.end()
	});	
}

exports.getDataSet = function(req, resp) {
	console.log("getting dataset");
	var response = query.invoke("getDataSet", ["Ken", "http://www.cnn.com"]);
	response.then((query_responses) => {
		console.log("Query has completed, checking results");
		// query_responses could have more than one  results if there multiple peers were used as targets
		if (query_responses && query_responses.length == 1) {
			if (query_responses[0] instanceof Error) {
				console.error("error from query = ", query_responses[0]);
			} else {
				console.log("Response is ", query_responses[0].toString());
			}
			resp.send(query_responses[0].toString());
			resp.end();
		} else {
			console.log("No payloads were returned from query");
		}
	}).catch((err) => {
		console.error('Failed to query successfully :: ' + err);
	})
}

exports.deleteDataSet = function(req, resp) {

}

exports.updateDataSet = function(req, resp) {

}

exports.queryDataSet = function(req, resp) {
	console.log(JSON.stringify(req.body));
	var response = query.invoke("queryDataSet", [JSON.stringify(req.body)]);
	response.then((query_responses) => {
		console.log("Query has completed, checking results");
		// query_responses could have more than one  results if there multiple peers were used as targets
		if (query_responses && query_responses.length == 1) {
			if (query_responses[0] instanceof Error) {
				console.error("error from query = ", query_responses[0]);
				resp.status(500).send(query_responses[0].toString());
				resp.end();
			} else {
				console.log("Response is ", query_responses[0].toString());
				resp.send(query_responses[0].toString());
				resp.end();
			}
		} else {
			console.log("No payloads were returned from query");
		}
	}).catch((err) => {
		console.error('Failed to query successfully :: ' + err);
		resp.status(500).send('Failed to query successfully :: ' + err);
		resp.end();
	})
}

exports.queryAccount = function(req, resp) {
	console.log("query account");
	var response = query.invoke("queryAccount", [req.body.owner]);
	response.then((query_responses) => {
		console.log("Query has completed, checking results");
		// query_responses could have more than one  results if there multiple peers were used as targets
		if (query_responses && query_responses.length == 1) {
			if (query_responses[0] instanceof Error) {
				console.error("error from query = ", query_responses[0]);
				resp.status(500).send(query_responses[0].toString());
				resp.end();
			} else {
				console.log("Response is ", query_responses[0].toString());
				resp.send(query_responses[0].toString());
				resp.end();
			}
		} else {
			console.log("No payloads were returned from query");
		}
	}).catch((err) => {
		console.error('Failed to query successfully :: ' + err);
		resp.status(500).send('Failed to query successfully :: ' + err);
		resp.end();
	})
}