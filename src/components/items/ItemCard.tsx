
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Item } from "@/types";
import { formatDate, getCategoryDisplay } from "@/utils/itemUtils";
import { MapPin, Clock } from "lucide-react";

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  return (
    <Link to={`/item/${item.id}`} className="block h-full">
      <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
          <Badge
            className={`absolute top-2 right-2 ${
              item.type === "lost" ? "bg-campus-amber" : "bg-campus-blue"
            }`}
          >
            {item.type === "lost" ? "Lost" : "Found"}
          </Badge>
          
          {item.status !== "searching" && (
            <Badge className="absolute top-2 left-2 bg-campus-success">
              {item.status === "claimed" ? "Claimed" : "Matched"}
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
          
          <div className="flex items-center mt-2 text-sm text-slate-600 dark:text-slate-300">
            <Badge variant="outline" className="mr-2">
              {getCategoryDisplay(item.category)}
            </Badge>
          </div>
          
          <div className="mt-3 space-y-1 text-sm">
            <div className="flex items-center text-slate-600 dark:text-slate-300">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="truncate">{item.location}</span>
            </div>
            
            <div className="flex items-center text-slate-600 dark:text-slate-300">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatDate(item.date)}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-4 py-3 border-t text-xs text-slate-500">
          Posted by {item.userName} • {formatDate(item.createdAt)}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ItemCard;
