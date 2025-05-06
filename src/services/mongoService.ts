
import { connectToMongo, getDb, collections } from "@/config/mongodb";
import { Item, ItemFormData, ItemType, ItemStatus, User } from "@/types";
import { ObjectId } from "mongodb";
import { GridFSBucket } from "mongodb";

// Initialize connection
let initialized = false;
export const initMongo = async () => {
  if (!initialized) {
    await connectToMongo();
    initialized = true;
  }
};

// User Services
export const createUser = async (userData: {
  email: string;
  password: string;
  name: string;
}): Promise<User> => {
  await initMongo();
  const db = getDb();
  
  // Check if user already exists
  const existingUser = await db
    .collection(collections.users)
    .findOne({ email: userData.email });
  
  if (existingUser) {
    throw new Error("Email already in use");
  }
  
  // In a real app, you would hash the password here
  // For demo purposes, we're storing it plaintext (NEVER do this in production)
  const result = await db.collection(collections.users).insertOne({
    email: userData.email,
    password: userData.password, // NEVER store passwords like this in production
    name: userData.name,
    createdAt: new Date(),
  });
  
  if (!result.insertedId) {
    throw new Error("Failed to create user");
  }
  
  return {
    id: result.insertedId.toString(),
    email: userData.email,
    name: userData.name,
  };
};

export const authenticateUser = async (
  email: string,
  password: string
): Promise<User> => {
  await initMongo();
  const db = getDb();
  
  const user = await db.collection(collections.users).findOne({
    email: email,
    password: password, // Again, in production, compare hashed passwords
  });
  
  if (!user) {
    throw new Error("Invalid email or password");
  }
  
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
};

// Item Services
export const createItem = async (
  itemData: ItemFormData,
  type: ItemType,
  userId: string,
  userName: string
): Promise<Item> => {
  await initMongo();
  const db = getDb();
  
  let imageUrl = "";
  
  // Handle image upload
  if (itemData.image) {
    imageUrl = await storeImage(itemData.image);
  }
  
  const collection = type === "lost" ? collections.lostItems : collections.foundItems;
  
  const newItem = {
    name: itemData.name,
    category: itemData.category,
    location: itemData.location,
    date: itemData.date,
    description: itemData.description,
    imageUrl,
    userId,
    userName,
    contactInfo: itemData.contactInfo,
    createdAt: new Date().toISOString(),
    type,
    status: "searching" as ItemStatus,
  };
  
  const result = await db.collection(collection).insertOne(newItem);
  
  if (!result.insertedId) {
    throw new Error("Failed to create item");
  }
  
  return {
    ...newItem,
    id: result.insertedId.toString(),
  };
};

// Image handling with GridFS
async function storeImage(file: File): Promise<string> {
  await initMongo();
  const db = getDb();
  const bucket = new GridFSBucket(db);
  
  // In a real scenario, you'd use a stream to upload the file
  // For demo, we're simplifying the approach
  // This is a placeholder - actual implementation would depend on your server-side code
  
  // Convert file to buffer (this is a simplified example)
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Upload to GridFS
  const uploadStream = bucket.openUploadStream(file.name, {
    metadata: { contentType: file.type }
  });
  
  return new Promise((resolve, reject) => {
    // This is simplified - in a real app, you'd use proper stream handling
    uploadStream.write(buffer);
    uploadStream.end(null, () => {
      // Return a URL that would serve this image
      resolve(`/api/images/${uploadStream.id}`);
    });
  });
}

// Fetch items
export const getLostItems = async (): Promise<Item[]> => {
  await initMongo();
  const db = getDb();
  
  const items = await db.collection(collections.lostItems).find().toArray();
  
  return items.map((item: any) => ({
    ...item,
    id: item._id.toString(),
  })) as Item[];
};

export const getFoundItems = async (): Promise<Item[]> => {
  await initMongo();
  const db = getDb();
  
  const items = await db.collection(collections.foundItems).find().toArray();
  
  return items.map((item: any) => ({
    ...item,
    id: item._id.toString(),
  })) as Item[];
};

export const getItemById = async (id: string): Promise<Item | undefined> => {
  await initMongo();
  const db = getDb();
  
  // Try to find in lost items
  let item = await db.collection(collections.lostItems).findOne({
    _id: new ObjectId(id),
  });
  
  // If not found, try found items
  if (!item) {
    item = await db.collection(collections.foundItems).findOne({
      _id: new ObjectId(id),
    });
  }
  
  if (!item) {
    return undefined;
  }
  
  return {
    ...item,
    id: item._id.toString(),
  } as Item;
};

