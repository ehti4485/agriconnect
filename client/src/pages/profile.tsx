import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/auth";
import { useLocation } from "wouter";
import { User, Phone, MapPin, Mail, Plus, LogOut, Package } from "lucide-react";
import { type Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: authApi.getCurrentUser,
    retry: false,
  });

  const { data: myProducts, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/my-products"],
    enabled: !!user,
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect if not logged in
  if (!userLoading && !user) {
    setLocation("/register");
    return null;
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌱</div>
          <p className="text-lg agro-gray">Loading...</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string) => {
    return `₨ ${parseFloat(price).toLocaleString()}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "grains": return "🌾";
      case "vegetables": return "🥕";
      case "fruits": return "🍎";
      case "livestock": return "🐄";
      default: return "🌱";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto bg-agro-green rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <CardTitle>{user?.firstName} {user?.lastName}</CardTitle>
                <CardDescription>
                  <Badge variant={user?.role === "farmer" ? "default" : "secondary"} className="capitalize">
                    {user?.role}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <User className="w-4 h-4 agro-gray" />
                  <span className="agro-gray">@{user?.username}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 agro-gray" />
                  <span className="agro-gray">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4 agro-gray" />
                  <span className="agro-gray">{user?.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="w-4 h-4 agro-gray" />
                  <span className="agro-gray">{user?.location}</span>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button
                    onClick={() => setLocation("/add-product")}
                    className="w-full bg-agro-green hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Products */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>My Products</span>
                </CardTitle>
                <CardDescription>
                  Products you have listed for sale
                </CardDescription>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex space-x-4 p-4 border rounded-lg">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : myProducts && myProducts.length > 0 ? (
                  <div className="space-y-4">
                    {myProducts.map((product) => (
                      <div key={product.id} className="flex space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center text-2xl">
                          {getCategoryIcon(product.category)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold agro-dark">{product.title}</h3>
                          <p className="text-sm agro-gray line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold agro-green">
                              {product.category === "livestock" ? formatPrice(product.price) : `${formatPrice(product.price)}/kg`}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {product.quantity} available
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1 text-xs agro-gray">
                            <MapPin className="w-3 h-3 mr-1" />
                            {product.location}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-lg font-semibold agro-dark mb-2">No products yet</h3>
                    <p className="agro-gray mb-4">Start by adding your first product to the marketplace</p>
                    <Button
                      onClick={() => setLocation("/add-product")}
                      className="bg-agro-green hover:bg-green-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
