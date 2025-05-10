
import React from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAdmin } from "@/context/admin-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Archive, Package, Settings, ShoppingBag, User, Users } from "lucide-react";

const AdminLayout = () => {
  const { isAuthenticated, logout } = useAdmin();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: ShoppingBag,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: Archive,
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: Users,
    },
    {
      name: "Promotions",
      href: "/admin/promotions",
      icon: Settings,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 p-4">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-2xl font-bold text-[#FFD700]">Admin Panel</h1>
        </div>
        
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive(item.href)
                  ? "bg-gray-800 text-[#FFD700]"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <Separator className="my-4 bg-gray-800" />
        
        <div className="mt-auto">
          <Button
            variant="outline"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
            onClick={logout}
          >
            <User className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
