import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_BASE_URL = "/api";
// Removed BACKGROUND_IMAGE_URL constant as it's no longer used

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      // Use the clubs-panel login which sets an httpOnly cookie (adminToken)
      const response = await fetch(`${API_BASE_URL}/clubs-panel/admin-login`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Auth cookie is set by server; AuthContext will pick up admin/club info.

      navigate("/dashboard");

    } catch (err: any) {
      setError("Network error. Please try again.");
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    // Reverting to a simple light background, ensuring the form is still centered.
    <div 
      className="flex h-screen w-screen items-center justify-center bg-gray-50" // Changed to bg-gray-50 for a clean look
    > 
      
      {/* Removed the absolute image overlay */}
      
      {/* Center container for the login form - simplified classes */}
      <div className="w-full max-w-md p-6 md:p-8">
        {/* Card uses white background for high contrast */}
        <Card className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl shadow-2xl">
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-extrabold text-gray-900">
                Sign In
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Access your club's administrative dashboard.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mister.faz@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-500 font-medium text-center mt-4">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
              <div className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="underline text-blue-500 hover:text-blue-700 font-medium">
                  Register
                </Link>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
