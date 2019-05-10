# Dynamodb - querystring

An easy way to use dynamodb

## Create Table

```javascript
const db = require('dynamodb-querystring')(argsInitialiser);

await db.init_table('Users')
        .add_key({
            id: 'HASH'
        })
        .add_attr({id: 'S'})
        .add_attr({email: 'S'})
        .add_global_index('UserEmailIndex', {
            email: 'HASH'
        }).create();

```

1. **require('dynamodb-querystring')(argsInitialiser)**: initialise db connection
  
   1. `argsInitialiser.prefix`: Add a prefix to tables

2. **db.init_table(table)**: Init the creation of a new table
    
   1. **.add_key(args)**: Add new `KeySchema` to params. object KEY is `AttributeName`, object value is `KeyType`
    
   2. **.add_attr(args)**: Add new `AttributeDefinitions` to parasm. object Key is `AttributeName`, object value is `AttributeType`
    
   3. **.add_global_index(name, argsSchema, argsProjection, argsProvisioned)**: Create a new `GlobalSecondaryIndexes`

      1. **name**: `IndexName`
      2. **argsSchema**: add new `KeySchema` to `GlobalSecondaryIndexes` params. object KEY is `AttributeName` and value is `KeyType`
      3. **argsProjection**: Not Required. `argsProjection.type` is **ProjectionType**. `argsProjection.attrs` is **NonKeyAttributes**. Default `ProjectionType` is `ALL`
      4. **argsProvisioned**: Not Required. `argsProvisioned.read` is **ReadCapacityUnits**. `ReadCapacityUnits.write` is **WriteCapacityUnits**. default **ReadCapacityUnits** and **WriteCapacityUnits** is `5`

   4. **create()**: returns a Promise and creates the table