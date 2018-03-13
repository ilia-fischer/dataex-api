//
// Text Classifier
//
// Uses Google Cloud Platform - Natural Language API
//
// Ensure NLP API is enabled and an API authentication key file is available and that the
// environment variable GOOGLE_APPLICATION_CREDENTIALS is set to the path to the file.
//
// Imports the Google Cloud client library
const language = require('@google-cloud/language');

module.exports = {
	
	// Uses Google NLP to categorise text
	get_categories: (text) => {
		
        return new Promise((resolve, reject) => {		
		
            const document = {
                  content: text,
                  type: 'PLAIN_TEXT',
                };

                // Instantiates a client
                const client = new language.LanguageServiceClient();
		
                // Classifies text in the document
                client
	                .classifyText({document: document})
	                .then(results => {
				        resolve(results[0].categories);
	                  })
	                .catch(err => {
	                  //console.error('ERROR:', err);
					  reject(err);
	                });  
        });					
	}
} 

	
	