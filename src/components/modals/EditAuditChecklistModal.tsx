import React, { useEffect, useState } from "react";
import api from "@/services/apiService";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface EditAuditChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checklistId: string;
  onChecklistUpdated?: () => void;
}

export function EditAuditChecklistModal({
  open,
  onOpenChange,
  checklistId,
  onChecklistUpdated,
}: EditAuditChecklistModalProps) {
  const [form, setForm] = useState({
    category: "",
    item: "",
    status: "inprogress",
    priority: "medium",
    dueDate: "",
    assignedTo: "", // <- updated
    evidence: [] as string[],
    comments: "",
  });

  const [evidenceInput, setEvidenceInput] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checklistId) return;

    const fetchData = async () => {
      try {
        const [checklistRes, staffRes] = await Promise.all([
          api.get(`/audit-checklist/${checklistId}`),
          api.get("/staff"),
        ]);
        const checklist = checklistRes.data.checklistItem;

        setForm({
          category: checklist.category,
          item: checklist.item,
          status: checklist.status,
          priority: checklist.priority,
          dueDate: checklist.dueDate || "",
          assignedTo: checklist.assignedTo ?? "",
          evidence: checklist.evidence || [],
          comments: checklist.comments || "",
        });

        setStaffList(staffRes.data.staff || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load checklist");
        setLoading(false);
      }
    };

    fetchData();
  }, [checklistId]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddEvidence = () => {
    if (evidenceInput.trim()) {
      setForm((prev) => ({
        ...prev,
        evidence: [...prev.evidence, evidenceInput.trim()],
      }));
      setEvidenceInput("");
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        category: form.category,
        item: form.item,
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate,
        assignedTo: form.assignedTo,
        evidence: form.evidence,
        comments: form.comments,
      };

      await api.put(`/audit-checklist/${checklistId}`, payload);

      toast.success("Audit checklist updated");
      onOpenChange(false);
      if (onChecklistUpdated) onChecklistUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update checklist");
    }
  };

  const parsedDate = form.dueDate ? new Date(form.dueDate) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Audit Checklist</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <div className="space-y-4">
            <Input
              placeholder="Item Title"
              value={form.item}
              onChange={(e) => handleChange("item", e.target.value)}
            />

            <Select
              value={form.category}
              onValueChange={(val) => handleChange("category", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Safeguarding",
                  "Behavior Management",
                  "Staff Recruitment",
                  "Health & Safety",
                  "Leadership and Management",
                ].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Select
                value={form.status}
                onValueChange={(val) => handleChange("status", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {["complete", "incomplete", "inprogress", "overdue"].map(
                    (s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <Select
                value={form.priority}
                onValueChange={(val) => handleChange("priority", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  {["high", "medium", "low"].map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {parsedDate ? format(parsedDate, "PPP") : "Select Due Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parsedDate || undefined}
                  onSelect={(date) =>
                    handleChange("dueDate", date?.toISOString() || "")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select
              value={form.assignedTo}
              onValueChange={(val) => handleChange("assignedTo", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Assign To Staff" />
              </SelectTrigger>
              <SelectContent>
                {staffList?.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <div className="flex gap-2">
                <Input
                  placeholder="Evidence File Name"
                  value={evidenceInput}
                  onChange={(e) => setEvidenceInput(e.target.value)}
                />
                <Button variant="outline" onClick={handleAddEvidence}>
                  Add
                </Button>
              </div>
              <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                {form.evidence.map((ev, idx) => (
                  <li key={idx}>{ev}</li>
                ))}
              </ul>
            </div>

            <Textarea
              placeholder="Comments (optional)"
              value={form.comments}
              onChange={(e) => handleChange("comments", e.target.value)}
            />
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
