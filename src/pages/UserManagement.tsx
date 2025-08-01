import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Mail } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/apiService";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "readonly";
  status: "active" | "inactive";
  lastLogin: string | null;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    homeId: string;
    role: "admin" | "staff" | "readonly";
  }>({ name: "", email: "", homeId: "", role: "staff" });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 5;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get<any>(
        `/users?page=${page}&limit=${itemsPerPage}`
      );
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      setTotalUsers(res.data.totalUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setButtonLoading(true);
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    formData.homeId = user.homeId;
    toast
      .promise(api.post("/users/invite", formData), {
        loading: "Sending invite...",
        success: () => {
          setIsDialogOpen(false);
          fetchUsers();
          return `Invitation sent to ${formData.email}`;
        },
        error: (err) => err?.response?.data?.error || "Failed to invite user",
      })
      .finally(() => setButtonLoading(false));
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      homeId: "",
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setButtonLoading(true);
    toast
      .promise(
        api.put(`/users/${editingUser.id}`, {
          ...formData,
          status: editingUser.status,
        }),
        {
          loading: "Updating user...",
          success: () => {
            setIsDialogOpen(false);
            fetchUsers();
            return "User updated";
          },
          error: (err) => err?.response?.data?.error || "Failed to update user",
        }
      )
      .finally(() => setButtonLoading(false));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setButtonLoading(true);
    toast
      .promise(api.delete(`/users/${deleteTarget.id}`), {
        loading: "Deleting user...",
        success: () => {
          setDeleteTarget(null);
          fetchUsers();
          return "User deleted";
        },
        error: (err) => err?.response?.data?.error || "Failed to delete user",
      })
      .finally(() => setButtonLoading(false));
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-primary text-primary-foreground",
      staff: "bg-secondary text-secondary-foreground",
      readonly: "bg-muted text-muted-foreground",
    };
    return variants[role as keyof typeof variants] || variants.staff;
  };

  const getStatusBadge = (status: string) => {
    return status === "active"
      ? "bg-green-500 text-white"
      : "bg-red-500 text-white";
  };

  const renderPagination = () => {
    const pages = [];
    const delta = 2; // how many numbers to show around current
    const range = [];
    const start = Math.max(2, page - delta);
    const end = Math.min(totalPages - 1, page + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (start > 2) {
      range.unshift("...");
    }
    if (end < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    for (let i = 0; i < range.length; i++) {
      const val = range[i];
      pages.push(
        typeof val === "number" ? (
          <Button
            key={val}
            variant={page === val ? "default" : "outline"}
            className="px-3 py-1 mx-1 text-sm"
            onClick={() => setPage(val)}
          >
            {val}
          </Button>
        ) : (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
            {val}
          </span>
        )
      );
    }

    return (
      <div className="flex justify-end items-center gap-2 m-4">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(1)}
        >
          {"<<"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          {"<"}
        </Button>

        {pages}

        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          {">"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage(totalPages)}
        >
          {">>"}
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage system users and their permissions
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">All Users : {`${totalUsers}`}</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={buttonLoading}
                onClick={() => {
                  setEditingUser(null);
                  setFormData({
                    name: "",
                    email: "",
                    role: "staff",
                    homeId: "",
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Invite User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? "Edit User" : "Invite New User"}
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={editingUser ? handleUpdate : handleInvite}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="readonly">Read-only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={buttonLoading}
                >
                  {editingUser ? "Update User" : "Send Invitation"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <>
                    {[...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell className="py-4">
                          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-10 bg-muted animate-pulse rounded" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadge(user.role)}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(user.status)}>
                          {user.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(user)}
                            disabled={buttonLoading}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteTarget(user)}
                            disabled={buttonLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {renderPagination()}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4 p-6">
        <h4 className="font-medium">Role Permissions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h5 className="font-medium mb-2">Admin</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Full access to all features</li>
              <li>• Can manage users and settings</li>
              <li>• Can generate all reports</li>
              <li>• Can modify audit checklists</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h5 className="font-medium mb-2">Staff</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• View assigned tasks</li>
              <li>• Upload documents</li>
              <li>• Complete audit items</li>
              <li>• View policies</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h5 className="font-medium mb-2">Read-Only</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• View reports and progress</li>
              <li>• Access dashboard</li>
              <li>• Export data</li>
              <li>• No editing permissions</li>
            </ul>
          </Card>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <p>Are you sure you want to delete {deleteTarget?.name}?</p>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={buttonLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={buttonLoading}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
