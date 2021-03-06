# fintech-api
The API consists of models, like User, Dataset, and corresponding controllers.
The API also includes the authentication controller which implements the authentication and new user registration entry points.
All the APIs except the user registration and login itself subject to authentication.
Remember, authentication is the act of logging a user in. Authorization is the act of verifying the access rights of a user to interact with a resource.
Some APIs subject to authorization. Possible roles are Provider, Consumer, Administrator.
The API has a db file which is used to connect to the database MongoDB, and app file used for bootstrapping the application itself.
The server file is used to spin up the server and tells the
app to listen on a specific port.

To run install nodejs and MongoDB dependencies. The API expects fintech database to be pre-created. MongoDB Server is expected locally. See the connection string in the db file.

Uses Google Cloud Platform Natural Language API : https://cloud.google.com/nodejs/docs/reference/language/1.1.x/. Access to NLP is via HTTP rather than @gooogle-cloud
module because the former allows us to supply an API key otherwise we need to use a credentials file.

This API key is used to authenticate to Google Cloud. This key is currently hard coded in google_nlp.js. (You can also use an environment variable
GOOGLE_APPLICATION_CREDENTIALS to point to a downloaded credentials file.)

see : https://cloud.google.com/docs/authentication/production

Added mocha test infrastructure see: https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha


The following node npm dependencies need to be installed from the project directory:

npm install

npm install jsonwebtoken --save
npm install bcryptjs --save
npm install express --save
npm install multer --save
npm install cors --save
npm install mongoose --save
npm install fabric-client --save
npm install mocha --save

To run the server execute:

> npm start

Express server listening on port 3000

Docker:

* To build image: `docker build -t dataex-api .`

