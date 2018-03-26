/*
 * This uses TR Calais to perform basic text analysis.
 *
 */
const ACCESS_TOKEN = "a58GFgL27tFXHFOn2ahPHTgnJ30GHwmF";
const request = require('request-promise-native');

module.exports = {
    extractTags: extractTags
};

function extractTags(text){
    return classify(text)
        .then((r) => {
            let tags = [];
            Object.keys(r).forEach(k => {
                let analysis = r[k];
                if(analysis._typeGroup && ["topics", "socialTag", "entities"].includes(analysis._typeGroup)){
                    tags.push(analysis.name);
                }
            });
            return tags;
        })
        .catch(err => {
            console.error('Unable to process text with Calais.', err);
            throw err;
        });
}

function classify(text){
    const options = {
        method: 'POST',
        uri: 'https://api.thomsonreuters.com/permid/calais',
        body: text,
        headers: {
            'Content-Type': 'text/raw',
            'OutputFormat': 'application/json',
            'X-AG-Access-Token': ACCESS_TOKEN
        },
        json: true
    };

    return request(options);
}