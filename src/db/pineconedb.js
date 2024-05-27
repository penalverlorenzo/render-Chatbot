import { Pinecone } from '@pinecone-database/pinecone';
// import { config } from '../config';

export const pineconeDB = new Pinecone({
  apiKey: '3325e189-d5af-432c-aa00-29fed21a5c61'
});
const indexName = 'maindatabase'
const indexList = await pineconeDB.listIndexes()

function createPineconeIndex() {
//  console.log({list: });
indexList.indexes.forEach(async (index)=> {
    if (index.name === indexName) {
        return console.log('Index in the list');
    }else{
        await pineconeDB.createIndex({
            name: indexName,
            dimension: 8,
            metric: 'euclidean',
            spec: { 
                serverless: { 
                    cloud: 'aws', 
                    region: 'us-east-1' 
                }
            } 
        });
    }
})


   
}


createPineconeIndex()