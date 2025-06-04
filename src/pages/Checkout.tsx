
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/cart-context";
import { useUser } from "@/context/auth-centext";
import { useOrders } from "@/context/order-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Address, ShippingOption, PaymentMethod, CartItem } from "@/types";
import CryptoJS from 'crypto-js';

const shippingOptions: ShippingOption[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    price: 200,
    estimatedDays: 1,
    description: "Delivery within 3-5 business days",
  },
  // {
  //   id: "express",
  //   name: "Express Shipping",
  //   price: 14.99,
  //   estimatedDays: 2,
  //   description: "Delivery within 1-2 business days",
  // },
  // {
  //   id: "scheduled",
  //   name: "Scheduled Delivery",
  //   price: 19.99,
  //   estimatedDays: 1,
  //   description: "Choose your delivery date and time",
  // },
];

const paymentMethods: PaymentMethod[] = [
  // {
  //   id: "credit-card",
  //   type: "credit_card",
  //   name: "Credit Card",
  //   icon: "💳",
  // },
  // {
  //   id: "paypal",
  //   type: "paypal",
  //   name: "PayPal",
  //   icon: "🅿️",
  // },
  // {
  //   id: "apple-pay",
  //   type: "apple_pay",
  //   name: "Apple Pay",
  //   icon: "🍎",
  // },
  {
    id: "cash-on-delivery",
    type: "cash_on_delivery",
    name: "Cash on Delivery",
    icon: "💵",
  },
];

