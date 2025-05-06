
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import { getUserItems } from "@/services/itemService";
import { Item } from "@/types";
import { formatDate, getCategoryDisplay } from "@/utils/itemUtils";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!currentUser) return;

      try {
        const items = await getUserItems(currentUser.id);
        setUserItems(items);
      } catch (error) {
        console.error("Error fetching user items:", error);
        toast.error("Failed to load your items");
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, [currentUser]);

  const lostItems = userItems.filter((item) => item.type === "lost");
  const foundItems = userItems.filter((item) => item.type === "found");

  const renderItemsList = (items: Item[]) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-slate-500">No items to display</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-[150px] h-[150px] flex-shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-grow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline">
                        {getCategoryDisplay(item.category)}
                      </Badge>
                      <Badge
                        className={
                          item.status === "searching"
                            ? "bg-slate-500"
                            : item.status === "matched"
                            ? "bg-campus-amber"
                            : "bg-campus-success"
                        }
                      >
                        {item.status === "searching"
                          ? "Still Searching"
                          : item.status === "matched"
                          ? "Potential Match"
                          : "Claimed"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-500">
                    {formatDate(item.createdAt)}
                  </div>
                </div>
                
                <div className="mt-2 text-sm">
                  <span className="text-slate-600 dark:text-slate-300">
                    Location: {item.location} • Date: {formatDate(item.date)}
                  </span>
                </div>
                
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/item/${item.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <AuthGuard>
      <Layout>
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Welcome back, {currentUser?.name}! Manage your lost and found items.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Lost Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{lostItems.length}</div>
                    <p className="text-sm text-slate-500">Items you've reported as lost</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="ghost" size="sm" className="w-full">
                      <Link to="/report-lost">Report New Lost Item</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Found Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{foundItems.length}</div>
                    <p className="text-sm text-slate-500">Items you've reported as found</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="ghost" size="sm" className="w-full">
                      <Link to="/report-found">Report New Found Item</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-2xl font-bold mb-6">Your Items</h2>
          
          <Tabs defaultValue="lost">
            <TabsList className="mb-6">
              <TabsTrigger value="lost">Lost Items</TabsTrigger>
              <TabsTrigger value="found">Found Items</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lost">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-[150px] bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                renderItemsList(lostItems)
              )}
              
              {!loading && lostItems.length === 0 && (
                <div className="text-center my-12">
                  <h3 className="text-lg font-medium mb-2">No lost items reported yet</h3>
                  <p className="text-slate-500 mb-6">
                    Lost something? Report it and let others help you find it!
                  </p>
                  <Button asChild className="bg-campus-blue hover:bg-blue-600">
                    <Link to="/report-lost">Report a Lost Item</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="found">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-[150px] bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                renderItemsList(foundItems)
              )}
              
              {!loading && foundItems.length === 0 && (
                <div className="text-center my-12">
                  <h3 className="text-lg font-medium mb-2">No found items reported yet</h3>
                  <p className="text-slate-500 mb-6">
                    Found something? Report it and help someone find their lost item!
                  </p>
                  <Button asChild className="bg-campus-blue hover:bg-blue-600">
                    <Link to="/report-found">Report a Found Item</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </AuthGuard>
  );
};

export default Dashboard;
