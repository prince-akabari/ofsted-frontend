import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, User, FileText, CheckSquare, Upload } from "lucide-react";
import api from "@/services/apiService";

interface ActivityLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  category: string;
  details: string;
  status: string;
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 5;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/activity-logs?page=${page}&limit=${limit}`, {
        params: {
          search: searchTerm || undefined,
          category: filterCategory !== "all" ? filterCategory : undefined,
          status: filterStatus !== "all" ? filterStatus : undefined,
        },
      });

      setLogs(res.data.logs);
      setTotalPages(res.data.totalPages);
      setTotalLogs(res.data.totalLogs);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, searchTerm, filterCategory, filterStatus]);

  const getIcon = (category: string) => {
    switch (category) {
      case "AUDIT-CHECKLIST":
        return <CheckSquare className="w-4 h-4" />;
      case "document":
        return <Upload className="w-4 h-4" />;
      case "policy":
        return <FileText className="w-4 h-4" />;
      case "compliance":
        return <User className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
    };
    return variants[status as keyof typeof variants] || variants.success;
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      "AUDIT-CHECKLIST": "bg-blue-100 text-blue-800",
      USERS: "bg-purple-100 text-purple-800",
      REPORTS: "bg-orange-100 text-orange-800",
      compliance: "bg-gray-200 text-gray-900",
    };
    return variants[category as keyof typeof variants];
  };

  const truncate = (text: string, max: number = 20) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          variant={page === i ? "default" : "outline"}
          className="px-3 py-1 mx-1 text-sm"
          onClick={() => setPage(i)}
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex justify-end items-center gap-2 m-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          &lt;
        </Button>
        {pages}
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          &gt;
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Activity Logs
          </h1>
          <p className="text-muted-foreground">
            Track all system activities and changes
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
              <Select
                value={filterCategory}
                onValueChange={(val) => {
                  setFilterCategory(val);
                  setPage(1);
                }}
              >
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

              <Select
                value={filterStatus}
                onValueChange={(val) => {
                  setFilterStatus(val);
                  setPage(1);
                }}
              >
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
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {loading ? "Loading..." : `Recent Activities (${totalLogs})`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
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
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {log.timestamp}
                      </TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getIcon(log.category)}
                          <Badge className={getCategoryBadge(log.category)}>
                            {log.category.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{truncate(log.action)}</TableCell>
                      <TableCell>{truncate(log.details)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(log.status)}>
                          {log.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {/* Pagination UI */}
            {renderPagination()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
