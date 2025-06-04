import { Heart, MapPin, Phone, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type ProductWithSeller } from "@shared/schema";
import { Link } from "wouter";

interface ProductCardProps {
  product: ProductWithSeller;
}

export function ProductCard({ product }: ProductCardProps) {
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
    <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden">
      {/* Product Image */}
      <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl">
            {getCategoryIcon(product.category)}
          </div>
        )}
      </div>

      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold agro-dark truncate">{product.title}</h3>
          <div className="flex items-center agro-amber">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm font-medium">4.8</span>
          </div>
        </div>

        {/* Description */}
        <p className="agro-gray mb-4 text-sm line-clamp-2">{product.description}</p>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold agro-green">
            {product.category === "livestock" ? formatPrice(product.price) : `${formatPrice(product.price)}/kg`}
          </span>
          <Badge variant="secondary" className="text-sm agro-gray">
            {product.quantity} available
          </Badge>
        </div>

        {/* Location */}
        <div className="flex items-center mb-4 text-sm agro-gray">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{product.location}</span>
        </div>

        {/* Seller Info */}
        <div className="text-sm agro-gray mb-4">
          <span>Seller: {product.seller.firstName} {product.seller.lastName}</span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link href={`/contact-seller/${product.id}`} className="flex-1">
            <Button className="w-full bg-agro-green hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors">
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => {
              // TODO: Implement favorites functionality
            }}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
