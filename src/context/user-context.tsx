
import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, Address, Order } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface UserContextType {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addAddress: (address: Address) => void;
  updateAddress: (id: string, address: Address) => void;
  removeAddress: (id: string) => void;
  orders: Order[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers = [
  {
    id: 'user-1',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    phone: '+1234567890',
    addresses: [
      {
        fullName: 'John Doe',
        streetAddress: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      }
    ],
    profileImage: 'https://i.pravatar.cc/300',
    orderHistory: ['order-1654321', 'order-1654322'],
  }
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  // Load user session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setProfile(userData);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    }
  }, []);

  // Load orders for the current user
  useEffect(() => {
    if (profile) {
      const storedOrders = localStorage.getItem("orders");
      if (storedOrders) {
        try {
          const allOrders: Order[] = JSON.parse(storedOrders);
          // Filter orders for the current user
          const userOrders = allOrders.filter(
            (order) => order.customerId === profile.id
          );
          setOrders(userOrders);
        } catch (error) {
          console.error("Failed to parse orders from localStorage", error);
        }
      }
    } else {
      setOrders([]);
    }
  }, [profile]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call to authenticate
    try {
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
        return false;
      }

      const { password: _, ...userProfile } = user;
      
      // Create profile object
      const profile: UserProfile = {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        phone: userProfile.phone,
        addresses: userProfile.addresses,
        profileImage: userProfile.profileImage,
        orderHistory: userProfile.orderHistory,
      };
      
      setIsAuthenticated(true);
      setProfile(profile);
      localStorage.setItem("user", JSON.stringify(profile));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${profile.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Check if user already exists
    if (mockUsers.some((user) => user.email === email)) {
      toast({
        title: "Registration failed",
        description: "Email is already in use.",
        variant: "destructive",
      });
      return false;
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      addresses: [],
      orderHistory: [],
    };

    // In a real app, this would be an API call to create a user
    try {
      setIsAuthenticated(true);
      setProfile(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setProfile(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return;
    
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    localStorage.setItem("user", JSON.stringify(updatedProfile));
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const addAddress = (address: Address) => {
    if (!profile) return;
    
    const updatedAddresses = [...profile.addresses, address];
    const updatedProfile = { ...profile, addresses: updatedAddresses };
    setProfile(updatedProfile);
    localStorage.setItem("user", JSON.stringify(updatedProfile));
    
    toast({
      title: "Address added",
      description: "New address has been added to your address book.",
    });
  };

  const updateAddress = (id: string, address: Address) => {
    if (!profile) return;
    
    const addressIndex = profile.addresses.findIndex(
      (addr, index) => index.toString() === id
    );
    
    if (addressIndex < 0) return;
    
    const updatedAddresses = [...profile.addresses];
    updatedAddresses[addressIndex] = address;
    
    const updatedProfile = { ...profile, addresses: updatedAddresses };
    setProfile(updatedProfile);
    localStorage.setItem("user", JSON.stringify(updatedProfile));
    
    toast({
      title: "Address updated",
      description: "Your address has been updated successfully.",
    });
  };

  const removeAddress = (id: string) => {
    if (!profile) return;
    
    const addressIndex = parseInt(id);
    if (isNaN(addressIndex) || addressIndex < 0 || addressIndex >= profile.addresses.length) return;
    
    const updatedAddresses = profile.addresses.filter((_, index) => index !== addressIndex);
    const updatedProfile = { ...profile, addresses: updatedAddresses };
    setProfile(updatedProfile);
    localStorage.setItem("user", JSON.stringify(updatedProfile));
    
    toast({
      title: "Address removed",
      description: "Address has been removed from your address book.",
    });
  };

  const value = {
    isAuthenticated,
    profile,
    login,
    logout,
    register,
    updateProfile,
    addAddress,
    updateAddress,
    removeAddress,
    orders,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
