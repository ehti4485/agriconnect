import { apiRequest } from "./queryClient";
import { type User } from "@shared/schema";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: "farmer" | "trader";
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<User> => {
    const response = await apiRequest("POST", "/api/auth/login", data);
    return response.json();
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await apiRequest("POST", "/api/auth/register", data);
    return response.json();
  },

  logout: async (): Promise<void> => {
    await apiRequest("POST", "/api/auth/logout");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiRequest("GET", "/api/auth/me");
    return response.json();
  },
};
