//
// Text Classifier
//
// Uses Google Cloud Platform - Natural Language API
//
// Ensure NLP API is enabled and an API authentication key file is available and that the
// environment variable GOOGLE_APPLICATION_CREDENTIALS is set to the path to the file.
//
// Imports the Google Cloud client library
//
// See : https://cloud.google.com/natural-language/docs/classifying-text#language-classify-content-file-nodejs
//
const language = require('@google-cloud/language');

// API key associated with Google CLoud account
const api_key = 'AIzaSyCHAExm2iofgvIQG8dS-Ax6Ki1MioIDe24';

module.exports = {
	
	// Uses Google NLP to categorise text
	get_categories: (text) => {
		
        return new Promise((resolve, reject) => {		
		
		    try
			{
              const document = {
                  content: text,
                  type: 'PLAIN_TEXT',
                };

                // Instantiates a client
                const client = new language.LanguageServiceClient();
				
                // Classifies text in the document
                client
	                .classifyText({document: document, 'key': api_key})
	                .then(results => {
				        resolve(results[0].categories);
	                  })
	                .catch(err => {
	                  //console.error('ERROR:', err);
					  reject(err);
	                });  
            }
            catch (err)			
			{
			    reject(err);
			}
        });					
	},
	
	/*
	curl "https://language.googleapis.com/v1/documents:classifyText?key=${API_KEY}" \
		-s -X POST -H "Content-Type: application/json" --data-binary @request.json	
	*/

	// Uses Google NLP to categorise text - api key is supplied on an HTTP request
	get_categories_with_api_key: (text) => {
		
        return new Promise((resolve, reject) => {		
		
			var http = require('https');
			
			var body = {"document": { "type": "PLAIN_TEXT", "content": text } };	
			var post_data = JSON.stringify(body);        
	
			// An object of options to indicate where to post to
			var post_options = {
				  host: 'language.googleapis.com',
				  path: '/v1/documents:classifyText?key=' + api_key,
				  method: 'POST',
				  headers: {
					  'Cache-Control': 'no-cache',
					  'Content-Type': 'application/json',
				  }
			  };
	
			// Set up the request
			var post_req = http.request(post_options, function(res) {
				  const body = [];
				  res.on('data', (chunk) => body.push(chunk));
				  res.on('end', () => resolve(JSON.parse(body.join('')).categories));      
			  });
			
			// post the data
			post_req.write(post_data);
			post_req.end();
	
			post_req.on('error', (err) => reject(err));
        });					
	}
} 

	
	