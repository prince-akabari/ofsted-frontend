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
import SvgIllustration from "../assets/undraw_medical-care.svg"; // same as login
import { registerApi } from "@/api/authApi";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("staff");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await toast.promise(
        registerApi({ name, email, password, role }),
        {
          loading: "Creating your account...",
          success: (res) => `Registration successful! Please login.`,
          error: (err) =>
            err?.response?.data?.message ||
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
      {/* Left Section */}
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

      {/* Right Section: Register Form */}
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
                <Label htmlFor="name" className="mb-1 block">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                  placeholder="Enter a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="role" className="mb-1 block">
                  Role
                </Label>
                <select
                  id="role"
                  className="w-full border rounded px-3 py-2 text-sm text-gray-700"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="staff">Staff</option>
                  <option value="readonly">Readonly</option>
                </select>
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
                  className="text-[#1d3e54] font-bold  hover:text-[#174257]"
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
