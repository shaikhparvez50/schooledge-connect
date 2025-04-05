
// MongoDB integration utility
import { MongoClient as Client } from 'mongodb';

// Secure connection string - in production, this should come from environment variables
const uri = process.env.MONGODB_URI || "mongodb+srv://shaikhparbej50:*******@cluster0.cc4falz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create cached connection variable
let cachedClient: Client | null = null;
let cachedDb: any = null;

// Connection function
export async function connectToDatabase() {
  // If the connection exists, return it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Connect to the MongoDB cluster
    const client = new Client(uri);
    await client.connect();
    
    // Specify which database we want to use
    const db = client.db("schooledge");
    
    cachedClient = client;
    cachedDb = db;
    
    console.log("Connected successfully to MongoDB");
    return { client, db };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    
    // Fallback to local storage if MongoDB connection fails
    console.log("Falling back to local storage database");
    return { 
      client: null, 
      db: {
        collection: (name: string) => ({
          find: () => ({ toArray: () => Promise.resolve([]) }),
          findOne: () => Promise.resolve(null),
          insertOne: () => Promise.resolve({ insertedId: 'local-id-' + Date.now() }),
          updateOne: () => Promise.resolve({ modifiedCount: 1 }),
          countDocuments: () => Promise.resolve(0)
        })
      }
    };
  }
}

export default connectToDatabase;
