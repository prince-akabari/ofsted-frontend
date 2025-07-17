import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Lock, FileText, Shield } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/apiService";

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    joinDate: "",
    lastLogin: ""
  });

  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const userId = JSON.parse(localStorage.getItem("user") || "{}").id;

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/profile/${userId}`);
      setUser(res.data);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(
      api.put(`/profile/${userId}`, {
        name: user.name,
        email: user.email,
        role: user.role
      }),
      {
        loading: "Updating profile...",
        success: "Profile updated successfully",
        error: (err) => err?.response?.data?.error || "Update failed"
      }
    );
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirmation don't match");
      return;
    }

    toast.promise(
      api.put(`/profile/change-password/${userId}`, passwordData),
      {
        loading: "Changing password...",
        success: "Password changed successfully",
        error: (err) => err?.response?.data?.error || "Password change failed"
      }
    ).then(() => {
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    });
  };

  const userDocuments = [
    { name: "DBS Certificate", status: "valid", expiry: "2025-03-15" },
    { name: "Safeguarding Training", status: "valid", expiry: "2024-12-20" },
    { name: "First Aid Certificate", status: "expired", expiry: "2024-01-10" },
    { name: "Health & Safety Training", status: "valid", expiry: "2024-11-30" },
  ];

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-primary text-primary-foreground",
      staff: "bg-secondary text-secondary-foreground",
      readonly: "bg-muted text-muted-foreground"
    };
    return variants[role as keyof typeof variants] || variants.staff;
  };

  const getStatusBadge = (status: string) => {
    return status === "valid" 
      ? "bg-success text-success-foreground" 
      : "bg-destructive text-destructive-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and information</p>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarFallback className="text-2xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{user.name}</CardTitle>
              <div className="flex justify-center">
                <Badge className={`${getRoleBadge(user.role)} text-center min-w-[80px]`}>
                  {user.role.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Joined {user.joinDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Last login {user.lastLogin}</span>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button type="submit" disabled={loading}>Update Profile</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                      </div>
                      <Button type="submit" disabled={loading}>Change Password</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>My Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">Expires: {doc.expiry}</p>
                            </div>
                          </div>
                          <Badge className={getStatusBadge(doc.status)}>
                            {doc.status.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
