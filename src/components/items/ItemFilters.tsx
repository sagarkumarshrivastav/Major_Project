
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ItemCategory } from "@/types";
import { getCategoryDisplay } from "@/utils/itemUtils";
import { Search } from "lucide-react";

interface ItemFiltersProps {
  onFilterChange: (filters: {
    search: string;
    category: string;
    location: string;
    sortBy: string;
  }) => void;
}

const ItemFilters = ({ onFilterChange }: ItemFiltersProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const handleFilterChange = () => {
    onFilterChange({
      search,
      category,
      location,
      sortBy,
    });
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setSortBy("newest");
    onFilterChange({
      search: "",
      category: "",
      location: "",
      sortBy: "newest",
    });
  };

  const categories: ItemCategory[] = [
    "electronics",
    "books",
    "clothing",
    "accessories",
    "keys",
    "documents",
    "other",
  ];
  
  const locations = [
    "Library",
    "Student Union",
    "Science Building",
    "Cafeteria",
    "Gymnasium",
    "Dormitory",
    "Engineering Building",
    "Arts Center",
    "Quad",
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
        
        <Select
          value={category}
          onValueChange={setCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {getCategoryDisplay(cat)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={location}
          onValueChange={setLocation}
        >
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-locations">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={sortBy}
          onValueChange={setSortBy}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end mt-4 space-x-2">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleFilterChange} className="bg-campus-blue hover:bg-blue-600">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default ItemFilters;
