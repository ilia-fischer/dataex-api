//
// Text Classifier
//
// Uses Google Cloud Platform - Natural Language API
//

// API key associated with Google Cloud account
const gcp_api_key = 'AIzaSyCHAExm2iofgvIQG8dS-Ax6Ki1MioIDe24';

module.exports = {
	
	/*
	curl "https://language.googleapis.com/v1/documents:classifyText?key=${API_KEY}" \
		-s -X POST -H "Content-Type: application/json" --data-binary @request.json	
	*/
	
	// Uses Google NLP to categorise text - api key is supplied on an HTTP request (nb: api_key is defaulted if not supplied)
	get_categories: (text, api_key) => {
		
		var _api_key = api_key!==undefined ?  api_key  : gcp_api_key;
		
        return new Promise((resolve, reject) => {		
		
			var http = require('https');
			
			var body = {"document": { "type": "PLAIN_TEXT", "content": text } };	
			var post_data = JSON.stringify(body);        
	
			// An object of options to indicate where to post to
			var post_options = {
				  host: 'language.googleapis.com',
				  path: '/v1/documents:classifyText?key=' + _api_key,
				  method: 'POST',
				  headers: {
					  'Cache-Control': 'no-cache',
					  'Content-Type': 'application/json',
				  }
			  };
	
			// Set up the requestsx
			var post_req = http.request(post_options, function(res) {
				  var response_body = [];
				  res.on('data', (chunk) => response_body.push(chunk));
				  res.on('end', () => {
					  
					  var jsonResponse = JSON.parse(response_body.join(''));
					  
					  if (jsonResponse.error!=undefined && jsonResponse.error.code==400)
					  {
						  if (jsonResponse.error.status=='INVALID_ARGUMENT' && jsonResponse.error.message.lastIndexOf('Invalid text content: too few tokens', 0)===0)
						  {
							resolve([]);
						  }
						  else
					      {
							reject(jsonResponse.error.message);
						  }
					  }
					  else
					  {
						  resolve(jsonResponse.categories);
					  }
				  });   
			  });
			
			// post the data
			post_req.write(post_data);
			post_req.end();
			post_req.on('error', (err) => {reject(err);});
        });					
	}
} 

	
	