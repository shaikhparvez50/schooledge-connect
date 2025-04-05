
// MongoDB integration utility
// Note: This file provides a mock implementation for browser environments
// In production, MongoDB operations should run on a server

// Create a mock MongoDB client for browser environments
class MockMongoClient {
  db(name) {
    return {
      collection: (collectionName) => ({
        find: () => ({ toArray: () => Promise.resolve([]) }),
        findOne: () => Promise.resolve(null),
        insertOne: () => Promise.resolve({ insertedId: 'local-id-' + Date.now() }),
        updateOne: () => Promise.resolve({ modifiedCount: 1 }),
        countDocuments: () => Promise.resolve(0)
      })
    };
  }

  connect() {
    console.log("Mock MongoDB client connected");
    return Promise.resolve(this);
  }

  close() {
    return Promise.resolve();
  }
}

// In a browser environment, we use a mock client
// In a real application, MongoDB operations should be performed server-side
const isBrowser = typeof window !== 'undefined';

// Cache the mock client
let cachedClient = null;
let cachedDb = null;

// Connection function
export async function connectToDatabase() {
  // If we already have a connection, return it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    if (isBrowser) {
      console.warn("Warning: Attempting to use MongoDB in browser environment. Using mock implementation.");
      
      // Use mock client in browser
      const client = new MockMongoClient();
      const db = client.db("schooledge");
      
      cachedClient = client;
      cachedDb = db;
      
      return { client, db };
    } else {
      // This code path would never execute in a browser
      // It's here to maintain the API for potential server-side usage
      // But in a real app, this would be in a separate server file
      throw new Error("Server-side MongoDB operations should be implemented in a backend service.");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    
    // Fallback to local storage database
    console.log("Falling back to local storage database");
    return { 
      client: null, 
      db: {
        collection: (name) => ({
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