* If you have independent mongodb:

    * To run container: `docker run -p 3000:3000 --name dataex-api-container dataex-api`
    * To stop container: `docker rm -f dataex-api-container``

* If you want to run mongodb as part of Docker setup:

    * To run the whole setup: `docker-compose up`
    * To stop the whole setup: `docker-compose stop` (Note: Use `stop` since `docker-compose down` will remove the data!!!)


To read the API definitions please import and open the dataex-api.yaml file located at the root of the project with the Swagger Editor tool: https://editor.swagger.io/


Loading Sample Data:
This will create Admin, Consumer and Provider users. As well as some sample datasets.
```
node ./sampledata/dataload
```


Usage examples:

User registration

curl -i -X POST \
   -H "Content-Type:application/x-www-form-urlencoded" \
   -d "name=Alexa" \
   -d "email=alexa@amazon.com" \
   -d "role=Administrator" \
   -d "password=changeme" \
 'http://localhost:3000/api/auth/register'


Response: {
    "auth": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTMwMWMzOTAyMzJiMDcyOGUxZmNjNCIsInJvbGUiOiJBZG1pbmlzdHJhdG9yIiwiaWF0IjoxNTIwNjMyMjU5LCJleHAiOjE1MjA3MTg2NTl9.bDF6PRuZDs2f4daPmLJXvtOpnRMgREl4z9QI1LLLLJI"
}


Please note the the password's hash only is stored on the server.

The token is a JWT valid by default for 24 hours and it is expected as the authentication token in subsequent requests:

curl -i -X GET \
   -H "x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTJlOTkyMDNlNGViMDlkNDIwOGUwNSIsInJvbGUiOiJBZG1pbmlzdHJhdG9yIiwiaWF0IjoxNTIwNjI5MzU3LCJleHAiOjE1MjA3MTU3NTd9.xTon26CuuQ8da8mDOXo5rp9UkOB8AQkDQ2nBVmjr_Vg" \
 'http://localhost:3000/api/auth/me'

Response: {
    "_id": "5aa2e99203e4eb09d4208e05",
    "name": "Alexa",
    "email": "alexa@amazon.com",
    "role": "Administrator",
    "__v": 0
}

Authentication:

curl -i -X POST \
   -H "Content-Type:application/x-www-form-urlencoded" \
   -d "email=alexa@amazon.com" \
   -d "password=changeme" \
 'http://localhost:3000/api/auth/login'


Response: {
    "auth": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTJlOTkyMDNlNGViMDlkNDIwOGUwNSIsInJvbGUiOiJBZG1pbmlzdHJhdG9yIiwiaWF0IjoxNTIwNzAxNTk4LCJleHAiOjE1MjA3ODc5OTh9.ec4yqveHFY18-pY34ze-3Emb5-t_1-KNL9WiGXD4AwM"
}


The following Users controller supports full CRUD on the User model and requires Administrator role authorization:

curl -i -X GET \
   -H "x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTJlOTkyMDNlNGViMDlkNDIwOGUwNSIsInJvbGUiOiJBZG1pbmlzdHJhdG9yIiwiaWF0IjoxNTIwNjI5MzU3LCJleHAiOjE1MjA3MTU3NTd9.xTon26CuuQ8da8mDOXo5rp9UkOB8AQkDQ2nBVmjr_Vg" \
 'http://localhost:3000/users'

Response: [
    {
        "_id": "5aa170bbee95e2193c0c85d0",
        "name": "ilia",
        "email": "ilia@email.com",
        "role": "Consumer",
        "password": "$2a$08$chxleSs3iHr1x/Ja8L4m7OBbmJRJ1D8c5T6gVmmzKeEjXHiWcB6.W",
        "__v": 0
    },
    {
        "_id": "5aa2e51403e4eb09d4208e04",
        "name": "SunLifer",
        "email": "sun@sunlife.com",
        "role": "Consumer",
        "password": "$2a$08$qIoXszYNQjPvhAuBIJyZB.e3MS5IDrJSAkCOqOpIbmx/ezf17wDea",
        "__v": 0
    },
    {
        "_id": "5aa2e99203e4eb09d4208e05",
        "name": "Alexa",
        "email": "alexa@amazon.com",
        "role": "Administrator",
        "password": "$2a$08$UjYtJBhlP7yB8Ka0LK5rTujwMYbwJ2futlMZIWuQKsm8Aj16TcSe.",
        "__v": 0
    },
    {
        "_id": "5aa301c290232b0728e1fcc3",
        "name": "Alexa,weather",
        "email": "alexa@amazon.com",
        "role": "Administrator",
        "password": "$2a$08$Z/HUaZD4rbbB0ignMjRlOuROwrl6jAYrNsmf19ml.V6ZTutGh/gJq",
        "__v": 0
    },
    {
        "_id": "5aa301c390232b0728e1fcc4",
        "name": "Alexa,weather",
        "email": "alexa@amazon.com",
        "role": "Administrator",
        "password": "$2a$08$MMOGSFynjBKzbNfv9Sw2n.kn3lByQwPrtitPZeMbueAwgNnIIH5Ki",
        "__v": 0
    }
]


The following Datasets controller supports full CRUD on the Dataset model and currently does not require authorization:

curl -i -X GET \
   -H "x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTJlOTkyMDNlNGViMDlkNDIwOGUwNSIsInJvbGUiOiJBZG1pbmlzdHJhdG9yIiwiaWF0IjoxNTIwNjI5MzU3LCJleHAiOjE1MjA3MTU3NTd9.xTon26CuuQ8da8mDOXo5rp9UkOB8AQkDQ2nBVmjr_Vg" \
 'http://localhost:3000/datasets'

Response: [
    {
        "categories": [
        ],
        "consumers": [
        ],
        "_id": "5aa2f6e519111e1254406bde",
        "name": "weather",
        "__v": 0
    },
    {
        "categories": [
            "[\"weather\", \"insurance\"]"
        ],
        "consumers": [
        ],
        "_id": "5aa2fa1a90232b0728e1fcc2",
        "name": "weather",
        "description": "All about weather",
        "price": 100500,
        "__v": 0
    }
]

Use the following to get a single dataset keyed by datasetId...

curl -X GET \
  http://localhost:3000/datasets/5aa92a19ea83b53660c63050 \
  -H 'Cache-Control: no-cache' \
  -H 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTdmMDViZWMwZTU2NDA2NGVmMmMzNSIsInJvbGUiOiJQcm92aWRlciIsImlhdCI6MTUyMTQ2MDM4OCwiZXhwIjoxNTIxNTQ2Nzg4fQ.Cnit8c1beke6fnaDj4aTOAJ3Qo1kjjJ4cneqHAmE_Eo'
  
Response: 
{
    "categories": [
        "/Science"
    ],
    "_id": "5aa92a19ea83b53660c63050",
    "name": "Water-balance subregions (WBSs), soil types, and virtual crops for the five land-use time-frames used in the Central Valley Hydrologic Model (CVHM)",
    "description": "All about Water-balance subregions",
    "price": 100500,
    "format": "csv",
    "url": "https://water.usgs.gov/GIS/dsdl/pp1766_FMP.zip",
    "notes": "This digital dataset defines the model grid, water-balance subregions (WBSs), soil types, and virtual crops for the five land-use time-frames in the transient...",
    "__v": 0
}

The following calls require Provider Authz:

curl -i -X POST \
   -H "x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTY4YTgwZWJjOTE4MjY2NDRhMjRlNiIsInJvbGUiOiJBZG1pbmlzdHJhdG9yIiwiaWF0IjoxNTIwODYzODcyLCJleHAiOjE1MjA5NTAyNzJ9.8esAWw7vsXHIjeWBvjTz5P59JEfYhgOHQm9zNunJnOs" \
   -H "Content-Type:application/json" \
   -d \
'{
  "name": "weather",
  "description": "All aboiut weather",
  "price": 100500,
  "categories": ["category1", "category2"],
  "provider": {"providerId": "provider@mail.com"},
  "format": "csv",
  "url": "www.weather.com",
  "notes": "notes"
}' \
 'http://127.0.0.1:3000/datasets'

Response: {
    "provider": {
        "providerId": "provider@mail.com"
    },
    "name": "weather",
    "description": "All aboiut weather",
    "price": 100500,
    "categories": [
        "category1",
        "category2"
    ],
    "format": "csv",
    "url": "www.weather.com",
    "notes": "notes",
    "consumers": [
    ],
    "_id": "5aa68e1f6749d20e10c8ac72",
    "__v": 0
}

NB: The URL may either be a file or a GET API call. The dataset model is not sophisticated enough to define post APIs for the URL yet.

curl -i -X GET \
   -H "x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTY5MjU5Njc0OWQyMGUxMGM4YWM3NiIsInJvbGUiOiJQcm92aWRlciIsImlhdCI6MTUyMDg2NTg4MSwiZXhwIjoxNTIwOTUyMjgxfQ.MGaGEHbVOxxcVgq4BQjNrbE8ZA4qBR7dL9Er4lH7jrA" \
 'http://127.0.0.1:3000/datasets?provider=provider%40mail.com'

Response: [
    {
        "provider": {
            "providerId": "provider@mail.com"
        },
        "categories": [
            "category1",
            "category2"
        ],
        "consumers": [
        ],
        "_id": "5aa68e1f6749d20e10c8ac72",
        "name": "weather",
        "description": "All aboiut weather",
        "price": 100500,
        "format": "csv",
        "url": "www.weather.com",
        "notes": "notes",
        "__v": 0
    }
]

Use the following to get a download the file associated with a dataset keyed by datasetId using a redirect to the URL in the dataset. (NB If the access token is associated with a consumer then that consumer 
must be associated with the dataset. Providers and Administrators are not restricted in this way.)...

curl -X GET \
  http://localhost:3000/download/5aa92a19ea83b53660c63050 \
  -H 'Cache-Control: no-cache' \
  -H 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTdmMDViZWMwZTU2NDA2NGVmMmMzNSIsInJvbGUiOiJQcm92aWRlciIsImlhdCI6MTUyMTQ2MDM4OCwiZXhwIjoxNTIxNTQ2Nzg4fQ.Cnit8c1beke6fnaDj4aTOAJ3Qo1kjjJ4cneqHAmE_Eo'
  
Response: file download

Use the following to get a download the file associated with a dataset keyed by datasetId using a reverse proxy...

curl -X GET \
  http://localhost:3000/download/proxy/5aa92a19ea83b53660c63050 \
  -H 'Cache-Control: no-cache' \
  -H 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTdmMDViZWMwZTU2NDA2NGVmMmMzNSIsInJvbGUiOiJQcm92aWRlciIsImlhdCI6MTUyMTQ2MDM4OCwiZXhwIjoxNTIxNTQ2Nzg4fQ.Cnit8c1beke6fnaDj4aTOAJ3Qo1kjjJ4cneqHAmE_Eo'
  
Response: file download

