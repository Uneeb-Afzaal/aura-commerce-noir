
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/context/admin-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    const success = login(email, password);
    if (success) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md bg-black border border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-[#FFD700]">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-900 border-gray-700"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-[#FFD700] hover:bg-[#F5CB00] text-black font-medium"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center w-full text-gray-500">
            Demo credentials: admin@example.com / admin123
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
