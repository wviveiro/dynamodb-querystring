'use strict';

const dynamodbClient = require('serverless-dynamodb-client');
const dynamodb = dynamodbClient.raw;

const Db = (DBNAME) => {
    
    


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

        const clean_params = () => {
            if (params.GlobalSecondaryIndexes.length === 0) delete params.GlobalSecondaryIndexes;
            if (params.LocalSecondaryIndexes.length === 0) delete params.LocalSecondaryIndexes;
        }

        _this.add_key = (args) => {
            for (let i in args) {
                if (args.hasOwnProperty(i)) {
                    let AttributeName = i;
                    let KeyType = args[i];
                    if (KeyType.indexOf('HASH', 'RANGE') === -1) throw 'Invalid KeyType';
                    params.KeySchema.push({
                        AttributeName,
                        KeyType
                    });
                }
            }
            return _this;
        }

        _this.add_attr = (args) => {
            for (let i in args) {
                if (args.hasOwnProperty(i)) {
                    let AttributeName = i;
                    let AttributeType = args[i];
                    if (AttributeType.indexOf('S', 'N', 'B') === -1) throw 'Invalid AttributeType';
                    params.AttributeDefinitions.push({
                        AttributeName,
                        AttributeType
                    });
                }
            }

            return _this;
        }

        _this.setProvision = (args) => {
            if (args.read) params.ProvisionedThroughput.ReadCapacityUnits = args.read;
            if (args.write) params.ProvisionedThroughput.WriteCapacityUnits = args.write;
            return _this;
        }

        _this.setParams = (myParams) => {
            params = myParams;
            return _this;
        }


        _this.getParams = () => {
            clean_params();
            return params;
        }

        _this.create = () => {
            return new Promise((resolve, reject) => {
                clean_params();

                dynamodb.createTable(params, (err, data) => {
                    if (err) return reject(err);
                    return resolve(data);
                });
            });
        }

        _this.add_global_index = (IndexName, argsSchema, argsProjection, argsProvisioned) => {
            const _params = {
                IndexName,
                KeySchema: [],
                Projection: {
                    ProjectionType: 'ALL'
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5,
                }
            }

            for (let i in argsSchema) {
                if (argsSchema.hasOwnProperty(i)) {
                    _params.KeySchema.push({
                        AttributeName: i,
                        KeyType: argsSchema[i]
                    })
                }
            }

            if (argsProjection && argsProjection.type) {
                _params.Projection.ProjectionType = argsProjection.type;
                if (argsProjection.attrs) {
                    _params.Projection.NonKeyAttributes = argsProjection.attrs
                }
            }

            if (argsProvisioned && argsProvisioned.read) {
                _params.ProvisionedThroughput.ReadCapacityUnits = argsProvisioned.read;
            }
            if (argsProvisioned && argsProvisioned.write) {
                _params.ProvisionedThroughput.WriteCapacityUnits = argsProvisioned.write;
            }

            params.GlobalSecondaryIndexes.push(_params);

            return _this;
        }



        return _this;
    }


    return {
        tableExists,
        init_table
    }

}

module.exports = Db;