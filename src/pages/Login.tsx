import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "@/api/authApi";
import toast from "react-hot-toast";

import SvgIllustration from "../assets/undraw_medical-care.svg"; // adjust path if needed

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await toast.promise(
        login({ email, password }),
        {
          loading: "Signing in...",
          success: (res) => `Welcome back, ${res.user.name}!`,
          error: (err) =>
            err?.response?.data?.message || "Invalid email or password",
        },
        { style: { minWidth: "250px" } }
      );

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      switch (response.user.role) {
        case "admin":
          navigate("/");
          break;
        case "staff":
          navigate("/staff-compliance");
          break;
        case "readonly":
          navigate("/reports");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      // Error handled in toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Section: Illustration and Branding */}
      <div className="hidden md:flex w-1/2  items-center justify-center p-10">
        <div className="text-white text-center space-y-6">
          <img
            src={SvgIllustration}
            alt="Medical Illustration"
            className="w-full max-w-sm mx-auto"
          />
          <h2 className="text-3xl font-bold text-[#1d3e54]" >OFSTED Prep</h2>
          <p className="text-sm opacity-80 text-[#1d3e54]">Stay compliant, stay ready.</p>
        </div>
      </div>

      {/* Right Section: Login Form */}
      <div className="flex flex-1 items-center bg-[#1d3e54] justify-center px-6 py-12">
        <Card className="w-full max-w-md shadow-lg border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#1d3e54]">
              Login
            </CardTitle>
            <CardDescription>Access your OFSTED account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Label htmlFor="email" className="mb-1 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="mb-1 block">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1d3e54] hover:bg-[#174257]"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