const JAZZCASH = {
  MERCHANT_ID: import.meta.env.VITE_JAZZCASH_MERCHANT_ID || '',
  PASSWORD: import.meta.env.VITE_JAZZCASH_PASSWORD || '',
  INTEGRITY_SALT: import.meta.env.VITE_JAZZCASH_INTEGRITY_SALT || '',
  ENDPOINT: import.meta.env.VITE_JAZZCASH_ENDPOINT || '',
  RETURN_URL: import.meta.env.VITE_JAZZCASH_RETURN_URL || '',
  CANCEL_URL: import.meta.env.VITE_JAZZCASH_CANCEL_URL || '',
};

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, subtotal, clearCart } = useCart();
  const { isAuthenticated, profile } = useUser();
  const { createOrder } = useOrders();
  
  // Checkout steps
  const [currentStep, setCurrentStep] = useState<"shipping" | "payment" | "review">("shipping");
  
  // Form states
  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(shippingOptions[0]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(paymentMethods[0]);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    console.log("profile:", profile);
    if (isAuthenticated && profile && profile.addresses.length > 0) {
      setShippingAddress(profile.addresses[0]);
      setSelectedAddressIndex(0);
    }
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, profile]);
  
  // Set shipping address from profile if available
  useEffect(() => {
    if (profile && profile.addresses.length > 0) {
      setShippingAddress(profile.addresses[0]);
      setSelectedAddressIndex(0);
    }
  }, [profile]);
  
  const handleAddressSelect = (index: number) => {
    if (profile && profile.addresses[index]) {
      setShippingAddress(profile.addresses[index]);
      setSelectedAddressIndex(index);
    }
  };
  
  const handleShippingOptionSelect = (option: ShippingOption) => {
    setSelectedShipping(option);
  };
  
  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };
  
  const handlePromoCodeApply = () => {
    // if (promoCode.toLowerCase() === "welcome10") {
    //   const discountAmount = subtotal * 0.1; // 10% discount
    //   setDiscount(discountAmount);
    //   toast({
    //     title: "Promo code applied!",
    //     description: `You received a 10% discount of PKR ${discountAmount.toFixed(2)}.`,
    //   });
    // } else if (promoCode.toLowerCase() === "freeship") {
    //   const discountAmount = selectedShipping.price;
    //   setDiscount(discountAmount);
    //   toast({
    //     title: "Promo code applied!",
    //     description: "You received free shipping!",
    //   });
    // } else {
    //   toast({
    //     title: "Invalid promo code",
    //     description: "The promo code you entered is invalid or expired.",
    //     variant: "destructive",
    //   });
    // }
  };
  
  const handleContinueToPayment = () => {
    if (!shippingAddress.fullName || !shippingAddress.streetAddress || 
        !shippingAddress.city || !shippingAddress.state || 
        !shippingAddress.postalCode || !shippingAddress.country) {
      toast({
        title: "Please complete shipping address",
        description: "All fields in the shipping address are required.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentStep("payment");
  };
  
  const handleContinueToReview = () => {
    if (selectedPaymentMethod.type === "credit_card") {
      if (!cardDetails.cardNumber || !cardDetails.cardName || 
          !cardDetails.expiryDate || !cardDetails.cvv) {
        toast({
          title: "Please complete payment details",
          description: "All fields in the payment form are required.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setCurrentStep("review");
  };

  const handleJazzCash = (orderId: string, amount: number) => {
        // 1. Build the payload
        const now        = new Date();
        const txnDateTime = now.toISOString().slice(0,19).replace('T',' ');
        const amtString   = (amount * 100).toFixed(0); // PKR to paisa
    
        const payload: Record<string,string> = {
          pp_Version:       '1.1',
          pp_TxnType:       'MPAY',
          pp_Language:      'EN',
          pp_MerchantID:    JAZZCASH.MERCHANT_ID,
          pp_Password:      JAZZCASH.PASSWORD,
          pp_TxnRefNo:      orderId,
          pp_Amount:        amtString,
          pp_TxnCurrency:   'PKR',
          pp_TxnDateTime:   txnDateTime,
          pp_BillReference: `billRef_${orderId}`,
          pp_Description:   `Order #${orderId}`,
          pp_ReturnURL:     JAZZCASH.RETURN_URL,
          pp_CancelURL:     JAZZCASH.CANCEL_URL,
        };
    
        // 2. Create the secure hash
        //    – sort keys, concatenate values (no delimiters), HMAC-SHA256 over that string
        const hashString = Object
          .keys(payload)
          .sort()
          .map((k) => payload[k])
          .join('');
        const secureHash = CryptoJS
          .HmacSHA256(hashString, JAZZCASH.INTEGRITY_SALT)
          .toString(CryptoJS.enc.Hex);
        payload.pp_SecureHash = secureHash;
    
        // 3. Build & auto-submit the form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = JAZZCASH.ENDPOINT;
        Object.entries(payload).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type  = 'hidden';
          input.name  = key;
          input.value = value;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      };
  
  const handlePlaceOrder = async () => {
    setIsLoading(true);
    
    try {
      // Calculate final amounts
      const shipping = selectedShipping.price;
      const tax = subtotal * 0.01; // 1% tax
      const total = subtotal + shipping + tax - discount;
      
      // Create order items from cart items
      const orderItems: CartItem[] = items.map(item => ({
        ...item,
        quantity: item.quantity
      }));
      
      // Create the order
      const order = await createOrder(
        orderItems, 
        shippingAddress,
        selectedPaymentMethod.name
      );
      
      // Clear cart after successful order
      clearCart();

      console.log("Order created:", order);
      
      // Show success toast
      toast({
        title: "Order placed successfully!",
        description: `Your order #${(await order).id.substring(6)} has been confirmed.`,
      });
      
      // Redirect to order confirmation page
      navigate(`/order-confirmation/${(await order).id}`);
    } catch (error) {
      console.error("Failed to place order:", error);
      toast({
        title: "Failed to place order",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate totals
  const shipping = selectedShipping.price;
  const tax = subtotal * 0.01; // 1% tax
  const total = subtotal + shipping + tax - discount;
  
  return (
    <div className="min-h-screen bg-noir-900 text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-light">
              <span className="text-gold">Checkout</span>
            </h1>
            <Button 
              variant="link" 
              className="text-gold" 
              onClick={() => navigate("/cart")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as any)}>
                <TabsList className="w-full grid grid-cols-3 bg-noir-800 border-b border-noir-700">
                  <TabsTrigger 
                    value="shipping"
                    disabled={currentStep !== "shipping"}
                    className="data-[state=active]:text-gold"
                  >
                    1. Shipping
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payment"
                    disabled={currentStep === "shipping"}
                    className="data-[state=active]:text-gold"
                  >
                    2. Payment
                  </TabsTrigger>
                  <TabsTrigger 
                    value="review"
                    disabled={currentStep === "shipping" || currentStep === "payment"}
                    className="data-[state=active]:text-gold"
                  >
                    3. Review
                  </TabsTrigger>
                </TabsList>
                
                {/* Shipping step */}
                <TabsContent value="shipping">
                  <Card className="bg-noir-800 border-noir-700">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-medium mb-6">Shipping Information</h2>
                      
                      {/* Saved addresses */}
                      {isAuthenticated && profile && profile.addresses.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium mb-3">Saved Addresses</h3>
                          <div className="grid gap-3">
                            {profile.addresses.map((address, index) => (
                              <div
                                key={index}
                                className={`border rounded-md p-3 cursor-pointer ${
                                  selectedAddressIndex === index 
                                    ? 'border-gold bg-noir-700' 
                                    : 'border-noir-700 hover:border-gold'
                                }`}
                                onClick={() => handleAddressSelect(index)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{address.fullName}</p>
                                    <p className="text-sm text-noir-400">{address.streetAddress}</p>
                                    <p className="text-sm text-noir-400">
                                      {address.city}, {address.state} {address.postalCode}
                                    </p>
                                    <p className="text-sm text-noir-400">{address.country}</p>
                                  </div>
                                  {selectedAddressIndex === index && (
                                    <CheckCircle className="text-gold h-5 w-5" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <Separator className="my-6 bg-noir-700" />
                        </div>
                      )}
                      
                      {/* Shipping address form */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              className="bg-noir-900 border-noir-700 mt-1"
                              placeholder="John Doe"
                              value={shippingAddress.fullName}
                              onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="streetAddress">Street Address</Label>
                          <Input
                            id="streetAddress"
                            className="bg-noir-900 border-noir-700 mt-1"
                            placeholder="123 Main St"
                            value={shippingAddress.streetAddress}
                            onChange={(e) => setShippingAddress({...shippingAddress, streetAddress: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              className="bg-noir-900 border-noir-700 mt-1"
                              placeholder="New York"
                              value={shippingAddress.city}
                              onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State/Province</Label>
                            <Input
                              id="state"
                              className="bg-noir-900 border-noir-700 mt-1"
                              placeholder="NY"
                              value={shippingAddress.state}
                              onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="postalCode">Postal/ZIP Code</Label>
                            <Input
                              id="postalCode"
                              className="bg-noir-900 border-noir-700 mt-1"
                              placeholder="10001"
                              value={shippingAddress.postalCode}
                              onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              className="bg-noir-900 border-noir-700 mt-1"
                              placeholder="United States"
                              value={shippingAddress.country}
                              onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-6 bg-noir-700" />
                      
                      {/* Shipping options */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Shipping Method</h3>
                        <RadioGroup className="space-y-3">
                          {shippingOptions.map((option) => (
                            <div
                              key={option.id}
                              className={`flex items-center border rounded-md p-4 ${
                                selectedShipping.id === option.id 
                                  ? 'border-gold bg-noir-700' 
                                  : 'border-noir-700 hover:border-gold'
                              }`}
                              onClick={() => handleShippingOptionSelect(option)}
                            >
                              <RadioGroupItem value={option.id} id={option.id} checked={selectedShipping.id === option.id} />
                              <div className="ml-3 flex-1">
                                <Label htmlFor={option.id} className="font-medium cursor-pointer">
                                  {option.name}
                                </Label>
                                <p className="text-sm text-noir-400">{option.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">PKR {option.price.toFixed(2)}</p>
                                <p className="text-xs text-noir-400">{option.estimatedDays} days</p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      
                      <div className="mt-8">
                        <Button 
                          className="w-full bg-gold hover:bg-gold-dark text-noir-900"
                          onClick={handleContinueToPayment}
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Payment step */}
                <TabsContent value="payment">
                  <Card className="bg-noir-800 border-noir-700">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-medium mb-6">Payment Method</h2>
                      
                      <RadioGroup className="space-y-3">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`flex items-center border rounded-md p-4 ${
                              selectedPaymentMethod.id === method.id 
                                ? 'border-gold bg-noir-700' 
                                : 'border-noir-700 hover:border-gold'
                            }`}
                            onClick={() => handlePaymentMethodSelect(method)}
                          >
                            <RadioGroupItem value={method.id} id={method.id} checked={selectedPaymentMethod.id === method.id} />
                            <div className="ml-3 flex items-center gap-2">
                              <span className="text-xl">{method.icon}</span>
                              <Label htmlFor={method.id} className="font-medium cursor-pointer">
                                {method.name}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                      
                      <Separator className="my-6 bg-noir-700" />
                      
                      {/* Credit card form */}
                      {selectedPaymentMethod.type === "credit_card" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Card Details</h3>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-noir-400" />
                              <Input
                                id="cardNumber"
                                className="bg-noir-900 border-noir-700 pl-10"
                                placeholder="1234 5678 9012 3456"
                                value={cardDetails.cardNumber}
                                onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="cardName">Name on Card</Label>
                            <Input
                              id="cardName"
                              className="bg-noir-900 border-noir-700"
                              placeholder="John Doe"
                              value={cardDetails.cardName}
                              onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input
                                id="expiryDate"
                                className="bg-noir-900 border-noir-700"
                                placeholder="MM/YY"
                                value={cardDetails.expiryDate}
                                onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                type="password"
                                className="bg-noir-900 border-noir-700"
                                placeholder="123"
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* PayPal placeholder */}
                      {selectedPaymentMethod.type === "paypal" && (
                        <div className="p-6 text-center border border-dashed border-noir-700 rounded-md">
                          <p className="text-noir-400">
                            You will be redirected to PayPal to complete your payment.
                          </p>
                        </div>
                      )}
                      
                      {/* Apple Pay placeholder */}
                      {selectedPaymentMethod.type === "apple_pay" && (
                        <div className="p-6 text-center border border-dashed border-noir-700 rounded-md">
                          <p className="text-noir-400">
                            You will be prompted to confirm payment with Apple Pay.
                          </p>
                        </div>
                      )}
                      
                      <Separator className="my-6 bg-noir-700" />
                      
                      {/* Promo code */}
                      <div>
                        <h3 className="text-lg font-medium mb-3">Promo Code</h3>
                        <div className="flex gap-2">
                          <Input
                            className="bg-noir-900 border-noir-700"
                            placeholder="Enter promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                          />
                          <Button 
                            variant="outline" 
                            onClick={handlePromoCodeApply}
                            disabled={!promoCode}
                          >
                            Apply
                          </Button>
                        </div>
                        <p className="text-xs text-noir-400 mt-2">
                          Try "WELCOME10" for 10% off or "FREESHIP" for free shipping!
                        </p>
                      </div>
                      
                      <div className="mt-8 flex gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentStep("shipping")}
                        >
                          Back to Shipping
                        </Button>
                        <Button 
                          className="flex-1 bg-gold hover:bg-gold-dark text-noir-900"
                          onClick={handleContinueToReview}
                        >
                          Continue to Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Review step */}
                <TabsContent value="review">
                  <Card className="bg-noir-800 border-noir-700">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-medium mb-6">Order Review</h2>
                      
                      {/* Shipping info summary */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-noir-400 mb-2">Shipping Address</h3>
                        <div className="border border-noir-700 rounded-md p-4">
                          <p className="font-medium">{shippingAddress.fullName}</p>
                          <p className="text-sm text-noir-400">{shippingAddress.streetAddress}</p>
                          <p className="text-sm text-noir-400">
                            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                          </p>
                          <p className="text-sm text-noir-400">{shippingAddress.country}</p>
                        </div>
                      </div>
                      
                      {/* Shipping method summary */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-noir-400 mb-2">Shipping Method</h3>
                        <div className="border border-noir-700 rounded-md p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{selectedShipping.name}</p>
                            <p className="text-sm text-noir-400">{selectedShipping.description}</p>
                          </div>
                          <p className="font-medium">PKR {selectedShipping.price.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      {/* Payment method summary */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-noir-400 mb-2">Payment Method</h3>
                        <div className="border border-noir-700 rounded-md p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{selectedPaymentMethod.icon}</span>
                            <p className="font-medium">{selectedPaymentMethod.name}</p>
                          </div>
                          {selectedPaymentMethod.type === "credit_card" && (
                            <p className="text-sm text-noir-400 mt-1">
                              Card ending in {cardDetails.cardNumber.slice(-4)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Order items */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-noir-400 mb-2">Order Items ({items.length})</h3>
                        <div className="border border-noir-700 rounded-md divide-y divide-noir-700">
                          {items.map((item) => (
                            <div key={item.id} className="p-4 flex items-center gap-4">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-noir-400">
                                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Secure checkout note */}
                      <div className="flex items-center gap-2 bg-noir-900 p-3 rounded-md mb-6">
                        <Shield className="h-5 w-5 text-gold" />
                        <p className="text-sm">Your payment information is secure and encrypted</p>
                      </div>
                      
                      <div className="mt-8 flex gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentStep("payment")}
                        >
                          Back to Payment
                        </Button>
                        <Button 
                          className="flex-1 bg-gold hover:bg-gold-dark text-noir-900"
                          onClick={handlePlaceOrder}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <span className="animate-spin mr-2">⟳</span> Processing...
                            </span>
                          ) : (
                            "Place Order"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Order summary */}
            <div>
              <Card className="bg-noir-800 border-noir-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-noir-400">Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span>PKR {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-noir-400">Shipping</span>
                      <span>PKR {shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-noir-400">Tax</span>
                      <span>PKR {tax.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-500">
                        <span>Discount</span>
                        <span>-PKR {discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <Separator className="bg-noir-700" />
                    
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span className="text-gold">PKR {total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Order item summary */}
                  <div className="mt-6 space-y-3">
                    <Separator className="bg-noir-700" />
                    <h3 className="text-sm font-medium">Items in Order</h3>
                    <div className="max-h-80 overflow-auto pr-2 space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-noir-400">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm">PKR {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