// Delete an item
export const deleteItem = async (id: string, userId: string): Promise<boolean> => {
  await initMongo();
  const db = getDb();
  
  // Try to find and delete in lost items first
  let result = await db.collection(collections.lostItems).deleteOne({
    _id: new ObjectId(id),
    userId: userId, // Ensure the user owns this item
  });
  
  // If not found or not deleted (not authorized), try found items
  if (result.deletedCount === 0) {
    result = await db.collection(collections.foundItems).deleteOne({
      _id: new ObjectId(id),
      userId: userId, // Ensure the user owns this item
    });
  }
  
  // Return true if deleted, false otherwise
  return result.deletedCount > 0;
};

// Get user items
export const getUserItems = async (userId: string): Promise<Item[]> => {
  await initMongo();
  const db = getDb();
  
  // Get lost items for this user
  const lostItems = await db.collection(collections.lostItems)
    .find({ userId })
    .toArray();
    
  // Get found items for this user
  const foundItems = await db.collection(collections.foundItems)
    .find({ userId })
    .toArray();
    
  // Combine and format items
  const userItems = [
    ...lostItems.map((item: any) => ({ ...item, id: item._id.toString() })),
    ...foundItems.map((item: any) => ({ ...item, id: item._id.toString() }))
  ] as Item[];
  
  return userItems;
};

// Update item status
export const updateItemStatus = async (
  itemId: string,
  newStatus: ItemStatus
): Promise<Item | undefined> => {
  await initMongo();
  const db = getDb();
  
  // Try to update in lost items
  let result = await db.collection(collections.lostItems).findOneAndUpdate(
    { _id: new ObjectId(itemId) },
    { $set: { status: newStatus } },
    { returnDocument: "after" }
  );
  
  // If not found, try found items
  if (!result.value) {
    result = await db.collection(collections.foundItems).findOneAndUpdate(
      { _id: new ObjectId(itemId) },
      { $set: { status: newStatus } },
      { returnDocument: "after" }
    );
  }
  
  if (!result.value) {
    return undefined;
  }
  
  const updatedItem = result.value;
  
  return {
    ...updatedItem,
    id: updatedItem._id.toString(),
  };
};

// Find potential matches
export const findPotentialMatches = async (itemId: string) => {
  await initMongo();
  const db = getDb();
  
  // Get the item
  const sourceItem = await getItemById(itemId);
  
  if (!sourceItem) {
    return [];
  }
  
  // Determine which collection to search for matches
  const targetCollection = sourceItem.type === "lost" 
    ? collections.foundItems 
    : collections.lostItems;
  
  // Find potential matches based on category and keywords
  const potentialMatches = await db.collection(targetCollection)
    .find({
      category: sourceItem.category,
      status: "searching"
    })
    .toArray();
  
  // Calculate match score (simplified algorithm)
  const matches = potentialMatches.map(match => {
    // Simple matching algorithm based on text similarity
    let score = 0;
    
    // Same category is a good start
    if (match.category === sourceItem.category) score += 30;
    
    // Check name similarity
    const nameSimilarity = calculateTextSimilarity(
      sourceItem.name, 
      match.name
    );
    score += nameSimilarity * 25;
    
    // Check description similarity
    const descSimilarity = calculateTextSimilarity(
      sourceItem.description, 
      match.description
    );
    score += descSimilarity * 20;
    
    // Check location similarity
    const locationSimilarity = calculateTextSimilarity(
      sourceItem.location, 
      match.location
    );
    score += locationSimilarity * 25;
    
    // Return the match with its score
    return {
      item: {
        ...match,
        id: match._id.toString(),
      },
      score: Math.min(100, score), // Cap at 100%
    };
  });
  
  // Filter by minimum score and sort by highest score first
  return matches
    .filter(match => match.score > 30)
    .sort((a, b) => b.score - a.score);
};

// Simple text similarity function (Jaccard similarity coefficient)
function calculateTextSimilarity(text1: string, text2: string): number {
  const set1 = new Set(text1.toLowerCase().split(/\W+/).filter(Boolean));
  const set2 = new Set(text2.toLowerCase().split(/\W+/).filter(Boolean));
  
  const intersection = new Set(
    [...set1].filter(word => set2.has(word))
  );
  
  const union = new Set([...set1, ...set2]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}
