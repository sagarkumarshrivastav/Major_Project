
// This file would be for API calls if we had a real API
// For now, it's a wrapper around our MongoDB service
import { Item, ItemFormData } from "@/types";
import { 
  createItem as createItemInDb, 
  getLostItems as fetchLostItems,
  getFoundItems as fetchFoundItems,
  getItemById as fetchItemById,
  updateItemStatus,
  findPotentialMatches as findMatches,
  getUserItems as fetchUserItems,
  deleteItem as removeItem
} from "@/services/mongoService";

// Report a lost item
export const reportLostItem = async (
  itemData: ItemFormData,
  userId: string,
  userName: string
): Promise<Item> => {
  return createItemInDb(itemData, "lost", userId, userName);
};

// Report a found item
export const reportFoundItem = async (
  itemData: ItemFormData,
  userId: string,
  userName: string
): Promise<Item> => {
  return createItemInDb(itemData, "found", userId, userName);
};

// Create item - exported for direct usage
export const createItem = async (
  itemData: ItemFormData,
  type: "lost" | "found",
  userId: string,
  userName: string
): Promise<Item> => {
  return type === "lost" 
    ? reportLostItem(itemData, userId, userName) 
    : reportFoundItem(itemData, userId, userName);
};

// Get all lost items
export const getLostItems = async (): Promise<Item[]> => {
  return fetchLostItems();
};

// Get all found items
export const getFoundItems = async (): Promise<Item[]> => {
  return fetchFoundItems();
};

// Get user items
export const getUserItems = async (userId: string): Promise<Item[]> => {
  return fetchUserItems(userId);
};

// Get a single item by ID
export const getItemById = async (id: string): Promise<Item> => {
  const item = await fetchItemById(id);
  if (!item) {
    throw new Error("Item not found");
  }
  return item;
};

// Request to claim an item
export const requestClaim = async (itemId: string, userId: string): Promise<void> => {
  const item = await updateItemStatus(itemId, "claimed");
  if (!item) {
    throw new Error("Failed to update item status");
  }
};

// Find potential matches for an item
export const findPotentialMatches = async (itemId: string) => {
  return findMatches(itemId);
};

// Delete an item
export const deleteItem = async (itemId: string, userId: string): Promise<boolean> => {
  return removeItem(itemId, userId);
};
