import { type Db, MongoClient } from 'mongodb';

const uri =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  process.env.DATABASE_URI;
const dbName = process.env.MONGODB_DB || process.env.MONGO_DB || 'megicode';

let clientPromise: Promise<MongoClient> | null = null;

function getMongoClient() {
  if (!uri) {
    throw new Error('Missing MongoDB connection environment variable');
  }

  if (!clientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 15000,
    });
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}
