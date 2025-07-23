import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import axios from "axios";

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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { toast } from "react-hot-toast";
import api from "@/services/apiService";

function DatePicker({
  date,
  onDateChange,
  placeholder,
}: {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  placeholder: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
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
}

interface AddAuditChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChecklistAdded?: () => void;
}

export function AddAuditChecklistModal({
  open,
  onOpenChange,
  onChecklistAdded,
}: AddAuditChecklistModalProps) {
  const [form, setForm] = useState({
    category: "",
    item: "",
    status: "inprogress",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
    evidence: [] as string[],
    comments: "",
  });

  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [staffList, setStaffList] = useState([]);
  const [evidenceInput, setEvidenceInput] = useState("");

  useEffect(() => {
    api.get("/staff").then((res) => setStaffList(res.data.staff));
  }, []);

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
      await api.post("/audit-checklist", form);
      toast.success("Audit checklist added");
      onOpenChange(false);
      if (onChecklistAdded) onChecklistAdded();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add checklist");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-xl max-h-[650px] overflow-y-auto p-6 rounded-xl shadow-lg"
        style={{ overscrollBehavior: "contain" }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Audit Checklist</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Checklist Title */}
          <div>
            <label className="text-sm font-medium">Checklist Title</label>
            <Input
              placeholder="E.g. Fire Extinguisher Inspection"
              value={form.item}
              onChange={(e) => handleChange("item", e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium">Category</label>
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
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select
                value={form.status}
                onValueChange={(val) => handleChange("status", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {["Complete", "Incomplete", "In Progress", "Overdue"].map((s) => (
                    <SelectItem key={s.toLowerCase()} value={s.toLowerCase()}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={form.priority}
                onValueChange={(val) => handleChange("priority", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  {["High", "Medium", "Low"].map((p) => (
                    <SelectItem key={p.toLowerCase()} value={p.toLowerCase()}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium">Due Date</label>
            <DatePicker
              date={dueDate}
              onDateChange={(date) => {
                setDueDate(date);
                handleChange("dueDate", date?.toISOString() || "");
              }}
              placeholder="Pick a due date"
            />
          </div>

          {/* Assigned Staff */}
          <div>
            <label className="text-sm font-medium">Assign To</label>
            <Select
              value={form.assignedTo}
              onValueChange={(val) => handleChange("assignedTo", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Staff" />
              </SelectTrigger>
              <SelectContent>
                {staffList?.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Evidence Files */}
          <div>
            <label className="text-sm font-medium">Evidence Files</label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. fire-report.pdf"
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

          {/* Comments */}
          <div>
            <label className="text-sm font-medium">Comments</label>
            <Textarea
              placeholder="Optional remarks..."
              value={form.comments}
              onChange={(e) => handleChange("comments", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button className="w-full" onClick={handleSubmit}>
            Submit Checklist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
