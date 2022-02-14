// Install the API client: https://www.algolia.com/doc/api-client/getting-started/install/javascript/?client=javascript
const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');

const data = require('../data/products.json');

dotenv.config({ path: '../.env.test' });

const results = [];
// iterate over products records, find cameras, && discount price by 20%
data.forEach((record) => {
  if (record.categories.includes('Cameras & Camcorders')) {
    record.price = Math.floor(record.price - record.price * 0.2);
    results.push(record);
  }
});

// Get your Algolia Application ID and (admin) API key from the dashboard: https://www.algolia.com/account/api-keys
// and choose a name for your index. Add these environment variables to a `.env` file:
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX;

// Start the API client
// https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

// Create an index (or connect to it, if an index with the name `ALGOLIA_INDEX_NAME` already exists)
// https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/#initialize-an-index
const index = client.initIndex(ALGOLIA_INDEX_NAME);

const postData = (records) => {
  index
    .saveObjects(records)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

 postData(results);

const deleteAllRecords = () => {
    index.clearObjects().then((data) => {
        console.log(data);
    }).catch((err) => {
      console.log(err);
    });
  };

// if you need to delete all objects uncomment this
// deleteAllRecords();
