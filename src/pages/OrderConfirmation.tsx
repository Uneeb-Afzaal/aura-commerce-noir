
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrders } from "@/context/order-context";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PrinterIcon, RefreshCw } from "lucide-react";

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, initiateReturn, reorder } = useOrders();
  const { addItems, clearCart } = useCart();
  const [order, setOrder] = useState(id ? getOrderById(id) : undefined);

  useEffect(() => {
    if (id) {
      setOrder(getOrderById(id));
    }
  }, [id, getOrderById]);

  if (!order) {
    return (
      <div className="container mx-auto max-w-5xl py-12 px-4">
        <Card className="bg-black border border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Order Not Found</CardTitle>
            <CardDescription>
              The order you requested does not exist.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="default" className="bg-[#FFD700] hover:bg-[#F5CB00] text-black" onClick={() => navigate("/shop")}>
              Continue Shopping
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleReturn = () => {
    if (order && order.status !== "returned") {
      initiateReturn(order.id);
      setOrder({...order, status: "returned"});
    }
  };

  const handleReorder = () => {
    if (order) {
      const items = reorder(order.id);
      addItems(items);
      navigate("/cart");
    }
  };

  // Format date for display
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <Card className="bg-black border border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-[#FFD700]">
                Order Confirmation
              </CardTitle>
              <CardDescription>
                Thank you for your purchase! Here's a summary of your order.
              </CardDescription>
            </div>
            <Badge variant="outline" className="ml-auto">
              {order.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-[#FFD700] mb-2">Order Details</h3>
              <p className="text-sm text-gray-400">Order ID: {order.id}</p>
              <p className="text-sm text-gray-400">Date: {formattedDate}</p>
              <p className="text-sm text-gray-400">Payment Method: {order.paymentMethod}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#FFD700] mb-2">Shipping Address</h3>
              <p className="text-sm text-gray-400">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-gray-400">{order.shippingAddress.streetAddress}</p>
              <p className="text-sm text-gray-400">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-sm text-gray-400">{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-[#FFD700] mb-4">Items</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id} className="border-gray-800">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-400">{item.brand}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 text-right">
              <p className="text-lg font-bold">
                Total: ${order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 sm:flex-row sm:justify-between items-start sm:items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handlePrint}
            >
              <PrinterIcon size={16} />
              Print Invoice
            </Button>
            {/* {order.status !== "returned" && (
              <Button
                variant="outline"
                className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-900/20"
                onClick={handleReturn}
              >
                Return Order
              </Button>
            )} */}
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              className="bg-[#FFD700] hover:bg-[#F5CB00] text-black flex items-center gap-2"
              onClick={handleReorder}
            >
              <RefreshCw size={16} />
              Reorder
            </Button>
            <Button
              variant="default"
              className="bg-[#FFD700] hover:bg-[#F5CB00] text-black flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              Return Home
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderConfirmation;
