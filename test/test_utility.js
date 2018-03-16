module.exports = {
	
	// Home made assert
	assert: (condition) => {
		
		if (!condition)
		{
			if (typeof Error!==undefined) {
				throw new Error('Assert check failed');
			}			
			
			throw 'Assert check failed';	
		}
	},
	
	// Home made assert - with a message
	assert_msg: (condition, error) => {
		
		if (!condition)
		{
			throw error;	
		}
	},
	
	// Home made assert - with a message and the function name
	assert_fname: (condition, fname,  error) => {
		
		if (!condition)
		{
			throw fname + ' failed - ' + error;	
		}
	},
	
    // Reads a JSON file and returns a JSON object
    readJSON: (filename) => {
        var fs = require('fs');
        var json = fs.readFileSync(filename, "utf-8");
        //console.log("IQDataFeed: Reading token cache : " + json)
        var jsonObj = JSON.parse(json);
        return jsonObj;
    },
    
    // Writes a JSON object to a file
    writeJSON: (filename, jsonObj) => {
        var fs = require('fs');
        //console.log("IQDataFeed: Writing token cache : " + JSON.stringify(jsonObj))
        fs.writeFileSync(filename, JSON.stringify(jsonObj));
    }
} 