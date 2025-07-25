import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  UserRound,
  MessageSquareText,
  FileText,
  UploadCloud,
  Pencil,
  CheckCircle,
  Clock,
  AlertCircle,
  Circle,
  CircleCheckBig,
} from "lucide-react";
import { type AuditItem } from "@/data/dummyData";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/apiService";
import { AddAuditChecklistModal } from "@/components/modals/AddAuditChecklistModal";
import { hasRole } from "@/lib/utils";
import { EditAuditChecklistModal } from "@/components/modals/EditAuditChecklistModal";
import { UploadEvidenceModal } from "@/components/modals/UploadEvidenceModal";
import toast from "react-hot-toast";

export default function AuditChecklist() {
  const baseURL = `${import.meta.env.VITE_BACKEND_URL}/documents/evidence/`;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [auditChecklistData, setAuditChecklistData] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openChecklistModal, setOpenChecklistModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedChecklistId, setSelectedChecklistId] = useState<string | null>(
    null
  );
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [auditDoc, setAuditDoc] = useState<any>([]);

  useEffect(() => {
    fetchAuditChecklist();
  }, []);

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

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const updatePromise = api.put(`/audit-checklist/${id}`, {
      status: newStatus,
    });

    toast.promise(updatePromise, {
      loading: "Updating status...",
      success: "Status updated successfully!",
      error: "Failed to update status.",
    });

    try {
      await updatePromise;
      fetchAuditChecklist(); // refresh the list
    } catch (error) {
      console.error("Error updating audit checklist:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Audit Checklist
            </h1>
            <p className="text-muted-foreground">
              OFSTED-aligned criteria and compliance tracking
            </p>
          </div>
          {hasRole(["admin"]) && (
            <Button onClick={() => setOpenChecklistModal(true)}>
              Add Audit Checklist
            </Button>
          )}
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
            <TabsList className="grid w-full grid-cols-6 h-auto">
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
                              width: `${
                                getCategoryStats(category).percentage
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Audit Items */}
                  <div className="space-y-3">
                    {filteredItems.map((item) => (
                      <Card
                        key={item.id}
                        className="p-4 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex gap-4">
                          {/* Status Icon */}
                          <div className="mt-1 shrink-0">
                            {getStatusIcon(item.status)}
                          </div>

                          {/* Main Content */}
                          <div className="flex-1 space-y-3">
                            {/* Header Row: Title + Badges */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="min-w-[150px]">
                                <h4 className="text-md font-semibold text-foreground">
                                  {item.item}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {item.category}
                                </p>
                              </div>
                              <div className="flex gap-2 flex-wrap items-center">
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

                            {/* Horizontal Info Strip */}
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              {item.dueDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    Due:{" "}
                                    {new Date(
                                      item.dueDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}

                              {item.assignedTo && (
                                <div className="flex items-center gap-1">
                                  <UserRound className="w-4 h-4" />
                                  <span>
                                    Assigned to: {item.assignedTo?.name || "-"}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Comment (single line row) */}
                            {item.comments && (
                              <div className="flex items-start gap-2 text-sm bg-muted p-2 rounded">
                                <MessageSquareText className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <p className="text-foreground">
                                  {item.comments}
                                </p>
                              </div>
                            )}

                            {/* Evidence Files (inline style) */}
                            {item.evidence && item.evidence.length > 0 && (
                              <div className="text-sm">
                                <p className="text-muted-foreground font-medium mb-1">
                                  Evidence:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {item.evidence.map(
                                    (fileUrl: string, idx: number) => {
                                      const fileName = fileUrl.split("/").pop();
                                      return (
                                        <a
                                          key={idx}
                                          href={baseURL + fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 text-primary border border-primary/20 rounded-full transition text-xs font-medium"
                                        >
                                          <FileText className="h-4 w-4 text-primary" />
                                          {fileName}
                                        </a>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Action Buttons - Horizontal */}
                            <div className="flex gap-2 pt-1">
                              {hasRole(["admin"]) && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedChecklistId(item.id);
                                    setEditModalOpen(true);
                                  }}
                                  className="gap-1"
                                >
                                  <Pencil className="w-4 h-4" />
                                  Edit
                                </Button>
                              )}

                              {hasRole(["admin", "staff"]) && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setAuditId(item.id);
                                    setIsEvidenceModalOpen(true);
                                    setAuditDoc(item.evidence);
                                  }}
                                  className="gap-1"
                                >
                                  <UploadCloud className="w-4 h-4" />
                                  Upload Evidence
                                </Button>
                              )}
                              {hasRole(["admin", "staff"]) &&
                                item.status !== "complete" && (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="gap-1"
                                    onClick={() =>
                                      handleStatusUpdate(item.id, "complete")
                                    }
                                  >
                                    <CircleCheckBig className="w-4 h-4" />
                                    Mark as Complete
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
      <AddAuditChecklistModal
        open={openChecklistModal}
        onOpenChange={setOpenChecklistModal}
        onChecklistAdded={() => fetchAuditChecklist()}
      />
      {selectedChecklistId && (
        <EditAuditChecklistModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          checklistId={selectedChecklistId}
          onChecklistUpdated={() => {
            setEditModalOpen(false);
            fetchAuditChecklist();
          }}
        />
      )}
      <UploadEvidenceModal
        open={isEvidenceModalOpen}
        onOpenChange={(e) => {
          setIsEvidenceModalOpen(e), fetchAuditChecklist();
        }}
        auditId={auditId}
        initialEvidence={auditDoc}
      />
    </div>
  );
}
