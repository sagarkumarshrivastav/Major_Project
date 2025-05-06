
export interface User {
  id: string;
  email: string;
  name: string;
}

export type ItemCategory = 
  | 'electronics' 
  | 'books' 
  | 'clothing' 
  | 'accessories' 
  | 'keys' 
  | 'documents' 
  | 'other';

export type ItemStatus = 
  | 'searching' 
  | 'matched' 
  | 'claimed' 
  | 'resolved';

export type ItemType = 'lost' | 'found';

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  location: string;
  date: string; // ISO string
  description: string;
  imageUrl: string;
  userId: string;
  userName: string;
  contactInfo: string;
  createdAt: string; // ISO string
  type: ItemType;
  status: ItemStatus;
}

export interface ItemFormData {
  name: string;
  category: ItemCategory;
  location: string;
  date: string;
  description: string;
  image: File | null;
  contactInfo: string;
}

export interface MatchedItem {
  lostItem: Item;
  foundItem: Item;
  score: number;
}
