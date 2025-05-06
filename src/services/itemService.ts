
import { Item, ItemFormData, ItemType, ItemStatus } from "@/types";
import { mockItems, mockLostItems, mockFoundItems, findPotentialMatches as mockFindMatches } from "@/utils/mockData";

// Get all items
export const getAllItems = async (): Promise<Item[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockItems]);
    }, 500);
  });
};

// Get all lost items
export const getLostItems = async (): Promise<Item[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockLostItems]);
    }, 500);
  });
};

// Get all found items
export const getFoundItems = async (): Promise<Item[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockFoundItems]);
    }, 500);
  });
};

// Get item by ID
export const getItemById = async (id: string): Promise<Item | undefined> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = mockItems.find((item) => item.id === id);
      resolve(item);
    }, 300);
  });
};

// Create new item
export const createItem = async (
  itemData: ItemFormData,
  type: ItemType,
  userId: string,
  userName: string
): Promise<Item> => {
  // In a real app, we would upload the image to Firebase Storage
  // and get back a URL
  let imageUrl = "https://via.placeholder.com/300";
  
  // If there's an image provided, use a mock URL
  if (itemData.image) {
    const mockImageUrls = [
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a",
    ];
    imageUrl = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
  }

  // Create new item
  const newItem: Item = {
    id: Math.random().toString(36).substring(2, 15),
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
    status: "searching",
  };

  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, we would save to Firebase
      mockItems.unshift(newItem);
      if (type === "lost") {
        mockLostItems.unshift(newItem);
      } else {
        mockFoundItems.unshift(newItem);
      }
      resolve(newItem);
    }, 800);
  });
};

// Update item
export const updateItemStatus = async (
  itemId: string,
  newStatus: ItemStatus
): Promise<Item | undefined> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const itemIndex = mockItems.findIndex((item) => item.id === itemId);
      if (itemIndex >= 0) {
        mockItems[itemIndex] = {
          ...mockItems[itemIndex],
          status: newStatus,
        };
        resolve(mockItems[itemIndex]);
      } else {
        resolve(undefined);
      }
    }, 500);
  });
};

// Get user items
export const getUserItems = async (userId: string): Promise<Item[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const userItems = mockItems.filter((item) => item.userId === userId);
      resolve(userItems);
    }, 500);
  });
};

// Find potential matches for an item
export const findPotentialMatches = async (itemId: string) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const matches = mockFindMatches(itemId);
      resolve(matches);
    }, 800);
  });
};

// Request to claim an item
export const requestClaim = async (
  itemId: string,
  userId: string
): Promise<boolean> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, we would update the item status in Firebase
      const item = mockItems.find((item) => item.id === itemId);
      if (item) {
        item.status = "claimed";
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};
