# Dynamodb - querystring

An easy way to use dynamodb

## Create Table

```javascript
const db = require('dynamodb-querystring')();

db.init_table('Images')
    .add_key('Image', 'HASH')
    .add_key('UserId', 'RANGE')
    .add_column('Image', 'S')
    .add_column('UserId', 'N')
    .create();

```