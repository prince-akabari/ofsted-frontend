import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, AlertCircle, Circle } from "lucide-react";
import { type AuditItem } from "@/data/dummyData";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/apiService";

export default function AuditChecklist() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [auditChecklistData, setAuditChecklistData] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAuditChecklist = async () => {
      try {
        const res = await api.get("/audit-checklist");
        setAuditChecklistData(res.data.auditChecklist);
      } catch (err) {
        console.error("Failed to fetch audit checklist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditChecklist();
  }, []);

  const categories = [
    "all",
    ...new Set(auditChecklistData.map((item) => item.category)),
  ];

  const filteredItems =
    selectedCategory === "all"
      ? auditChecklistData
      : auditChecklistData.filter((item) => item.category === selectedCategory);

  const getStatusIcon = (status: AuditItem["status"]) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-warning" />;
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: AuditItem["status"]) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "complete":
        return `${baseClasses} bg-success text-success-foreground`;
      case "in-progress":
        return `${baseClasses} bg-warning text-warning-foreground`;
      case "overdue":
        return `${baseClasses} bg-destructive text-destructive-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const getPriorityBadge = (priority: AuditItem["priority"]) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (priority) {
      case "high":
        return `${baseClasses} bg-destructive text-destructive-foreground`;
      case "medium":
        return `${baseClasses} bg-warning text-warning-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const getCategoryStats = (category: string) => {
    const items =
      category === "all"
        ? auditChecklistData
        : auditChecklistData.filter((item) => item.category === category);
    const completed = items.filter((item) => item.status === "complete").length;
    const total = items.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Audit Checklist
          </h1>
          <p className="text-muted-foreground">
            OFSTED-aligned criteria and compliance tracking
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-24 w-full rounded-md" />
            <Skeleton className="h-24 w-full rounded-md" />
            <Skeleton className="h-24 w-full rounded-md" />
          </div>
        ) : (
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-7 h-auto">
              {categories.map((category) => {
                const stats = getCategoryStats(category);
                return (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="relative p-3 flex-1"
                  >
                    <div className="text-center min-w-0">
                      <div className="text-sm font-medium capitalize truncate">
                        {category === "all"
                          ? "All Items"
                          : category.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {stats.completed}/{stats.total}
                      </div>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="space-y-4">
                  {/* Category Overview */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {category === "all" ? "All Categories" : category}{" "}
                          Progress
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {getCategoryStats(category).completed} of{" "}
                          {getCategoryStats(category).total} items completed
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {getCategoryStats(category).percentage}%
                        </div>
                        <div className="w-32 bg-muted rounded-full h-2 mt-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${getCategoryStats(category).percentage}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Audit Items */}
                  <div className="space-y-3">
                    {filteredItems.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="mt-1">{getStatusIcon(item.status)}</div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-foreground">
                                  {item.item}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {item.category}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Badge
                                  className={getPriorityBadge(item.priority)}
                                >
                                  {item.priority.toUpperCase()}
                                </Badge>
                                <Badge className={getStatusBadge(item.status)}>
                                  {item.status.toUpperCase()}
                                </Badge>
                              </div>
                            </div>

                            {item.dueDate && (
                              <p className="text-sm text-muted-foreground">
                                Due:{" "}
                                {new Date(item.dueDate).toLocaleDateString()}
                              </p>
                            )}

                            {item.assignedTo && (
                              <p className="text-sm text-muted-foreground">
                                Assigned to: {item.assignedTo ? item.assignedTo?.name : '-'}
                              </p>
                            )}

                            {item.comments && (
                              <p className="text-sm text-foreground bg-muted p-2 rounded">
                                {item.comments}
                              </p>
                            )}

                            {item.evidence && item.evidence.length > 0 && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">
                                  Evidence:{" "}
                                </span>
                                <span className="text-primary">
                                  {item.evidence.join(", ")}
                                </span>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              <Button size="sm" variant="outline">
                                Upload Evidence
                              </Button>
                              {item.status !== "complete" && (
                                <Button size="sm" variant="default">
                                  Mark Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
