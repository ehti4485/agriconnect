import { 
  users, 
  products, 
  contacts,
  type User, 
  type InsertUser,
  type Product,
  type InsertProduct,
  type Contact,
  type InsertContact,
  type ProductWithSeller
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getProducts(category?: string, search?: string): Promise<ProductWithSeller[]>;
  getProduct(id: number): Promise<ProductWithSeller | undefined>;
  getProductsBySeller(sellerId: number): Promise<Product[]>;
  createProduct(product: InsertProduct, sellerId: number): Promise<Product>;
  
  // Contact operations
  createContact(contact: InsertContact): Promise<Contact>;
  getContactsByProduct(productId: number): Promise<Contact[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private contacts: Map<number, Contact>;
  private currentUserId: number;
  private currentProductId: number;
  private currentContactId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.contacts = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentContactId = 1;
    
    // Add sample data for demonstration
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Sample users
    const sampleUsers = [
      {
        username: "ali_farmer",
        email: "ali@example.com",
        password: "hashedpassword123",
        role: "farmer" as const,
        firstName: "Ali",
        lastName: "Ahmed",
        phone: "+92 300 1234567",
        location: "Lahore, Punjab",
        profileImageUrl: null
      },
      {
        username: "fatima_trader",
        email: "fatima@example.com", 
        password: "hashedpassword456",
        role: "trader" as const,
        firstName: "Fatima",
        lastName: "Khan",
        phone: "+92 333 9876543",
        location: "Karachi, Sindh",
        profileImageUrl: null
      }
    ];

    for (const userData of sampleUsers) {
      const id = this.currentUserId++;
      const user: User = {
        ...userData,
        id,
        createdAt: new Date()
      };
      this.users.set(id, user);
    }

    // Sample products
    const sampleProducts = [
      {
        sellerId: 1,
        title: "Premium Basmati Rice",
        description: "High-quality basmati rice, freshly harvested from our organic farm. Perfect for daily cooking and special occasions.",
        price: "85",
        quantity: "500kg",
        category: "grains" as const,
        location: "Lahore, Punjab",
        imageUrl: null
      },
      {
        sellerId: 1,
        title: "Fresh Tomatoes",
        description: "Vine-ripened tomatoes, grown without pesticides. Rich in vitamins and perfect for cooking.",
        price: "120",
        quantity: "200kg",
        category: "vegetables" as const,
        location: "Lahore, Punjab", 
        imageUrl: null
      },
      {
        sellerId: 2,
        title: "Sweet Mangoes",
        description: "Delicious Chaunsa mangoes, hand-picked at perfect ripeness. Sweet and juicy.",
        price: "180",
        quantity: "100kg",
        category: "fruits" as const,
        location: "Karachi, Sindh",
        imageUrl: null
      },
      {
        sellerId: 1,
        title: "Wheat Flour",
        description: "Stone-ground wheat flour from our own wheat harvest. Perfect for making fresh bread and chapati.",
        price: "65",
        quantity: "1000kg",
        category: "grains" as const,
        location: "Lahore, Punjab",
        imageUrl: null
      }
    ];

    for (const productData of sampleProducts) {
      const id = this.currentProductId++;
      const product: Product = {
        ...productData,
        id,
        isActive: true,
        createdAt: new Date()
      };
      this.products.set(id, product);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      profileImageUrl: insertUser.profileImageUrl || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getProducts(category?: string, search?: string): Promise<ProductWithSeller[]> {
    let filteredProducts = Array.from(this.products.values())
      .filter(product => product.isActive);

    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Add seller information
    const productsWithSeller: ProductWithSeller[] = [];
    for (const product of filteredProducts) {
      const seller = this.users.get(product.sellerId);
      if (seller) {
        productsWithSeller.push({
          ...product,
          seller: {
            firstName: seller.firstName,
            lastName: seller.lastName,
            phone: seller.phone,
            location: seller.location,
          }
        });
      }
    }

    return productsWithSeller.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getProduct(id: number): Promise<ProductWithSeller | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const seller = this.users.get(product.sellerId);
    if (!seller) return undefined;

    return {
      ...product,
      seller: {
        firstName: seller.firstName,
        lastName: seller.lastName,
        phone: seller.phone,
        location: seller.location,
      }
    };
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.sellerId === sellerId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createProduct(insertProduct: InsertProduct, sellerId: number): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      ...insertProduct,
      id,
      sellerId,
      imageUrl: insertProduct.imageUrl || null,
      isActive: true,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContactsByProduct(productId: number): Promise<Contact[]> {
    return Array.from(this.contacts.values())
      .filter(contact => contact.productId === productId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }
}

export const storage = new MemStorage();
