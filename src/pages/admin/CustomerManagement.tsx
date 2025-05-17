
import React, { useState } from "react";
import { useAdmin } from "@/context/auth-centext";
import { useOrders } from "@/context/order-context";
import { User } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, User as UserIcon } from "lucide-react";

const CustomerManagement = () => {
  const { users } = useAdmin();
  const { orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter only customer users 
  const customers = users.filter(user => user.role === "customer");

  // Filter customers based on search
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewCustomer = (customer: User) => {
    setSelectedUser(customer);
    setIsDialogOpen(true);
  };

  // Get customer's orders
  const getCustomerOrders = (customerId: string) => {
    return orders.filter(order => order.customerId === customerId);
  };

  // Calculate total spent by customer
  const getTotalSpent = (customerId: string) => {
    return getCustomerOrders(customerId).reduce(
      (sum, order) => sum + order.totalAmount, 
      0
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#FFD700]">Customer Management</h1>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-gray-900 border-gray-800"
        />
        <p className="text-sm text-gray-400">
          Total Customers: {filteredCustomers.length}
        </p>
      </div>

      <div className="border rounded-lg border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-900 hover:bg-gray-900">
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="border-gray-800 hover:bg-gray-900">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-800 p-2 rounded-full">
                        <UserIcon className="h-5 w-5 text-[#FFD700]" />
                      </div>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-900/20 text-blue-300">
                      {getCustomerOrders(customer.id).length}
                    </Badge>
                  </TableCell>
                  <TableCell>PKR {getTotalSpent(customer.id).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewCustomer(customer)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-4xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Information and order history for this customer.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">Customer Information</h3>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p>{selectedUser.email}</p>
                  <p>Customer ID: {selectedUser.id}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">Order Summary</h3>
                  <p>Total Orders: {getCustomerOrders(selectedUser.id).length}</p>
                  <p>Total Spent: PKR {getTotalSpent(selectedUser.id).toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Order History</h3>
                {getCustomerOrders(selectedUser.id).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCustomerOrders(selectedUser.id).map((order) => (
                        <TableRow key={order.id} className="border-gray-800">
                          <TableCell>{order.id}</TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>PKR {order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-400">This customer has no orders yet.</p>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
