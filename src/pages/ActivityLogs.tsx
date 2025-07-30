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
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  FileText,
  CheckSquare,
  Upload,
  AlertCircle,
} from "lucide-react";
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 5;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/activity-logs?page=${page}&limit=${limit}`);
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
  }, [page]);

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
      ALERTS: "bg-red-200 text-red-900",
    };
    return variants[category as keyof typeof variants];
  };

  const truncate = (text: string, max: number = 50) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  const renderPagination = () => {
    const pages = [];
    const delta = 2;
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
          <span key={i} className="px-2 text-muted-foreground">
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
  const formatAction = (rawAction: string, category: string) => {
    const method = rawAction.split(" ")[0]; // e.g., DELETE
    const categoryClean = category
      ?.replace("AUDIT-", "Audit ")
      ?.replace("CHECKLIST", "Checklist")
      ?.replace(/-/g, " ")
      ?.toLowerCase();

    const actionMap: Record<string, string> = {
      POST: "Created",
      PUT: "Updated",
      PATCH: "Modified",
      DELETE: "Deleted",
      GET: "Viewed",
    };

    const actionWord = actionMap[method] || "Did";

    return `${actionWord} ${categoryClean || "item"}`;
  };

  return (
    <div className="min-h-screen bg-background">
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

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities ({totalLogs})</CardTitle>
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
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : logs.length === 0 ? (
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
                          <Badge className={getCategoryBadge(log.category)}>
                            {log.category.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatAction(log.action, log.category)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {truncate(log.details, 40)}
                      </TableCell>
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
            {renderPagination()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
