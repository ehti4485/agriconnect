import { Link, useLocation } from "wouter";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/auth";

export function MobileNav() {
  const [location] = useLocation();
  
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: authApi.getCurrentUser,
    retry: false,
  });

  const isActive = (path: string) => location === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-40">
      <div className="grid grid-cols-5 h-16">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center h-full transition-colors ${
            isActive("/") ? "text-green-500" : "text-gray-600 dark:text-gray-400 hover:text-green-500"
          }`}>
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </div>
        </Link>
        
        <button className="flex flex-col items-center justify-center h-full text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">
          <Search className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Search</span>
        </button>
        
        {user ? (
          <Link href="/add-product">
            <div className={`flex flex-col items-center justify-center h-full transition-colors ${
              isActive("/add-product") ? "text-green-500" : "text-gray-600 dark:text-gray-400 hover:text-green-500"
            }`}>
              <Plus className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Sell</span>
            </div>
          </Link>
        ) : (
          <Link href="/register">
            <div className="flex flex-col items-center justify-center h-full text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">
              <Plus className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Join</span>
            </div>
          </Link>
        )}
        
        <button className="flex flex-col items-center justify-center h-full text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">
          <MessageCircle className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">AI Help</span>
        </button>
        
        {user ? (
          <Link href="/profile">
            <div className={`flex flex-col items-center justify-center h-full transition-colors ${
              isActive("/profile") ? "text-green-500" : "text-gray-600 dark:text-gray-400 hover:text-green-500"
            }`}>
              <User className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Profile</span>
            </div>
          </Link>
        ) : (
          <Link href="/register">
            <div className="flex flex-col items-center justify-center h-full text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">
              <User className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Login</span>
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}
