
// This file is kept as a placeholder but not actively used
// We're transitioning away from MongoDB for better client-side performance
console.log("MongoDB integration disabled for improved startup time");

const dummyPromise = Promise.resolve({
  db: (name: string) => ({
    collection: (name: string) => ({
      find: () => ({ toArray: () => Promise.resolve([]) }),
      findOne: () => Promise.resolve(null),
      insertOne: () => Promise.resolve({ insertedId: 'local-id-' + Date.now() }),
      updateOne: () => Promise.resolve({ modifiedCount: 1 }),
      countDocuments: () => Promise.resolve(0)
    })
  })
});

export default dummyPromise;
