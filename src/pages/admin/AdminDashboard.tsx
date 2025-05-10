
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from "@/context/order-context";
import { useAdmin } from "@/context/admin-context";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Users, Package, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  const { orders } = useOrders();
  const { users, products } = useAdmin();

  // Calculate metrics
  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const processingOrders = orders.filter(order => order.status === "processing").length;
  const shippedOrders = orders.filter(order => order.status === "shipped").length;
  const deliveredOrders = orders.filter(order => order.status === "delivered").length;
  const returnedOrders = orders.filter(order => order.status === "returned").length;

  // Quick stats
  const stats = [
    {
      name: "Total Revenue",
      value: `$${totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-500"
    },
    {
      name: "Total Products",
      value: products.length,
      icon: Package,
      color: "text-blue-500"
    },
    {
      name: "Total Customers",
      value: users.filter(user => user.role === "customer").length,
      icon: Users,
      color: "text-purple-500"
    },
    {
      name: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-red-500"
    },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#FFD700]">Dashboard</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 flex items-center">
              <div className={`p-2 rounded-full bg-opacity-20 mr-4 ${stat.color.replace('text-', 'bg-')}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Status */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
          <CardDescription>Overview of order statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="bg-yellow-900/20 text-yellow-300 hover:bg-yellow-900/30">
              Pending: {pendingOrders}
            </Badge>
            <Badge variant="outline" className="bg-blue-900/20 text-blue-300 hover:bg-blue-900/30">
              Processing: {processingOrders}
            </Badge>
            <Badge variant="outline" className="bg-purple-900/20 text-purple-300 hover:bg-purple-900/30">
              Shipped: {shippedOrders}
            </Badge>
            <Badge variant="outline" className="bg-green-900/20 text-green-300 hover:bg-green-900/30">
              Delivered: {deliveredOrders}
            </Badge>
            <Badge variant="outline" className="bg-red-900/20 text-red-300 hover:bg-red-900/30">
              Returned: {returnedOrders}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest 5 orders from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-right font-medium">${order.totalAmount.toFixed(2)}</p>
                    <Badge
                      variant="outline"
                      className={
                        order.status === "delivered"
                          ? "bg-green-900/20 text-green-300"
                          : order.status === "returned"
                          ? "bg-red-900/20 text-red-300"
                          : "bg-yellow-900/20 text-yellow-300"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No orders yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
