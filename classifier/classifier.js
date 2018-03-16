//
// Text Classifier using Google Cloud Natural Language API
//
var nlp = require('./google_nlp.js');

module.exports = {
	
	classify: (text) => {
		
        return new Promise((resolve, reject) => {		
		
			if (text!=null && text.length>0)
			{
    			nlp.get_categories(text)
	    			.then((categories) => {
						
		    			var category_names = [];
				
			    		if (categories!=null && categories.length>0)
                        {
					    	categories.forEach(function(element) {category_names.push(element.name);});
					    }
					
					    resolve(category_names);
    				  })
	    			.catch((err) => {
		    			//console.error(err); 
			    		reject(err);
				    });
			}
			else
			{
			    resolve([]);	
			}
        });					
	}
} 
	 
	 
	