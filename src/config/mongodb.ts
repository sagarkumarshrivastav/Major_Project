
import { MongoClient, ServerApiVersion } from "mongodb";

// Connection URI (replace with your MongoDB connection string)
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/lostfound";

// Create a MongoClient with options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB
export async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Get database instance
export function getDb() {
  return client.db();
}

// Close MongoDB connection
export async function closeMongoConnection() {
  await client.close();
  console.log("MongoDB connection closed");
}

// Collections
export const collections = {
  users: "users",
  lostItems: "lostItems",
  foundItems: "foundItems",
  images: "images"
};
