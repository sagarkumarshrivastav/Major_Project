
import { Item, ItemFormData, ItemStatus, ItemType } from "@/types";

// For development, we'll use localStorage
// In production, this would be replaced with actual MongoDB calls via an API

// Helper to generate IDs
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Initialize storage
const initStorage = () => {
  if (!localStorage.getItem('lostItems')) {
    localStorage.setItem('lostItems', JSON.stringify([]));
  }
  if (!localStorage.getItem('foundItems')) {
    localStorage.setItem('foundItems', JSON.stringify([]));
  }
};

// Item operations
export const createItem = async (
  itemData: ItemFormData,
  type: ItemType,
  userId: string,
  userName: string
): Promise<Item> => {
  initStorage();
  
  const now = new Date().toISOString();
  const id = generateId();
  
  const newItem: Item = {
    id,
    name: itemData.name,
    category: itemData.category,
    location: itemData.location,
    date: itemData.date,
    description: itemData.description,
    imageUrl: itemData.image ? URL.createObjectURL(itemData.image) : '/placeholder.svg',
    userId,
    userName,
    contactInfo: itemData.contactInfo,
    createdAt: now,
    type,
    status: "searching"
  };

  const collection = type === "lost" ? 'lostItems' : 'foundItems';
  const items = JSON.parse(localStorage.getItem(collection) || '[]');
  items.push(newItem);
  localStorage.setItem(collection, JSON.stringify(items));
  
  return newItem;
};

export const getLostItems = async (): Promise<Item[]> => {
  initStorage();
  return JSON.parse(localStorage.getItem('lostItems') || '[]');
};

export const getFoundItems = async (): Promise<Item[]> => {
  initStorage();
  return JSON.parse(localStorage.getItem('foundItems') || '[]');
};

export const getItemById = async (id: string): Promise<Item | undefined> => {
  initStorage();
  
  // Try to find in lost items
  let lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
  let item = lostItems.find((item: Item) => item.id === id);
  
  // If not found, try found items
  if (!item) {
    let foundItems = JSON.parse(localStorage.getItem('foundItems') || '[]');
    item = foundItems.find((item: Item) => item.id === id);
  }
  
  return item;
};

export const getUserItems = async (userId: string): Promise<Item[]> => {
  initStorage();
  
  const lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
  const foundItems = JSON.parse(localStorage.getItem('foundItems') || '[]');
  
  const userLostItems = lostItems.filter((item: Item) => item.userId === userId);
  const userFoundItems = foundItems.filter((item: Item) => item.userId === userId);
  
  return [...userLostItems, ...userFoundItems];
};

export const updateItemStatus = async (
  itemId: string,
  status: ItemStatus
): Promise<Item | null> => {
  initStorage();
  
  // Try to update in lost items
  let lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
  let itemIndex = lostItems.findIndex((item: Item) => item.id === itemId);
  
  if (itemIndex !== -1) {
    lostItems[itemIndex].status = status;
    localStorage.setItem('lostItems', JSON.stringify(lostItems));
    return lostItems[itemIndex];
  }
  
  // If not found, try found items
  let foundItems = JSON.parse(localStorage.getItem('foundItems') || '[]');
  itemIndex = foundItems.findIndex((item: Item) => item.id === itemId);
  
  if (itemIndex !== -1) {
    foundItems[itemIndex].status = status;
    localStorage.setItem('foundItems', JSON.stringify(foundItems));
    return foundItems[itemIndex];
  }
  
  return null;
};

export const deleteItem = async (itemId: string, userId: string): Promise<boolean> => {
  initStorage();
  
  // Try to delete from lost items
  let lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
  let initialLength = lostItems.length;
  lostItems = lostItems.filter((item: Item) => !(item.id === itemId && item.userId === userId));
  
  if (lostItems.length < initialLength) {
    localStorage.setItem('lostItems', JSON.stringify(lostItems));
    return true;
  }
  
  // If not deleted from lost items, try found items
  let foundItems = JSON.parse(localStorage.getItem('foundItems') || '[]');
  initialLength = foundItems.length;
  foundItems = foundItems.filter((item: Item) => !(item.id === itemId && item.userId === userId));
  
  if (foundItems.length < initialLength) {
    localStorage.setItem('foundItems', JSON.stringify(foundItems));
    return true;
  }
  
  return false;
};

export const findPotentialMatches = async (itemId: string): Promise<Item[]> => {
  const item = await getItemById(itemId);
  
  if (!item) {
    return [];
  }
  
  // Look for potential matches in the opposite collection
  const oppositeCollection = item.type === "lost" ? 'foundItems' : 'lostItems';
  const items = JSON.parse(localStorage.getItem(oppositeCollection) || '[]');
  
  // Find items with similar category, name, or description
  return items.filter((potentialMatch: Item) => {
    // Check if category matches
    if (potentialMatch.category === item.category) {
      return true;
    }
    
    // Check if name contains similar words
    const itemWords = item.name.toLowerCase().split(' ');
    const matchWords = potentialMatch.name.toLowerCase().split(' ');
    
    for (const word of itemWords) {
      if (word.length > 2 && matchWords.some(matchWord => matchWord.includes(word))) {
        return true;
      }
    }
    
    // Check if description contains similar words
    if (item.description && potentialMatch.description) {
      return itemWords.some(word => 
        word.length > 2 && potentialMatch.description.toLowerCase().includes(word)
      );
    }
    
    return false;
  });
};
