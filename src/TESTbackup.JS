// import { MongoTransferer, MongoDBDuplexConnector, LocalFileSystemDuplexConnector } from 'mongodb-snapshot';

const { MongoTransferer, MongoDBDuplexConnector, LocalFileSystemDuplexConnector } = require('mongodb-snapshot')

async function dumpMongo2Localfile() {
    const mongo_connector = new MongoDBDuplexConnector({
        connection: {
            uri: `mongodb://localhost:27017/boowlk`,
            dbname: 'boowlk',
        },
    });
 
    const localfile_connector = new LocalFileSystemDuplexConnector({
        connection: {
            path: './',
        },
    });
 
    const transferer = new MongoTransferer({
        source: mongo_connector,
        targets: [localfile_connector],
    });
 
    for await (const { total, write } of transferer) {
        console.log(`remaining bytes to write: ${total - write}`);
    }
}