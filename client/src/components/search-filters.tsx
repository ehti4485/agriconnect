import { useState } from "react";
import { Search, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SearchFiltersProps {
  onSearch: (search: string) => void;
  onCategoryChange: (category: string) => void;
  currentCategory: string;
  currentSearch: string;
}

const categories = [
  { id: "all", label: "All", icon: "🏠" },
  { id: "grains", label: "Grains", icon: "🌾" },
  { id: "vegetables", label: "Vegetables", icon: "🥕" },
  { id: "fruits", label: "Fruits", icon: "🍎" },
  { id: "livestock", label: "Livestock", icon: "🐄" },
];

export function SearchFilters({ 
  onSearch, 
  onCategoryChange, 
  currentCategory, 
  currentSearch 
}: SearchFiltersProps) {
  const [searchValue, setSearchValue] = useState(currentSearch);
  const { toast } = useToast();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <section className="bg-white py-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto mb-6">
          <Input
            type="text"
            placeholder="Search products (e.g., wheat, rice, vegetables)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full py-4 px-6 pr-32 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <Button
              type="button"
              size="icon"
              className="bg-agro-blue hover:bg-blue-600 text-white rounded-lg"
              onClick={() => {
                toast({
                  title: "Voice Search",
                  description: "Voice search feature will be implemented soon!",
                });
              }}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="bg-agro-green hover:bg-green-600 text-white rounded-lg"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              variant={currentCategory === category.id ? "default" : "outline"}
              className={`px-6 py-3 rounded-xl font-medium text-lg min-w-[120px] transition-colors ${
                currentCategory === category.id
                  ? "bg-agro-green hover:bg-green-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
