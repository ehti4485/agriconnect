import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertContactSchema, type InsertContact, type ProductWithSeller } from "@shared/schema";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Phone, Mail, User, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ContactSeller() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Extract product ID from URL
  const productId = parseInt(location.split("/").pop() || "0");

  const { data: product, isLoading } = useQuery<ProductWithSeller>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      productId,
      buyerName: "",
      buyerEmail: "",
      buyerPhone: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest("POST", "/api/contacts", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "The seller will receive your contact details and message.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌱</div>
          <p className="text-lg agro-gray">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-xl font-bold agro-dark mb-2">Product Not Found</h1>
            <p className="agro-gray mb-4">The product you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation("/")} className="bg-agro-green hover:bg-green-600">
              Back to Home
            </Button>
          </CardContent>
        </Card>
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
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <h1 className="text-3xl font-bold agro-dark">Contact Seller</h1>
          <p className="agro-gray">Send a message to the seller about this product</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center text-6xl">
                  {getCategoryIcon(product.category)}
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold agro-dark">{product.title}</h3>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {product.category}
                  </Badge>
                </div>
                
                <p className="agro-gray">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold agro-green">
                    {product.category === "livestock" ? formatPrice(product.price) : `${formatPrice(product.price)}/kg`}
                  </span>
                  <Badge variant="secondary">
                    {product.quantity} available
                  </Badge>
                </div>
                
                <div className="flex items-center text-sm agro-gray">
                  <MapPin className="w-4 h-4 mr-2" />
                  {product.location}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <div className="space-y-6">
            {/* Seller Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Seller Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-agro-green rounded-full flex items-center justify-center text-white font-bold">
                      {product.seller.firstName[0]}{product.seller.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold agro-dark">
                        {product.seller.firstName} {product.seller.lastName}
                      </p>
                      <p className="text-sm agro-gray flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {product.seller.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm agro-gray flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {product.seller.phone}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Send Message</span>
                </CardTitle>
                <CardDescription>
                  The seller will receive your contact details and message
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="buyerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="buyerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="buyerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+92 300 1234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="I'm interested in your product. Please let me know about pricing, quantity, and availability..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-agro-green hover:bg-green-600"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
