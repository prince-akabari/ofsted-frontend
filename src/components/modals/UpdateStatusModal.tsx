import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import api from "@/services/apiService";

interface Staff {
  id: string;
  name: string;
  status: string;
  dbsCheckStatus: string;
  dbsExpiryDate: string;
  trainingSafeguardingStatus: string;
  trainingSafeguardingDate: string;
  trainingFirstAidStatus: string;
  trainingFirstAidDate: string;
  trainingMedicationStatus: string;
  trainingMedicationDate: string;
}

interface UpdateStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff;
  onUpdateStaff: () => void;
}

export function UpdateStatusModal({
  open,
  onOpenChange,
  staff,
  onUpdateStaff,
}: UpdateStatusModalProps) {
  if (!staff) return null;
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: staff?.status || "warning",
    dbsStatus: staff?.dbsCheckStatus,
    dbsExpiryDate: new Date(staff.dbsExpiryDate),
    safeguardingStatus: staff.trainingSafeguardingStatus,
    safeguardingDate: new Date(staff.trainingSafeguardingDate),
    firstAidStatus: staff.trainingFirstAidStatus,
    firstAidDate: new Date(staff.trainingFirstAidDate),
    medicationStatus: staff.trainingMedicationStatus,
    medicationDate: new Date(staff.trainingMedicationDate),
    notes: "",
  });

  useEffect(() => {
    if (staff && open) {
      setUpdateData({
        status: staff.status || "warning",
        dbsStatus: staff.dbsCheckStatus,
        dbsExpiryDate: new Date(staff.dbsExpiryDate),
        safeguardingStatus: staff.trainingSafeguardingStatus,
        safeguardingDate: new Date(staff.trainingSafeguardingDate),
        firstAidStatus: staff.trainingFirstAidStatus,
        firstAidDate: new Date(staff.trainingFirstAidDate),
        medicationStatus: staff.trainingMedicationStatus,
        medicationDate: new Date(staff.trainingMedicationDate),
        notes: "",
      });
    }
  }, [staff, open]);

  const DatePicker = ({
    date,
    onDateChange,
    placeholder,
  }: {
    date: Date | null;
    onDateChange: (date: Date | null) => void;
    placeholder: string;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );

  const getStatusIcon = (status: string) => {
    if (status === "complete" || status === "valid" || status === "compliant")
      return <CheckCircle className="text-green-500 h-4 w-4" />;
    if (status === "pending" || status === "expiring" || status === "warning")
      return <Clock className="text-yellow-500 h-4 w-4" />;
    return <AlertTriangle className="text-red-500 h-4 w-4" />;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.put(`/staff/${staff.id}`, {
        status: updateData.status,
        dbsCheckStatus: updateData.dbsStatus,
        dbsExpiryDate: updateData.dbsExpiryDate,
        trainingSafeguardingStatus: updateData.safeguardingStatus,
        trainingSafeguardingDate: updateData.safeguardingDate,
        trainingFirstAidStatus: updateData.firstAidStatus,
        trainingFirstAidDate: updateData.firstAidDate,
        trainingMedicationStatus: updateData.medicationStatus,
        trainingMedicationDate: updateData.medicationDate,
        notes: updateData.notes,
      });
      onOpenChange(false);
      onUpdateStaff();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Update Status - {staff.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Overall Status */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium">Overall Staff Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Current: {staff.status.toUpperCase()}</Label>
                  <Select
                    value={updateData.status}
                    onValueChange={(value) =>
                      setUpdateData({ ...updateData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliant">COMPLIANT</SelectItem>
                      <SelectItem value="warning">WARNING</SelectItem>
                      <SelectItem value="overdue">OVERDUE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Badge */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Current Status Badge</h3>
              <div className="flex items-center gap-4">
                <Badge
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    staff.status === "compliant"
                      ? "bg-green-500 text-white"
                      : staff.status === "warning"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                  )}
                >
                  {staff.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Last updated: {format(new Date(), "dd/MM/yyyy")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* DBS */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                {getStatusIcon(staff.dbsCheckStatus)}
                DBS Check
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    Current Status: {staff.dbsCheckStatus.toUpperCase()}
                  </Label>
                  <Select
                    value={updateData.dbsStatus}
                    onValueChange={(value) =>
                      setUpdateData({ ...updateData, dbsStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="valid">VALID</SelectItem>
                      <SelectItem value="expiring">EXPIRING</SelectItem>
                      <SelectItem value="expired">EXPIRED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <DatePicker
                    date={updateData.dbsExpiryDate}
                    onDateChange={(date) =>
                      setUpdateData({ ...updateData, dbsExpiryDate: date })
                    }
                    placeholder="Update expiry date"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training */}
          {[
            {
              label: "Safeguarding",
              status: updateData.safeguardingStatus,
              date: updateData.safeguardingDate,
              key: "safeguarding",
            },
            {
              label: "First Aid",
              status: updateData.firstAidStatus,
              date: updateData.firstAidDate,
              key: "firstAid",
            },
            {
              label: "Medication",
              status: updateData.medicationStatus,
              date: updateData.medicationDate,
              key: "medication",
            },
          ].map((item) => (
            <Card key={item.key}>
              <CardContent className="pt-6 space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  {item.label} Training
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Current: {item.status.toUpperCase()}</Label>
                    <Select
                      value={item.status}
                      onValueChange={(value) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          [`${item.key}Status`]: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complete">COMPLETE</SelectItem>
                        <SelectItem value="expired">EXPIRED</SelectItem>
                        <SelectItem value="pending">PENDING</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Completion Date</Label>
                    <DatePicker
                      placeholder="Select completion date"
                      date={item.date}
                      onDateChange={(date) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          [`${item.key}Date`]: date,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Notes */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium">Update Notes</h3>
              <Textarea
                value={updateData.notes}
                onChange={(e) =>
                  setUpdateData({ ...updateData, notes: e.target.value })
                }
                placeholder="Add notes about this status update..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
