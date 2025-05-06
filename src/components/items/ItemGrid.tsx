
import { Item } from "@/types";
import ItemCard from "./ItemCard";

interface ItemGridProps {
  items: Item[];
  loading?: boolean;
  emptyMessage?: string;
}

const ItemGrid = ({ items, loading, emptyMessage = "No items found" }: ItemGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-lg h-[300px] animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ItemGrid;
