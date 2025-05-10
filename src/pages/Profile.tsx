
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useUser } from "@/context/user-context";
import { BadgeCheck, Mail, Package, Phone, User, MapPin, Plus, Pencil, Save } from "lucide-react";

const Profile = () => {
  const { isAuthenticated, profile, updateProfile, logout, orders, addAddress, updateAddress, removeAddress } = useUser();
  const navigate = useNavigate();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated || !profile) {
    return <Navigate to="/login" />;
  }
  
  // Personal info state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [editedEmail, setEditedEmail] = useState(profile.email);
  const [editedPhone, setEditedPhone] = useState(profile.phone || "");
  
  // Address state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  });
  
  const handleUpdateProfile = () => {
    updateProfile({
      name: editedName,
      email: editedEmail,
      phone: editedPhone,
    });
    setIsEditingProfile(false);
  };
  
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAddressIndex !== null) {
      updateAddress(editingAddressIndex.toString(), addressForm);
      setEditingAddressIndex(null);
    } else {
      addAddress(addressForm);
    }
    
    setAddressForm({
      fullName: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: ""
    });
    setIsAddingAddress(false);
  };
  
  const handleEditAddress = (index: number) => {
    setAddressForm(profile.addresses[index]);
    setEditingAddressIndex(index);
    setIsAddingAddress(true);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-500";
      case "shipped":
        return "text-blue-500";
      case "processing":
        return "text-yellow-500";
      case "pending":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };
  
  return (
    <div className="min-h-screen bg-noir-900 text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <Card className="bg-noir-800 border-noir-700">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={profile.profileImage} alt={profile.name} />
                    <AvatarFallback className="bg-gold text-noir-900">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold mb-1">{profile.name}</h2>
                  <p className="text-sm text-noir-400 mb-4">{profile.email}</p>
                  <Button 
                    variant="outline" 
                    className="w-full border-red-500 text-red-500 hover:bg-red-900/20"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="md:w-3/4">
            <Tabs defaultValue="profile">
              <TabsList className="w-full bg-noir-800 border-b border-noir-700">
                <TabsTrigger value="profile" className="flex-1">Personal Info</TabsTrigger>
                <TabsTrigger value="orders" className="flex-1">Order History</TabsTrigger>
                <TabsTrigger value="addresses" className="flex-1">Address Book</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card className="bg-noir-800 border-noir-700">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-gold">Personal Information</CardTitle>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                      >
                        {isEditingProfile ? "Cancel" : "Edit Profile"}
                      </Button>
                    </div>
                    <CardDescription>Manage your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditingProfile ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-noir-400" />
                            <Input
                              id="name"
                              className="pl-10 bg-noir-900 border-noir-700"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-noir-400" />
                            <Input
                              id="email"
                              type="email"
                              className="pl-10 bg-noir-900 border-noir-700"
                              value={editedEmail}
                              onChange={(e) => setEditedEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-noir-400" />
                            <Input
                              id="phone"
                              className="pl-10 bg-noir-900 border-noir-700"
                              value={editedPhone}
                              onChange={(e) => setEditedPhone(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button 
                          className="bg-gold hover:bg-gold-dark text-noir-900" 
                          onClick={handleUpdateProfile}
                        >
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <User className="h-5 w-5 text-gold mt-0.5" />
                          <div>
                            <h3 className="font-medium">Full Name</h3>
                            <p className="text-noir-400">{profile.name}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-gold mt-0.5" />
                          <div>
                            <h3 className="font-medium">Email</h3>
                            <p className="text-noir-400">{profile.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-gold mt-0.5" />
                          <div>
                            <h3 className="font-medium">Phone Number</h3>
                            <p className="text-noir-400">{profile.phone || "Not specified"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders">
                <Card className="bg-noir-800 border-noir-700">
                  <CardHeader>
                    <CardTitle className="text-gold">Order History</CardTitle>
                    <CardDescription>View and track your orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border border-noir-700 rounded-lg overflow-hidden">
                            <div className="bg-noir-700 p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                              <div>
                                <p className="text-sm text-noir-400">Order #{order.id.substring(6)}</p>
                                <p className="text-xs text-noir-500">{formatDate(order.createdAt)}</p>
                              </div>
                              <div className="flex items-center gap-2 mt-2 md:mt-0">
                                <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                <Link
                                  to={`/order-confirmation/${order.id}`}
                                  className="text-gold text-sm hover:underline"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex flex-wrap gap-4">
                                {order.items.slice(0, 3).map((item) => (
                                  <div key={item.id} className="flex items-center gap-3">
                                    <img
                                      src={item.imageUrl}
                                      alt={item.name}
                                      className="w-12 h-12 object-cover rounded-md"
                                    />
                                    <div>
                                      <p className="text-sm font-medium">{item.name}</p>
                                      <p className="text-xs text-noir-400">
                                        ${item.price.toFixed(2)} × {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                                {order.items.length > 3 && (
                                  <div className="flex items-center text-sm text-noir-400">
                                    +{order.items.length - 3} more items
                                  </div>
                                )}
                              </div>
                              <div className="mt-3 flex justify-between items-center border-t border-noir-700 pt-3">
                                <p className="font-medium">Total: ${order.totalAmount.toFixed(2)}</p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-xs h-8"
                                  onClick={() => navigate(`/order-tracking/${order.id}`)}
                                >
                                  <Package className="mr-1 h-3 w-3" /> Track Order
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-noir-600 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                        <p className="text-noir-400 mb-4">You haven't placed any orders yet.</p>
                        <Button 
                          className="bg-gold hover:bg-gold-dark text-noir-900"
                          onClick={() => navigate("/shop")}
                        >
                          Start Shopping
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="addresses">
                <Card className="bg-noir-800 border-noir-700">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-gold">Address Book</CardTitle>
                      <Button 
                        size="sm" 
                        className="bg-gold hover:bg-gold-dark text-noir-900"
                        onClick={() => {
                          setIsAddingAddress(true);
                          setEditingAddressIndex(null);
                          setAddressForm({
                            fullName: profile.name,
                            streetAddress: "",
                            city: "",
                            state: "",
                            postalCode: "",
                            country: ""
                          });
                        }}
                      >
                        <Plus className="mr-1 h-4 w-4" /> Add Address
                      </Button>
                    </div>
                    <CardDescription>Manage your shipping addresses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isAddingAddress ? (
                      <div className="border border-noir-700 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-4">
                          {editingAddressIndex !== null ? "Edit Address" : "Add New Address"}
                        </h3>
                        <form onSubmit={handleAddressSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              className="bg-noir-900 border-noir-700"
                              value={addressForm.fullName}
                              onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="streetAddress">Street Address</Label>
                            <Input
                              id="streetAddress"
                              className="bg-noir-900 border-noir-700"
                              value={addressForm.streetAddress}
                              onChange={(e) => setAddressForm({...addressForm, streetAddress: e.target.value})}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                className="bg-noir-900 border-noir-700"
                                value={addressForm.city}
                                onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state">State/Province</Label>
                              <Input
                                id="state"
                                className="bg-noir-900 border-noir-700"
                                value={addressForm.state}
                                onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="postalCode">Postal Code</Label>
                              <Input
                                id="postalCode"
                                className="bg-noir-900 border-noir-700"
                                value={addressForm.postalCode}
                                onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="country">Country</Label>
                              <Input
                                id="country"
                                className="bg-noir-900 border-noir-700"
                                value={addressForm.country}
                                onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                                required
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button type="submit" className="bg-gold hover:bg-gold-dark text-noir-900">
                              {editingAddressIndex !== null ? "Update Address" : "Save Address"}
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setIsAddingAddress(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </div>
                    ) : profile.addresses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.addresses.map((address, index) => (
                          <div key={index} className="border border-noir-700 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-medium">{address.fullName}</h3>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-gold hover:text-gold-dark"
                                  onClick={() => handleEditAddress(index)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500 hover:text-red-400"
                                  onClick={() => removeAddress(index.toString())}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm">{address.streetAddress}</p>
                            <p className="text-sm">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            <p className="text-sm">{address.country}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="mx-auto h-12 w-12 text-noir-600 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
                        <p className="text-noir-400 mb-4">You haven't added any addresses yet.</p>
                        <Button 
                          className="bg-gold hover:bg-gold-dark text-noir-900"
                          onClick={() => setIsAddingAddress(true)}
                        >
                          <Plus className="mr-1 h-4 w-4" /> Add Address
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
