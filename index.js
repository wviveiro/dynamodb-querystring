'use strict';

const dynamodbClient = require('serverless-dynamodb-client');
const dynamodb = dynamodbClient.raw;
const DBNAME = process.env.DYNAMODB_NAME;

const Db = () => {
    
    


    const tableExists = (tableName) => {
        return new Promise((resolve, reject) => {
            dynamodb.listTables({}, (err, data) => {
                if (err) return reject(err);

                if (data.TableNames.indexOf(`${DBNAME}${tableName}`) === -1) return resolve(false);
                return resolve(true);
            });
        });
    }

    const init_table = (tableName) => {

        // Initialise params of the new table
        let params = {
            TableName: `${DBNAME}${tableName}`,
            KeySchema: [],
            GlobalSecondaryIndexes:[],
            LocalSecondaryIndexes: [],
            AttributeDefinitions: [],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }

        const _this = {};

        _this.add_key = (AttributeName, KeyType) => {
            if (KeyType.indexOf('HASH', 'RANGE') === -1) throw 'Invalid KeyType';
            params.KeySchema.push({
                AttributeName,
                KeyType
            });

            return _this;
        }

        _this.add_column = (AttributeName, AttributeType) => {
            if (AttributeType.indexOf('S', 'N', 'B') === -1) throw 'Invalid AttributeType';

            params.AttributeDefinitions.push({
                AttributeName,
                AttributeType
            });

            return _this;
        }

        _this.setParams = (myParams) => {
            params = myParams;
            return _this;
        }




        return _this;
    }


    return {
        tableExists
    }

}

module.exports = Db;