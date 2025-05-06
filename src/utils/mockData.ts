
import { Item, ItemCategory, ItemStatus, ItemType } from "@/types";

// Helper to generate random IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock image URLs
const mockImages = [
  "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  "https://images.unsplash.com/photo-1579586337278-3befd40fd17a",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a",
];

// Create mock lost items
const createMockLostItem = (index: number): Item => {
  const categories: ItemCategory[] = ['electronics', 'books', 'clothing', 'accessories', 'keys', 'documents', 'other'];
  const locations = [
    "Library", "Student Union", "Science Building", "Cafeteria", 
    "Gymnasium", "Dormitory", "Engineering Building", "Arts Center", "Quad"
  ];
  
  const imageIndex = index % mockImages.length;
  const categoryIndex = index % categories.length;
  const locationIndex = index % locations.length;
  
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 14)); // Random date in the last 14 days
  
  return {
    id: generateId(),
    name: `Lost Item ${index + 1}`,
    category: categories[categoryIndex],
    location: locations[locationIndex],
    date: date.toISOString(),
    description: `This is a description for lost item ${index + 1}. Please help me find it.`,
    imageUrl: mockImages[imageIndex],
    userId: "user1",
    userName: "Demo User",
    contactInfo: "user@example.com",
    createdAt: new Date().toISOString(),
    type: "lost" as ItemType,
    status: "searching" as ItemStatus,
  };
};

// Create mock found items
const createMockFoundItem = (index: number): Item => {
  const categories: ItemCategory[] = ['electronics', 'books', 'clothing', 'accessories', 'keys', 'documents', 'other'];
  const locations = [
    "Library", "Student Union", "Science Building", "Cafeteria", 
    "Gymnasium", "Dormitory", "Engineering Building", "Arts Center", "Quad"
  ];
  
  const imageIndex = index % mockImages.length;
  const categoryIndex = index % categories.length;
  const locationIndex = index % locations.length;
  
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 14)); // Random date in the last 14 days
  
  return {
    id: generateId(),
    name: `Found Item ${index + 1}`,
    category: categories[categoryIndex],
    location: locations[locationIndex],
    date: date.toISOString(),
    description: `I found this item at the ${locations[locationIndex]}. Contact me to claim it.`,
    imageUrl: mockImages[imageIndex],
    userId: "user1",
    userName: "Demo User",
    contactInfo: "user@example.com",
    createdAt: new Date().toISOString(),
    type: "found" as ItemType,
    status: "searching" as ItemStatus,
  };
};

// Generate items
export const mockLostItems: Item[] = Array.from({ length: 15 }, (_, i) => createMockLostItem(i));
export const mockFoundItems: Item[] = Array.from({ length: 15 }, (_, i) => createMockFoundItem(i));

// All items combined
export const mockItems = [...mockLostItems, ...mockFoundItems];

// Mock matching algorithm
export const findPotentialMatches = (itemId: string) => {
  const targetItem = mockItems.find(item => item.id === itemId);
  if (!targetItem) return [];
  
  // If the item is lost, look for found items
  // If the item is found, look for lost items
  const potentialMatches = mockItems.filter(item => 
    item.type !== targetItem.type &&
    item.category === targetItem.category &&
    item.status === "searching"
  );
  
  // Calculate a match score based on similarity of location, name and date proximity
  return potentialMatches.map(match => {
    let score = 0;
    
    // Category match is already filtered
    score += 40;
    
    // Location match
    if (match.location === targetItem.location) {
      score += 30;
    }
    
    // Date proximity (within 2 days = high match)
    const date1 = new Date(match.date);
    const date2 = new Date(targetItem.date);
    const daysDiff = Math.abs((date1.getTime() - date2.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff <= 2) {
      score += 20;
    } else if (daysDiff <= 7) {
      score += 10;
    }
    
    // Name similarity
    if (match.name.toLowerCase().includes(targetItem.name.toLowerCase()) || 
        targetItem.name.toLowerCase().includes(match.name.toLowerCase())) {
      score += 10;
    }
    
    return {
      item: match,
      score
    };
  })
  .filter(match => match.score >= 40) // Only return items with a score of at least 40
  .sort((a, b) => b.score - a.score); // Sort by score descending
};
