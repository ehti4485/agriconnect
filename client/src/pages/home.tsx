import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Mic, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { SearchFilters } from "@/components/search-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { type ProductWithSeller } from "@shared/schema";
import { authApi } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: authApi.getCurrentUser,
    retry: false,
  });

  const { data: products, isLoading } = useQuery<ProductWithSeller[]>({
    queryKey: ["/api/products", { category: category === "all" ? undefined : category, search: search || undefined }],
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Connect Farmers & Traders
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Buy and sell agricultural products directly
            </p>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              {user ? (
                <Link href="/add-product">
                  <Button className="w-full sm:w-auto bg-white text-green-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl text-lg transition-colors flex items-center justify-center space-x-2 min-h-[60px]">
                    <Plus className="w-5 h-5" />
                    <span>List Product</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button className="w-full sm:w-auto bg-white text-green-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl text-lg transition-colors flex items-center justify-center space-x-2 min-h-[60px]">
                    <Plus className="w-5 h-5" />
                    <span>Join Now</span>
                  </Button>
                </Link>
              )}
              <Button 
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-colors flex items-center justify-center space-x-2 min-h-[60px]"
                onClick={() => {
                  const productsSection = document.getElementById("products");
                  productsSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Search className="w-5 h-5" />
                <span>Browse Products</span>
              </Button>
            </div>

            {/* Voice Guide Prompt */}
            <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
              <button 
                className="flex items-center justify-center space-x-2 text-green-100 w-full"
                onClick={() => {
                  toast({
                    title: "Voice Help",
                    description: "Voice assistance feature will be implemented soon!",
                  });
                }}
              >
                <Mic className="w-5 h-5" />
                <span className="font-medium">Tap for voice help</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <SearchFilters
        onSearch={setSearch}
        onCategoryChange={setCategory}
        currentCategory={category}
        currentSearch={search}
      />

      {/* Products Section */}
      <section id="products" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold agro-dark mb-4">Fresh Products</h2>
            <p className="text-xl agro-gray">Quality agricultural products from local farmers</p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-xl font-semibold agro-dark mb-2">No products found</h3>
              <p className="agro-gray mb-6">
                {search || category !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Be the first to list a product!"
                }
              </p>
              {user && (
                <Link href="/add-product">
                  <Button className="bg-agro-green hover:bg-green-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* AI Assistant Banner */}
      <section className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="text-4xl mb-4">🤖</div>
              <h2 className="text-2xl md:text-3xl font-bold agro-dark mb-4">
                Need Help? Ask Our AI Assistant
              </h2>
              <p className="text-lg agro-gray mb-6">
                Get instant help with pricing, weather updates, and farming advice in your local language
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors flex items-center justify-center space-x-2"
                  onClick={() => {
                    toast({
                      title: "AI Chat",
                      description: "AI assistant feature will be implemented soon!",
                    });
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat Now</span>
                </Button>
                <Button 
                  className="bg-agro-green hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors flex items-center justify-center space-x-2"
                  onClick={() => {
                    toast({
                      title: "Voice Assistant",
                      description: "Voice assistant feature will be implemented soon!",
                    });
                  }}
                >
                  <Mic className="w-5 h-5" />
                  <span>Voice Help</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
