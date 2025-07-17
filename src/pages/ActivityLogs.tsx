import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, FileText, CheckSquare, Upload } from "lucide-react";

interface ActivityLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  category: "checklist" | "document" | "policy" | "compliance";
  details: string;
  status: "success" | "warning" | "error";
}

const dummyLogs: ActivityLog[] = [
  { id: 1, timestamp: "2024-01-15 14:30", user: "John Smith", action: "Updated audit item", category: "checklist", details: "Marked 'Fire Safety Check' as complete", status: "success" },
  { id: 2, timestamp: "2024-01-15 13:45", user: "Sarah Johnson", action: "Uploaded document", category: "document", details: "Uploaded DBS certificate", status: "success" },
  { id: 3, timestamp: "2024-01-15 12:20", user: "Admin", action: "Policy updated", category: "policy", details: "Updated Safeguarding Policy v2.1", status: "success" },
  { id: 4, timestamp: "2024-01-15 11:10", user: "Mike Wilson", action: "Compliance check", category: "compliance", details: "Training certificate expired", status: "warning" },
  { id: 5, timestamp: "2024-01-15 10:05", user: "Emma Davis", action: "Document upload failed", category: "document", details: "File size too large", status: "error" },
  { id: 6, timestamp: "2024-01-14 16:30", user: "John Smith", action: "Audit item assigned", category: "checklist", details: "Assigned 'Health & Safety Review' to Sarah Johnson", status: "success" },
];

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>(dummyLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || log.category === filterCategory;
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getIcon = (category: string) => {
    switch (category) {
      case "checklist": return <CheckSquare className="w-4 h-4" />;
      case "document": return <Upload className="w-4 h-4" />;
      case "policy": return <FileText className="w-4 h-4" />;
      case "compliance": return <User className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-success text-success-foreground",
      warning: "bg-warning text-warning-foreground",
      error: "bg-destructive text-destructive-foreground"
    };
    return variants[status as keyof typeof variants] || variants.success;
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      checklist: "bg-primary text-primary-foreground",
      document: "bg-secondary text-secondary-foreground",
      policy: "bg-accent text-accent-foreground",
      compliance: "bg-muted text-muted-foreground"
    };
    return variants[category as keyof typeof variants] || variants.checklist;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Activity Logs</h1>
          <p className="text-muted-foreground">Track all system activities and changes</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="checklist">Checklist</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getIcon(log.category)}
                        <Badge className={getCategoryBadge(log.category)}>
                          {log.category.toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(log.status)}>
                        {log.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}