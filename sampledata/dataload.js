const request = require('request-promise-native');
const DEFAULT_PASSWORD = "changeme";

let users = require('./data');

let createUsers = users.map( user => {
    return createUser(user.name, user.email, user.role);
});

Promise.all(createUsers)
    .then( userTokens => {
        //Update token so it can be referenced later
        users.forEach( (u, i) => {
            u.token = userTokens[i];
        });

        //Create the databases listed for each user.
        let createAllDatasets = users.filter(u=>u.datasets && u.datasets.length > 0)
            .map( u => createDatasetsForUser(u) );

        return Promise.all(createAllDatasets);
    })
    .then( responses => {
        console.log('Data load complete!');
    })
    .catch( err => {
        console.log('An Error occurred', err);
    });



function createUser(name, email, role){
    const options = {
        method: 'POST',
        uri: 'http://192.168.99.100:3000/api/auth/register',
        body: {
            name: name,
            email: email,
            role: role,
            password: DEFAULT_PASSWORD
        },
        json: true
    };

    return request(options)
        .then( r => {
            if(r.auth){
                return r.token;
            }
            return Promise.reject(`User ${email} creation failed. Auth returned false.`);
        });
}

function createDatasetsForUser(user){
    let createDatasets = user.datasets.map( ds => {
        return createDataset(ds, user.token);
    });
    return Promise.all(createUsers);
}

function createDataset(dataset, userToken){
    const options = {
        method: 'POST',
        uri: 'http://192.168.99.100:3000/datasets',
        headers: {
            'x-access-token': userToken
        },
        body: dataset,
        json: true
    };

    return request(options)
        .catch( e => {
            console.log(`Error occurred creating dataset ${dataset.name}. Details: ${e.message}`);
            throw e;
        });
}