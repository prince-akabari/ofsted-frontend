import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import api from "@/services/apiService";

interface AddStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStaffAdded: () => void; // Fetch list again
}

export function AddStaffModal({
  open,
  onOpenChange,
  onStaffAdded,
}: AddStaffModalProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    dbsExpiryDate: null as Date | null,
    safeguardingDate: null as Date | null,
    firstAidDate: null as Date | null,
    medicationDate: null as Date | null,
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.role || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name,
      role: formData.role,
      email: formData.email,
      status: "warning",
      dbsCheckStatus: formData.dbsExpiryDate ? "valid" : "expired",
      dbsExpiryDate: formData.dbsExpiryDate?.toISOString() || null,
      trainingSafeguardingStatus: formData.safeguardingDate
        ? "complete"
        : "pending",
      trainingSafeguardingDate:
        formData.safeguardingDate?.toISOString() || null,
      trainingFirstAidStatus: formData.firstAidDate ? "complete" : "pending",
      trainingFirstAidDate: formData.firstAidDate?.toISOString() || null,
      trainingMedicationStatus: formData.medicationDate
        ? "complete"
        : "pending",
      trainingMedicationDate: formData.medicationDate?.toISOString() || null,
    };

    try {
      await api.post("/staff", payload);
      toast.success("Staff member added successfully");
      onOpenChange(false);
      onStaffAdded();

      // Reset form
      setFormData({
        name: "",
        role: "",
        email: "",
        dbsExpiryDate: null,
        safeguardingDate: null,
        firstAidDate: null,
        medicationDate: null,
      });
    } catch (err: any) {
      const message = err.response?.data?.error || "Failed to add staff member";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Staff Member
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home Manager">HOME MANAGER</SelectItem>
                  <SelectItem value="Deputy Manager">DEPUTY MANAGER</SelectItem>
                  <SelectItem value="Care Worker">CARE WORKER</SelectItem>
                  <SelectItem value="Support Worker">SUPPORT WORKER</SelectItem>
                  <SelectItem value="Night Staff">NIGHT STAFF</SelectItem>
                  <SelectItem value="Relief Staff">RELIEF STAFF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* DBS */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">DBS Check</h3>
            <div className="space-y-2">
              <Label>DBS Expiry Date</Label>
              <DatePicker
                date={formData.dbsExpiryDate}
                onDateChange={(date) =>
                  setFormData({ ...formData, dbsExpiryDate: date })
                }
                placeholder="Select DBS expiry date"
              />
            </div>
          </div>

          {/* Training */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Training Records</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Safeguarding Training</Label>
                <DatePicker
                  date={formData.safeguardingDate}
                  onDateChange={(date) =>
                    setFormData({ ...formData, safeguardingDate: date })
                  }
                  placeholder="Completion date"
                />
              </div>
              <div className="space-y-2">
                <Label>First Aid Training</Label>
                <DatePicker
                  date={formData.firstAidDate}
                  onDateChange={(date) =>
                    setFormData({ ...formData, firstAidDate: date })
                  }
                  placeholder="Completion date"
                />
              </div>
              <div className="space-y-2">
                <Label>Medication Training</Label>
                <DatePicker
                  date={formData.medicationDate}
                  onDateChange={(date) =>
                    setFormData({ ...formData, medicationDate: date })
                  }
                  placeholder="Completion date"
                />
              </div>
            </div>
          </div>
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
            {loading ? "Adding..." : "Add Staff Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
