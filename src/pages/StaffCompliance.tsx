import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import { AddStaffModal } from "@/components/modals/AddStaffModal";
import { ViewStaffModal } from "@/components/modals/ViewStaffModal";
import { UploadDocumentsModal } from "@/components/modals/UploadDocumentsModal";
import { UpdateStatusModal } from "@/components/modals/UpdateStatusModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/services/apiService";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { hasRole } from "@/lib/utils";
import UpdateRecordsModal from "@/components/modals/UpdateRecordsModal";

export default function StaffCompliance() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [viewStaffOpen, setViewStaffOpen] = useState(false);
  const [uploadDocsOpen, setUploadDocsOpen] = useState(false);
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [summary, setSummary] = useState<{
    overallCompliance: string;
    fullyCompliant: number;
    attentionNeeded: number;
    overdue: number;
  } | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get("/staff");
      setStaff(res.data.staff);
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Failed to fetch staff", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "compliant":
        return `${baseClasses} bg-success text-success-foreground`;
      case "warning":
        return `${baseClasses} bg-warning text-warning-foreground`;
      case "overdue":
        return `${baseClasses} bg-destructive text-destructive-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const getTrainingStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getDbsStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "text-success";
      case "expiring":
        return "text-warning";
      case "expired":
        return "text-destructive";
    }
  };

  const calculateComplianceScore = (staff: any) => {
    let score = 0;
    const maxScore = 4;
    if (staff.dbsCheckStatus === "valid") score += 1;
    if (staff.trainingSafeguardingStatus === "complete") score += 1;
    if (staff.trainingFirstAidStatus === "complete") score += 1;
    if (staff.trainingMedicationStatus === "complete") score += 1;
    return Math.round((score / maxScore) * 100);
  };

  const overallComplianceRate =
    staff.length > 0
      ? Math.round(
          staff.reduce((acc, s) => acc + calculateComplianceScore(s), 0) /
            staff.length
        )
      : 0;

  const handleAddStaff = (newStaff: any) => {
    setStaff([...staff, newStaff]);
  };

  const handleUpdateStaff = (updatedStaff: any) => {
    setStaff(staff.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
  };

  const handleViewDetails = (s: any) => {
    setSelectedStaff(s);
    setViewStaffOpen(true);
  };

  const handleUploadDocs = (s: any) => {
    setSelectedStaff(s);
    setUploadDocsOpen(true);
  };

  const handleUpdateStatus = (s: any) => {
    setSelectedStaff(s);
    setUpdateStatusOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const deletePromise = api.delete(`/staff/${deleteTarget.id}`);

    setButtonLoading(true);

    toast.promise(deletePromise, {
      loading: "Deleting staff...",
      success: "Staff deleted successfully!",
      error: "Failed to delete staff. Please try again.",
    });

    try {
      await deletePromise;
      setStaff((prev) => prev.filter((staff) => staff.id !== deleteTarget.id));
    } catch (err) {
      console.error("Failed to delete staff", err);
    } finally {
      setButtonLoading(false);
      setDeleteTarget(null);
      fetchStaff();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Staff Compliance
          </h1>
          <p className="text-muted-foreground">
            Training, DBS checks, and compliance tracking
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        {summary ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-4 w-full h-24">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {summary.overallCompliance}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Overall Compliance
                </div>
              </div>
            </Card>
            <Card className="p-4 w-full h-24">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {summary.fullyCompliant}
                </div>
                <div className="text-sm text-muted-foreground">
                  Fully Compliant
                </div>
              </div>
            </Card>
            <Card className="p-4 w-full h-24">
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {summary.attentionNeeded}
                </div>
                <div className="text-sm text-muted-foreground">
                  Attention Needed
                </div>
              </div>
            </Card>
            <Card className="p-4 w-full h-24">
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {summary.overdue}
                </div>
                <div className="text-sm text-muted-foreground">
                  Overdue Items
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // Radix UI Skeletons
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className="p-4 w-full h-24 flex items-center justify-center"
              >
                <Skeleton className="w-24 h-6 mb-2" />
                <Skeleton className="w-32 h-4" />
              </Card>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Staff Members</h2>
            {/* <Button onClick={() => setAddStaffOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add New Staff
            </Button> */}
          </div>
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <Card key={idx} className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-3 w-36" />
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-2 w-24" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-24 rounded-md" />
                    <Skeleton className="h-10 w-24 rounded-md" />
                    <Skeleton className="h-10 w-12 rounded-md" />
                  </div>
                </Card>
              ))
            : staff.map((s) => (
                <Card key={s.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {s.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{s.name}</h3>
                          <p className="text-muted-foreground">{s.role}</p>
                          <p className="text-sm text-muted-foreground">
                            {s.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={getStatusBadge(s.status)}>
                          {s.status.toUpperCase()}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          Compliance: {calculateComplianceScore(s)}%
                        </div>
                        <Progress
                          value={calculateComplianceScore(s)}
                          className="w-24"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4 bg-muted/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">DBS Check</h4>
                            <p
                              className={`text-sm ${getDbsStatusColor(
                                s.dbsCheckStatus
                              )}`}
                            >
                              {s.dbsCheckStatus.toUpperCase()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(s.dbsExpiryDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </Card>
                      <div className="space-y-2">
                        <h4 className="font-medium">Training Status</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                            <div className="flex items-center gap-2">
                              {getTrainingStatusIcon(
                                s.trainingSafeguardingStatus
                              )}
                              <span className="text-sm">Safeguarding</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                s.trainingSafeguardingDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                            <div className="flex items-center gap-2">
                              {getTrainingStatusIcon(s.trainingFirstAidStatus)}
                              <span className="text-sm">First Aid</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                s.trainingFirstAidDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                            <div className="flex items-center gap-2">
                              {getTrainingStatusIcon(
                                s.trainingMedicationStatus
                              )}
                              <span className="text-sm">Medication</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                s.trainingMedicationDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(s)}
                      >
                        View Details
                      </Button>
                      {/* <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUploadDocs(s)}
                    >
                      Upload Documents
                    </Button>
                    <Button size="sm" variant="outline">
                      Send Reminder
                    </Button> */}

                      {s.status !== "compliant" &&
                        hasRole(["staff", "admin"]) && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleUpdateStatus(s)}
                          >
                            Update Status
                          </Button>
                        )}
                      <Button
                        onClick={() => {
                          setOpen(true), setSelectedStaff(s);
                        }}
                      >
                        Update Records
                      </Button>

                      {/* <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteTarget(s)}
                        disabled={buttonLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button> */}
                    </div>
                  </div>
                </Card>
              ))}
        </div>
      </div>

      <AddStaffModal
        open={addStaffOpen}
        onOpenChange={setAddStaffOpen}
        onStaffAdded={fetchStaff}
      />
      <ViewStaffModal
        open={viewStaffOpen}
        onOpenChange={setViewStaffOpen}
        staff={selectedStaff}
      />
      {/* <UploadDocumentsModal
        open={uploadDocsOpen}
        onOpenChange={setUploadDocsOpen}
        staff={selectedStaff}
      /> */}
      <UpdateStatusModal
        open={updateStatusOpen}
        onOpenChange={setUpdateStatusOpen}
        staff={selectedStaff}
        onUpdateStaff={fetchStaff}
      />
      <UpdateRecordsModal
        isOpen={open}
        onClose={setOpen}
        onSuccess={fetchStaff}
        staff={selectedStaff}
      />
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>?
            </p>
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
