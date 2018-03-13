//
// Text Classifier
//
// Uses Google Cloud Platform - Natural Language API
//
// Ensure NLP API is enabled and an API authentication key file is available and that the
// environment variable GOOGLE_APPLICATION_CREDENTIALS is set to the path to the file.
//

// Imports the Google Cloud client library
//const language = require('@google-cloud/language');

// Instantiates a client
//const client = new language.LanguageServiceClient();

// The text to analyze
const text = 'Ensure NLP API is enabled and an API authentication key file is available and that the environment variable GOOGLE_APPLICATION_CREDENTIALS is set to the path to the file.';

var nlp = require('./google_nlp.js');

nlp.get_categories(text)
     .then((categories) => {

         console.log(categories);
	 
      })
     .catch((err) => {console.error(err); reject(err);});

//console.log('Categories:');
//categories.forEach(category => { console.log(`Name: ${category.name}, Confidence: ${category.confidence}`); });
	