import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Mail,
  User,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import api from "@/services/apiService";

interface TrainingStatus {
  date?: string;
  status: "complete" | "pending" | "expired";
}

interface StaffDetails {
  name: string;
  role: string;
  email: string;
  status: "compliant" | "warning" | "overdue";
  overallCompliance: number;
  dbsCheck: {
    status: "valid" | "expiring" | "expired";
    expiryDate?: string;
    daysRemaining?: number;
  };
  training: {
    safeguarding: TrainingStatus;
    firstAid: TrainingStatus;
    medication: TrainingStatus;
  };
}

interface ViewStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: { id: string } | null;
}

export function ViewStaffModal({
  open,
  onOpenChange,
  staff,
}: ViewStaffModalProps) {
  const [data, setData] = useState<StaffDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && staff?.id) {
      setLoading(true);
      api
        .get(`/staff/${staff.id}`)
        .then((res) => setData(res.data))
        .catch(() => setData(null))
        .finally(() => setLoading(false));
    }
  }, [open, staff?.id]);

  const getStatusBadge = (status: StaffDetails["status"]) => {
    const base = "px-3 py-1 rounded-full text-sm font-medium";
    if (status === "compliant")
      return `${base} bg-success text-success-foreground`;
    if (status === "warning")
      return `${base} bg-warning text-warning-foreground`;
    if (status === "overdue")
      return `${base} bg-destructive text-destructive-foreground`;
    return `${base} bg-muted text-muted-foreground`;
  };

  const getTrainingStatusIcon = (status: TrainingStatus["status"]) => {
    if (status === "complete")
      return <CheckCircle className="h-5 w-5 text-success" />;
    if (status === "expired")
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    return <Clock className="h-5 w-5 text-warning" />;
  };

  const getDbsStatusColor = (status: string) => {
    if (status === "valid") return "text-success";
    if (status === "expiring") return "text-warning";
    return "text-destructive";
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Staff Member Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading...
          </div>
        ) : !data ? (
          <div className="py-10 text-center text-destructive">
            Failed to load data.
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Header */}
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {data.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{data.name || "-"}</h2>
                    <p className="text-lg text-muted-foreground">
                      {data.role || "-"}
                    </p>
                  </div>
                  <Badge className={getStatusBadge(data.status)}>
                    {data.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{data.email || "-"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    Overall Compliance:
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress value={data.overallCompliance} className="w-32" />
                    <span className="text-sm font-bold">
                      {data.overallCompliance || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    DBS Check Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`font-bold uppercase ${getDbsStatusColor(
                        data.dbsCheck.status
                      )}`}
                    >
                      {data.dbsCheck.status || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Expiry Date:</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{data.dbsCheck.expiryDate || "-"}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Days Remaining:</span>
                    <span className="font-bold">
                      {data.dbsCheck.daysRemaining !== undefined
                        ? `${data.dbsCheck.daysRemaining} days`
                        : "-"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Training */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Training Records
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(data.training).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getTrainingStatusIcon(value.status)}
                        <div>
                          <span className="font-medium capitalize">{key}</span>
                          <p className="text-sm text-muted-foreground">
                            {value.date || "-"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="uppercase">
                        {value.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Documents Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents & Evidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-dashed border-muted-foreground rounded-lg text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">DBS Certificate</p>
                    <p className="text-xs text-muted-foreground">
                      PDF • 1.2 MB
                    </p>
                  </div>
                  <div className="p-4 border border-dashed border-muted-foreground rounded-lg text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Training Certificates</p>
                    <p className="text-xs text-muted-foreground">
                      PDF • 856 KB
                    </p>
                  </div>
                  <div className="p-4 border border-dashed border-muted-foreground rounded-lg text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">References</p>
                    <p className="text-xs text-muted-foreground">
                      PDF • 2.1 MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
