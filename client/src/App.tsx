import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { MobileNav } from "@/components/mobile-nav";
import Home from "@/pages/home";
import Register from "@/pages/register";
import Profile from "@/pages/profile";
import AddProduct from "@/pages/add-product";
import ContactSeller from "@/pages/contact-seller";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/profile" component={Profile} />
      <Route path="/add-product" component={AddProduct} />
      <Route path="/contact-seller/:id" component={ContactSeller} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Router />
          <MobileNav />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
