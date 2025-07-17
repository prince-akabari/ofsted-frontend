import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, Users, Calendar, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/services/apiService";

interface UploadPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPolicy: () => void;
}

export function UploadPolicyModal({
  open,
  onOpenChange,
  onAddPolicy,
}: UploadPolicyModalProps) {
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [policyData, setPolicyData] = useState({
    title: "",
    category: "",
    version: "",
    description: "",
    file: null as File | null,
    assignToAll: false,
    selectedStaff: [] as string[],
    reviewDate: "",
    priority: "medium",
  });

  const policyCategories = [
    "Safeguarding & Protection",
    "Daily Living & Care",
    "Staffing & HR",
    "Health & Safety",
    "Behavior Management",
    "Education & Development",
    "Finance & Administration",
    "Regulatory Compliance",
  ];

  useEffect(() => {
    api
      .get("/staff")
      .then((res) => setStaffMembers(res.data.staff))
      .catch((err) => console.error("Failed to fetch staff:", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        toast.error("File size must be less than 25MB");
        return;
      }

      // Check file type
      const allowedTypes = [".pdf", ".doc", ".docx"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        toast.error("Please upload PDF, DOC, or DOCX files only");
        return;
      }

      setPolicyData({ ...policyData, file });
    }
  };

  const handleStaffSelection = (staffId: string, checked: boolean) => {
    if (checked) {
      setPolicyData({
        ...policyData,
        selectedStaff: [...policyData.selectedStaff, staffId],
      });
    } else {
      setPolicyData({
        ...policyData,
        selectedStaff: policyData.selectedStaff.filter((id) => id !== staffId),
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (
        !policyData.title ||
        !policyData.category ||
        !policyData.version ||
        !policyData.file
      ) {
        toast.error("Please fill in all required fields and upload a file");
        return;
      }

      const formData = new FormData();
      formData.append("title", policyData.title);
      formData.append("category", policyData.category);
      formData.append("version", policyData.version);
      formData.append("document", policyData.file);
      formData.append("description", policyData.description || "");
      formData.append("priority", policyData.priority || "medium");
      formData.append("reviewDate", policyData.reviewDate || "");
      formData.append("assignToAll", policyData.assignToAll.toString());
      console.log(policyData);
      const assignedStaff = policyData.assignToAll
        ? staffMembers?.map((s) => s)
        : policyData.selectedStaff;

      assignedStaff.forEach((id) => {
        formData.append("assignedStaff[]", id);
      });

      const response = await api.post("/policy", formData);

      if (!response) {
        throw new Error("Failed to upload policy");
      }

      const result = await response.data;
      onAddPolicy(); // Update UI with new policy if needed
      toast.success("Policy uploaded successfully");

      setPolicyData({
        title: "",
        category: "",
        version: "",
        description: "",
        file: null,
        assignToAll: false,
        selectedStaff: [],
        reviewDate: "",
        priority: "medium",
      });

      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload policy");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Policy Document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Policy Title *</Label>
                  <Input
                    id="title"
                    value={policyData.title}
                    onChange={(e) =>
                      setPolicyData({ ...policyData, title: e.target.value })
                    }
                    placeholder="e.g., Safeguarding and Child Protection Policy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version *</Label>
                  <Input
                    id="version"
                    value={policyData.version}
                    onChange={(e) =>
                      setPolicyData({ ...policyData, version: e.target.value })
                    }
                    placeholder="e.g., 2.1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={policyData.category}
                    onValueChange={(value) =>
                      setPolicyData({ ...policyData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {policyCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select
                    value={policyData.priority}
                    onValueChange={(value) =>
                      setPolicyData({ ...policyData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">HIGH PRIORITY</SelectItem>
                      <SelectItem value="medium">MEDIUM PRIORITY</SelectItem>
                      <SelectItem value="low">LOW PRIORITY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={policyData.description}
                  onChange={(e) =>
                    setPolicyData({
                      ...policyData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of the policy and its purpose..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewDate">Review Date</Label>
                <Input
                  id="reviewDate"
                  type="date"
                  value={policyData.reviewDate}
                  onChange={(e) =>
                    setPolicyData({ ...policyData, reviewDate: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Document Upload
              </h3>

              <div className="space-y-2">
                <Label htmlFor="file">Select Policy Document *</Label>
                <div className="border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      Click to upload policy document
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      PDF, DOC, DOCX files only (Max 25MB)
                    </p>
                    {policyData.file && (
                      <div className="mt-4 p-4 bg-muted rounded-lg flex items-center justify-center gap-3">
                        <FileText className="h-6 w-6 text-primary" />
                        <div className="text-left">
                          <p className="font-medium">{policyData.file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(policyData.file.size)} •{" "}
                            {policyData.file.type}
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Document Requirements:</p>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li>• File must be in PDF, DOC, or DOCX format</li>
                      <li>• Maximum file size: 25MB</li>
                      <li>
                        • Document should be properly formatted and readable
                      </li>
                      <li>• Include version number in the document</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staff Assignment */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Assignment
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="assignToAll"
                    checked={policyData.assignToAll}
                    onCheckedChange={(checked) =>
                      setPolicyData({
                        ...policyData,
                        assignToAll: checked as boolean,
                        selectedStaff: checked
                          ? staffMembers?.map((s) => s.id)
                          : [],
                      })
                    }
                  />
                  <Label htmlFor="assignToAll" className="text-sm font-medium">
                    Assign to all staff members
                  </Label>
                </div>

                {!policyData.assignToAll && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Select individual staff members:
                    </Label>
                    <div className="space-y-3">
                      {staffMembers?.map((staff) => (
                        <div
                          key={staff.id}
                          className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"
                        >
                          <Checkbox
                            id={`staff-${staff.id}`}
                            checked={policyData.selectedStaff.includes(
                              staff.id
                            )}
                            onCheckedChange={(checked) =>
                              handleStaffSelection(staff.id, checked as boolean)
                            }
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`staff-${staff.id}`}
                              className="font-medium"
                            >
                              {staff.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {staff.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {policyData.assignToAll
                      ? `This policy will be assigned to all ${staffMembers?.length} staff members.`
                      : `This policy will be assigned to ${policyData.selectedStaff.length} selected staff member(s).`}{" "}
                    Staff will receive notifications to acknowledge this policy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Schedule */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Review & Compliance
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Automatic Review Reminder</Label>
                  <Select defaultValue="annual">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">MONTHLY</SelectItem>
                      <SelectItem value="quarterly">QUARTERLY</SelectItem>
                      <SelectItem value="biannual">BI-ANNUAL</SelectItem>
                      <SelectItem value="annual">ANNUAL</SelectItem>
                      <SelectItem value="custom">CUSTOM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Acknowledgment Deadline</Label>
                  <Select defaultValue="30days">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">7 DAYS</SelectItem>
                      <SelectItem value="14days">14 DAYS</SelectItem>
                      <SelectItem value="30days">30 DAYS</SelectItem>
                      <SelectItem value="60days">60 DAYS</SelectItem>
                      <SelectItem value="90days">90 DAYS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Policy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
