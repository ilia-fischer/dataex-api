//
// Text Classifier using Google Cloud Natural Language API
//
const nlp = require('./google_nlp.js');
const calais = require('./calais');

module.exports = {
    classify: classify
};

function classify(text){
    let classifierProcesses = [
        calais.extractTags(text),
        classifyWithGoogle(text)
    ];

    if (text === null || text.length === 0) {
        return Promise.resolve([]);
    }

    return Promise.all( classifierProcesses )
        .then(responses => {
            let tags = new Set();
            responses[0].forEach(t => tags.add(t)); //add google tags
            responses[1].forEach(t => tags.add(t)); //add calais tags
            return Array.from(tags);
        })
        .catch(err => {
            console.error('Unable to classify text. Error: ', err)
            return Promise.reject(err);
        });
}

function classifyWithGoogle(text){
    return nlp.get_categories(text)
        .then((categories) => {
            var category_names = [];

            if (categories !== null && categories.length > 0) {
                categories.forEach(function (element) { category_names.push(element.name); });
            }

            return category_names;
        });
}
