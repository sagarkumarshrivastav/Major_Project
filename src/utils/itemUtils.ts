
import { Item, ItemCategory, MatchedItem } from "@/types";

// Get category display name
export const getCategoryDisplay = (category: ItemCategory): string => {
  const categoryMap: Record<ItemCategory, string> = {
    electronics: "Electronics",
    books: "Books",
    clothing: "Clothing",
    accessories: "Accessories",
    keys: "Keys",
    documents: "Documents",
    other: "Other",
  };

  return categoryMap[category] || "Unknown";
};

// Format date for display
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Calculate match quality text
export const getMatchQuality = (score: number): string => {
  if (score >= 80) return "Excellent Match";
  if (score >= 60) return "Good Match";
  return "Possible Match";
};

// Helper to generate placeholder content for images
export const getItemImagePlaceholder = (item: Item): string => {
  return `${item.name} ${getCategoryDisplay(item.category)}`;
};

// Find potential matches from items array (would be replaced by proper algorithm)
export const findPotentialMatches = (
  targetItem: Item,
  itemsToMatch: Item[]
): MatchedItem[] => {
  // Filter items of opposite type and calculate scores
  return itemsToMatch
    .filter((item) => item.type !== targetItem.type && item.status === "searching")
    .map((item) => {
      let score = 0;

      // Category match
      if (item.category === targetItem.category) score += 40;

      // Location match
      if (item.location.toLowerCase() === targetItem.location.toLowerCase()) score += 30;

      // Date proximity
      const date1 = new Date(item.date);
      const date2 = new Date(targetItem.date);
      const daysDiff = Math.abs((date1.getTime() - date2.getTime()) / (1000 * 3600 * 24));
      if (daysDiff <= 2) score += 20;
      else if (daysDiff <= 7) score += 10;

      // Name similarity
      if (
        item.name.toLowerCase().includes(targetItem.name.toLowerCase()) ||
        targetItem.name.toLowerCase().includes(item.name.toLowerCase())
      ) {
        score += 10;
      }

      const matchedItem: MatchedItem = {
        lostItem: targetItem.type === "lost" ? targetItem : item,
        foundItem: targetItem.type === "found" ? targetItem : item, 
        score
      };

      return matchedItem;
    })
    .filter((match) => match.score >= 40) // Minimum score threshold
    .sort((a, b) => b.score - a.score); // Sort by score descending
};
