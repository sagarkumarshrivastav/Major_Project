
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Item } from "@/types";
import { formatDate, getCategoryDisplay, getMatchQuality } from "@/utils/itemUtils";
import { getItemById, findPotentialMatches, requestClaim } from "@/services/itemService";
import { MapPin, Clock, User, ArrowLeft, Phone } from "lucide-react";

interface Match {
  item: Item;
  score: number;
}

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (!id) return;
        
        const fetchedItem = await getItemById(id);
        if (fetchedItem) {
          setItem(fetchedItem);
          
          // Find potential matches
          const potentialMatches = await findPotentialMatches(id);
          // Convert Items to Match format
          const formattedMatches: Match[] = potentialMatches.map(matchItem => ({
            item: matchItem,
            score: calculateMatchScore(fetchedItem, matchItem)
          }));
          setMatches(formattedMatches);
        }
      } catch (error) {
        console.error("Error fetching item:", error);
        toast.error("Failed to load item details");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // Simple function to calculate match score
  const calculateMatchScore = (item1: Item, item2: Item): number => {
    let score = 0;
    
    // Category match gives 50 points
    if (item1.category === item2.category) {
      score += 50;
    }
    
    // Name similarity (simple check for shared words)
    const words1 = item1.name.toLowerCase().split(/\s+/);
    const words2 = item2.name.toLowerCase().split(/\s+/);
    
    for (const word of words1) {
      if (word.length > 2 && words2.includes(word)) {
        score += 10;
      }
    }
    
    // Location similarity
    if (item1.location.toLowerCase() === item2.location.toLowerCase()) {
      score += 30;
    }
    
    return Math.min(100, score);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col space-y-4 animate-pulse">
          <div className="h-8 w-1/3 bg-slate-200 rounded"></div>
          <div className="h-64 w-full bg-slate-200 rounded"></div>
          <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
          <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
        </div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  const isOwner = currentUser && currentUser.id === item.userId;
  const canClaim = currentUser && !isOwner && item.status === "searching";

  return (
    <Layout>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <div className="relative">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-auto rounded-lg shadow-md object-cover max-h-[500px]"
            />
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <Badge
                className={`${
                  item.type === "lost" ? "bg-campus-amber" : "bg-campus-blue"
                } text-white px-3 py-1 text-sm`}
              >
                {item.type === "lost" ? "Lost" : "Found"}
              </Badge>
              
              {item.status !== "searching" && (
                <Badge className="bg-campus-success px-3 py-1 text-sm">
                  {item.status === "claimed" ? "Claimed" : "Matched"}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
            <Badge variant="outline" className="mb-4">
              {getCategoryDisplay(item.category)}
            </Badge>
            
            <div className="flex flex-col space-y-3 mb-6">
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{item.location}</span>
              </div>
              
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                <Clock className="h-4 w-4 mr-2" />
                <span>{formatDate(item.date)}</span>
              </div>
              
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                <User className="h-4 w-4 mr-2" />
                <span>Posted by {item.userName}</span>
              </div>
              
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 mr-2" />
                <span>Contact: {item.contactInfo}</span>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">
                {item.description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              
              {isOwner ? (
                <div>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    This is your item. You can update its status or delete it.
                  </p>
                  
                  {/* Status controls would go here in a real app */}
                </div>
              ) : item.status === "claimed" ? (
                <p className="text-slate-600 dark:text-slate-300">
                  This item has already been claimed.
                </p>
              ) : (
                <>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Contact the {item.type === "lost" ? "owner" : "finder"} of this item:
                  </p>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md">
                    <p className="font-medium">{item.userName}</p>
                    <p className="text-slate-600 dark:text-slate-300">
                      {item.contactInfo}
                    </p>
                  </div>
                  
                  {canClaim && (
                    <Button
                      className="w-full mt-6 bg-campus-blue hover:bg-blue-600"
                      onClick={handleClaim}
                      disabled={claiming}
                    >
                      {claiming ? "Submitting..." : "Request to Claim"}
                    </Button>
                  )}
                  
                  {!currentUser && (
                    <p className="text-sm text-slate-500 mt-4 text-center">
                      You need to{" "}
                      <a href="/login" className="text-campus-blue hover:underline">
                        log in
                      </a>{" "}
                      to claim this item.
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
          
          {matches.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">
                Potential {item.type === "lost" ? "Matches" : "Owners"}
              </h2>
              
              <div className="space-y-4">
                {matches.map((match) => (
                  <Card key={match.item.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="w-[100px] h-[100px] flex-shrink-0">
                        <img
                          src={match.item.imageUrl}
                          alt={match.item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <CardContent className="py-3 flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium line-clamp-1">{match.item.name}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {match.item.location}
                            </p>
                          </div>
                          
                          <Badge variant="outline" className="ml-2">
                            {getMatchQuality(match.score)}
                          </Badge>
                        </div>
                        
                        <Button
                          variant="link"
                          className="mt-2 h-auto p-0 text-campus-blue"
                          asChild
                        >
                          <a href={`/item/${match.item.id}`}>View details</a>
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
