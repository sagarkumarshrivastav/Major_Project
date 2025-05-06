
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ItemGrid from "@/components/items/ItemGrid";
import ItemFilters from "@/components/items/ItemFilters";
import { Button } from "@/components/ui/button";
import { getLostItems } from "@/services/itemService";
import { Item } from "@/types";

const LostItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const lostItems = await getLostItems();
        setItems(lostItems);
        setFilteredItems(lostItems);
      } catch (error) {
        console.error("Error fetching lost items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleFilterChange = (filters: {
    search: string;
    category: string;
    location: string;
    sortBy: string;
  }) => {
    let filtered = [...items];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== "all-categories") {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    // Apply location filter
    if (filters.location && filters.location !== "all-locations") {
      filtered = filtered.filter(
        (item) => item.location.toLowerCase() === filters.location.toLowerCase()
      );
    }

    // Apply sorting
    if (filters.sortBy === "newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filters.sortBy === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    setFilteredItems(filtered);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Lost Items</h1>
        <Button asChild className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700">
          <Link to="/report-lost">Report a Lost Item</Link>
        </Button>
      </div>

      <ItemFilters onFilterChange={handleFilterChange} />

      <ItemGrid
        items={filteredItems}
        loading={loading}
        emptyMessage="No lost items found. Be the first to report a lost item!"
      />
    </Layout>
  );
};

export default LostItems;
