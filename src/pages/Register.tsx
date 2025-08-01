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
import toast from "react-hot-toast";
import SvgIllustration from "../assets/undraw_medical-care.svg";
import { registerApi } from "@/api/authApi";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [homeCode, setHomeCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !homeCode) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await toast.promise(
        registerApi({ name, email, password, code: homeCode }),
        {
          loading: "Creating your account...",
          success: () => "Registration successful! Please login.",
          error: (err) =>
            err?.response?.data?.error ||
            "Registration failed, please try again.",
        },
        { style: { minWidth: "250px" } }
      );
      navigate("/login");
    } catch (err: any) {
      const errorMsg = await err.json().then((e: any) => e.message || "Error");
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left: Illustration */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-10">
        <div className="text-white text-center space-y-6">
          <img
            src={SvgIllustration}
            alt="Medical Illustration"
            className="w-full max-w-sm mx-auto"
          />
          <h2 className="text-3xl font-bold text-[#1d3e54]">OFSTED Prep</h2>
          <p className="text-sm opacity-80 text-[#1d3e54]">
            Stay compliant, stay ready.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center bg-[#1d3e54] justify-center px-6 py-12">
        <Card className="w-full max-w-md shadow-lg border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#1d3e54]">
              Register
            </CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="homeCode">Home Code</Label>
                <Input
                  id="homeCode"
                  type="text"
                  placeholder="Enter your home code"
                  value={homeCode}
                  onChange={(e) => setHomeCode(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1d3e54] hover:bg-[#174257]"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-[#1d3e54]">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-bold hover:text-[#174257] underline"
                >
                  Login
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
