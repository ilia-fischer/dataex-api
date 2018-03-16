//
// Testing NLP and Classifier functions 
//
// See https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35
//

var utility = require("./test_utility.js");
var nlp = require("../classifier/google_nlp.js");
var classifier = require("../classifier/classifier.js");

// Text that works...
const text1 = 'Google, headquartered in Mountain View, unveiled the new Android phone at the Consumer Electronic Show.  Sundar Pichai said in his keynote that users love their new Android phones.';
const text1_expected_categories = ['/Computers & Electronics', '/Internet & Telecom/Mobile & Wireless', '/News'];

// Empty text...
const text2 = '';
const text2_expected_categories = [];

// Text with too few tokens results in an error...
const text3 = 'A';
const text3_expected_categories = [];

//
// Google NLP tests
//
describe("Tests google_nlp.js...", function() {

	it ("Test get_categories() - text1 expects 3 categories", async() => {
		
		await nlp.get_categories(text1)
			
			.then((categories) => {
				
				utility.assert(categories.length==3);
				
				categories.forEach(function(element) {
					utility.assert(text1_expected_categories.includes(element.name));
				});
			})
			.catch((err) => {
				return Promise.reject('Expected method to succeed [error: ' + err + ']');
			});
	}),

	it ("Test get_categories() - empty text should return empty array", async() => {
		
		await nlp.get_categories(text2)
			
			.then((categories) => {
				
				utility.assert(categories!=undefined);
				utility.assert(categories.length==0);
				
			})
			.catch((err) => {
				return Promise.reject('Expected method to succeed [error: ' + err + ']');
			});
	}),
	
	it ("Test get_categories() - uses a bad api_key - should return an error 400", async() => {
		
		await nlp.get_categories(text1, 'somebadkey')
			
			.then((categories) => {
				
				return Promise.reject('Expected method to reject.');
				
			})
			.catch((err) => {
				//console.error(err)
				utility.assert(err!=undefined);				
			});
	})

	it ("Test get_categories() - text with few too tokens - should return an error 400", async() => {
		
		await nlp.get_categories(text3)
			
			.then((categories) => {
				
				return Promise.reject('Expected method to reject.');
				
			})
			.catch((err) => {
				//console.error(err)
				utility.assert(err!=undefined);				
			});
	})
});

//
// Classifier tests
//
describe("Tests classifier.js...", function() {

	it ("Test classify() - text1 expects 3 categories", async() => {
		
		await classifier.classify(text1)
			
			.then((categories) => {
				
				utility.assert(categories.length==3);
				
				categories.forEach(function(category) {
					utility.assert(text1_expected_categories.includes(category));
				});
			})
			.catch((err) => {
				return Promise.reject('Expected method to succeed [error: ' + err + ']');
			});
	}),

	it ("Test classify() - empty text should return empty array", async() => {
		
		await classifier.classify(text2)
			
			.then((categories) => {
				
				utility.assert(categories!=undefined);
				utility.assert(categories.length==0);
				
			})
			.catch((err) => {
				return Promise.reject('Expected method to succeed [error: ' + err + ']');
			});
	}),
	
	it ("Test classify() - uses a bad api_key - should return an error 400", async() => {
		
		await classifier.classify(text1, 'somebadkey')
			
			.then((categories) => {
				
				return Promise.reject('Expected method to reject.');
				
			})
			.catch((err) => {
				//console.error(err)
				utility.assert(err!=undefined);				
			});
	})

	it ("Test classify() - text with few too tokens - should return an error 400", async() => {
		
		await classifier.classify(text3)
			
			.then((categories) => {
				
				return Promise.reject('Expected method to reject.');
				
			})
			.catch((err) => {
				//console.error(err)
				utility.assert(err!=undefined);				
			});
	})
});



