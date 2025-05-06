
import { MongoClient, ObjectId, GridFSBucket } from "mongodb";
import { connectToMongo, getDb, collections } from "@/config/mongodb";
import { Item, ItemFormData, ItemStatus, ItemType } from "@/types";

// Initialize MongoDB connection
let isInitialized = false;

export const initMongo = async () => {
  if (!isInitialized) {
    await connectToMongo();
    isInitialized = true;
  }
};

// Item operations
export const createItem = async (
  itemData: ItemFormData,
  type: ItemType,
  userId: string,
  userName: string
): Promise<Item> => {
  await initMongo();
  const db = getDb();

  const now = new Date().toISOString();
  
  const newItem = {
    name: itemData.name,
    category: itemData.category,
    location: itemData.location,
    date: itemData.date,
    description: itemData.description,
    imageUrl: itemData.image ? await uploadImage(itemData.image) : '/placeholder.svg',
    userId,
    userName,
    contactInfo: itemData.contactInfo,
    createdAt: now,
    type,
    status: "searching" as ItemStatus
  };

  const collection = type === "lost" 
    ? collections.lostItems 
    : collections.foundItems;

  const result = await db.collection(collection).insertOne(newItem);
  
  return {
    ...newItem,
    id: result.insertedId.toString()
  } as Item;
};

export const getLostItems = async (): Promise<Item[]> => {
  await initMongo();
  const db = getDb();
  
  const items = await db.collection(collections.lostItems).find().toArray();
  
  return items.map((item) => ({
    ...item,
    id: item._id.toString()
  })) as Item[];
};

export const getFoundItems = async (): Promise<Item[]> => {
  await initMongo();
  const db = getDb();
  
  const items = await db.collection(collections.foundItems).find().toArray();
  
  return items.map((item) => ({
    ...item,
    id: item._id.toString()
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

export const getUserItems = async (userId: string): Promise<Item[]> => {
  await initMongo();
  const db = getDb();
  
  const lostItems = await db.collection(collections.lostItems)
    .find({ userId })
    .toArray();
    
  const foundItems = await db.collection(collections.foundItems)
    .find({ userId })
    .toArray();
  
  const allItems = [...lostItems, ...foundItems];
  
  return allItems.map(item => ({
    ...item,
    id: item._id.toString()
  })) as Item[];
};

export const updateItemStatus = async (
  itemId: string,
  status: ItemStatus
): Promise<Item | null> => {
  await initMongo();
  const db = getDb();
  
  // Try to update in lost items first
  let result = await db.collection(collections.lostItems).findOneAndUpdate(
    { _id: new ObjectId(itemId) },
    { $set: { status } },
    { returnDocument: "after" }
  );
  
  let item = result.value;
  
  // If not found in lost items, try found items
  if (!item) {
    result = await db.collection(collections.foundItems).findOneAndUpdate(
      { _id: new ObjectId(itemId) },
      { $set: { status } },
      { returnDocument: "after" }
    );
    
    item = result.value;
  }
  
  if (!item) {
    return null;
  }
  
  return {
    ...item,
    id: item._id.toString()
  } as Item;
};

export const deleteItem = async (itemId: string, userId: string): Promise<boolean> => {
  await initMongo();
  const db = getDb();
  
  // Try to delete from lost items
  let result = await db.collection(collections.lostItems).deleteOne({
    _id: new ObjectId(itemId),
    userId: userId // Ensure user is the owner
  });
  
  // If not deleted from lost items, try found items
  if (result.deletedCount === 0) {
    result = await db.collection(collections.foundItems).deleteOne({
      _id: new ObjectId(itemId),
      userId: userId
    });
  }
  
  return result.deletedCount > 0;
};

export const findPotentialMatches = async (itemId: string): Promise<Item[]> => {
  await initMongo();
  const db = getDb();
  
  // First, find the item
  const item = await getItemById(itemId);
  
  if (!item) {
    return [];
  }
  
  // Look for potential matches in the opposite collection
  const oppositeCollection = item.type === "lost" 
    ? collections.foundItems 
    : collections.lostItems;
  
  // Find items with similar category, name, or description
  const matches = await db.collection(oppositeCollection)
    .find({
      $or: [
        { category: item.category },
        { 
          name: { 
            $regex: new RegExp(item.name.split(' ')[0], 'i') 
          } 
        },
        {
          description: {
            $regex: new RegExp(item.name.split(' ')[0], 'i')
          }
        }
      ]
    })
    .toArray();
  
  return matches.map(match => ({
    ...match,
    id: match._id.toString()
  })) as Item[];
};

// Helper function to upload images
const uploadImage = async (file: File): Promise<string> => {
  // In a real implementation, this would upload to MongoDB GridFS
  // For now, we'll just return a placeholder
  // This would need to be implemented with proper file handling
  return '/placeholder.svg';
};
