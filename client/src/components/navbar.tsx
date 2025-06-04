import { Link, useLocation } from "wouter";
import { Mic, Menu, User, Home, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: authApi.getCurrentUser,
    retry: false,
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

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-agro-green rounded-lg p-2">
              <div className="w-6 h-6 text-white flex items-center justify-center">🌱</div>
            </div>
            <span className="text-xl font-bold agro-dark">AgroMarket</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                className={isActive("/") ? "bg-agro-green hover:bg-green-600" : ""}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            {user && (
              <>
                <Link href="/add-product">
                  <Button
                    variant={isActive("/add-product") ? "default" : "ghost"}
                    className={isActive("/add-product") ? "bg-agro-green hover:bg-green-600" : ""}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Sell
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button
                    variant={isActive("/profile") ? "default" : "ghost"}
                    className={isActive("/profile") ? "bg-agro-green hover:bg-green-600" : ""}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Voice Command Button */}
            <Button
              variant="outline"
              size="icon"
              className="bg-agro-blue hover:bg-blue-600 text-white border-0"
              onClick={() => {
                toast({
                  title: "Voice Command",
                  description: "Voice command feature will be implemented soon!",
                });
              }}
            >
              <Mic className="w-4 h-4" />
            </Button>

            {/* User Menu or Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden md:flex">
                    <User className="w-4 h-4 mr-2" />
                    {user.firstName} {user.lastName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLocation("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/add-product")}>
                    Add Product
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link href="/register">
                  <Button variant="outline">Register</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
