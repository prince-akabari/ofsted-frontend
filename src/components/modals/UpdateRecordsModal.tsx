// UpdateRecordsModal.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import api from "@/services/apiService";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

function DatePicker({
  date,
  onDateChange,
  placeholder,
}: {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${
            !date && "text-muted-foreground"
          }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={(selectedDate) => {
            onDateChange(selectedDate);
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default function UpdateRecordsModal({
  isOpen,
  onClose,
  staff,
  onSuccess,
}) {
  const [trainingCertificates, setTrainingCertificates] = useState([
    { title: "", date: "" },
  ]);
  const [employmentHistory, setEmploymentHistory] = useState([
    { company: "", from: "", to: "", role: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (staff) {
      setTrainingCertificates(
        staff.trainingCertificates?.length
          ? staff.trainingCertificates.map((item) => ({
              title: item.title || "",
              date: item.date || "",
            }))
          : [{ title: "", date: "" }]
      );

      setEmploymentHistory(
        staff.employmentHistory?.length
          ? staff.employmentHistory.map((item) => ({
              company: item.company || "",
              from: item.from || "",
              to: item.to || "",
              role: item.role || "",
            }))
          : [{ company: "", from: "", to: "", role: "" }]
      );
    }
  }, [staff]);

  const addTraining = () => {
    if (trainingCertificates.length < 3)
      setTrainingCertificates([
        ...trainingCertificates,
        { title: "", date: "" },
      ]);
  };

  const removeTraining = (idx) => {
    const updated = [...trainingCertificates];
    updated.splice(idx, 1);
    setTrainingCertificates(updated);
  };

  const addEmployment = () => {
    if (employmentHistory.length < 3)
      setEmploymentHistory([
        ...employmentHistory,
        { company: "", from: "", to: "", role: "" },
      ]);
  };

  const removeEmployment = (idx) => {
    const updated = [...employmentHistory];
    updated.splice(idx, 1);
    setEmploymentHistory(updated);
  };

  const handleSubmit = async () => {
    const isValidTraining = trainingCertificates.every(
      (item) => item.title && item.date
    );
    const isValidEmployment = employmentHistory.every(
      (item) => item.company && item.from && item.to && item.role
    );

    if (!isValidTraining || !isValidEmployment) {
      toast.error("Please complete all required fields in each section.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/staff/${staff?.id}/update-records`, {
        trainingCertificates,
        employmentHistory,
      });
      toast.success("Records updated successfully!");
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update records");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-6">
        <DialogHeader>
          <DialogTitle>Update Staff Records</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh] pr-2 space-y-8">
          {/* Training Certificates */}
          <div>
            <h4 className="font-semibold mb-2">Training Certificates</h4>
            {trainingCertificates.map((item, idx) => (
              <div
                key={idx}
                className="flex items-end gap-2 mb-3 bg-muted p-3 rounded-lg"
              >
                <div className="flex-1">
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...trainingCertificates];
                      updated[idx].title = e.target.value;
                      setTrainingCertificates(updated);
                    }}
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <DatePicker
                    date={item.date ? new Date(item.date) : null}
                    onDateChange={(date) => {
                      const updated = [...trainingCertificates];
                      updated[idx].date = date ? date.toISOString() : "";
                      setTrainingCertificates(updated);
                    }}
                    placeholder="Select date"
                  />
                </div>
                {trainingCertificates.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTraining(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {trainingCertificates.length < 3 && (
              <Button variant="outline" size="sm" onClick={addTraining}>
                <Plus className="w-4 h-4 mr-1" /> Add Training
              </Button>
            )}
          </div>

          {/* Employment History */}
          <div>
            <h4 className="font-semibold mb-2">Employment History</h4>
            {employmentHistory.map((item, idx) => (
              <div key={idx} className="bg-muted p-3 rounded-lg space-y-2 mb-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={item.company}
                      onChange={(e) => {
                        const updated = [...employmentHistory];
                        updated[idx].company = e.target.value;
                        setEmploymentHistory(updated);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input
                      value={item.role}
                      onChange={(e) => {
                        const updated = [...employmentHistory];
                        updated[idx].role = e.target.value;
                        setEmploymentHistory(updated);
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>From</Label>
                    <DatePicker
                      date={item.from ? new Date(item.from) : null}
                      onDateChange={(date) => {
                        const updated = [...employmentHistory];
                        updated[idx].from = date ? date.toISOString() : "";
                        setEmploymentHistory(updated);
                      }}
                      placeholder="Select month"
                    />
                  </div>
                  <div>
                    <Label>To</Label>
                    <DatePicker
                      date={item.to ? new Date(item.to) : null}
                      onDateChange={(date) => {
                        const updated = [...employmentHistory];
                        updated[idx].to = date ? date.toISOString() : "";
                        setEmploymentHistory(updated);
                      }}
                      placeholder="Select month"
                    />
                  </div>
                </div>
                {employmentHistory.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEmployment(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {employmentHistory.length < 3 && (
              <Button variant="outline" size="sm" onClick={addEmployment}>
                <Plus className="w-4 h-4 mr-1" /> Add Employment
              </Button>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6 justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
