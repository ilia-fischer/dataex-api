// Helper invokes generic Blockchain API HTTP requests
exports.blockchainApiRequest = function(host, port, querypath, request_body) {
	
	//console.log("request: " + JSON.stringify(request_body));
	
	return new Promise((resolve, reject) => {   
	
		var http = require('http');
		var post_data = JSON.stringify(request_body);        

		// An object of options to indicate where to post to
		var post_options = {
			  host: host,
			  port: port,
			  path: querypath,
			  method: 'POST',
			  headers: {
				  'Cache-Control': 'no-cache',
				  'Content-Type': 'application/json'
			  }
		  };

		// Set up the request
		var post_req = http.request(post_options, function(res) {
			  
			  // temporary data holder
			  const body = [];
			  // on every content chunk, push it to the data array
			  res.on('data', (chunk) => body.push(chunk));
			  // we are done, resolve promise with those joined chunks
			  res.on('end', () => resolve(body.join('')));      
		  });
		
		// post the data
		post_req.write(post_data);
		post_req.end();

		post_req.on('error', (err) => reject(err));
	});
}

