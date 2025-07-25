import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/services/apiService";

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

interface UploadEvidenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auditId: string;
  initialEvidence: FileData[]; // from parent
}

interface FileData {
  name: string;
  size: number;
  type: string;
  file?: File; // Optional for server-loaded files
}

export function UploadEvidenceModal({
  open,
  onOpenChange,
  auditId,
  initialEvidence = [],
}: UploadEvidenceModalProps) {
  const [files, setFiles] = useState<FileData[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFiles(initialEvidence || []);
  }, [initialEvidence, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: FileData[] = [];

    Array.from(selectedFiles).forEach((file) => {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        toast.error("Only PDF files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      if (files.length + newFiles.length >= 3) {
        toast.error("Only up to 3 files allowed");
        return;
      }

      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      });
    });

    setFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = ""; // reset input
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    const formData = new FormData();
    files.forEach((f) => {
      if (f.file) formData.append("evidence", f.file); // Only send if it's a File
    });

    try {
      await api.post(`/audit-checklist/${auditId}/evidence`, formData);
      toast.success("Evidence uploaded successfully");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload evidence");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Evidence</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="file">Select Evidence Files *</Label>
          <div className="border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input
              id="file"
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file" className="cursor-pointer block">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                Click to upload PDF files
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                PDF files only (Max 5MB each, 3 files total)
              </p>
            </label>

            {files.length > 0 && (
              <div className="mt-4 space-y-3">
                {files.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-muted rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">
                          {typeof f === "string" ? f : f.name}
                        </p>
                        {typeof f === "string" ? (
                          <p className="text-sm text-muted-foreground text-gray-600">
                            Previously uploaded
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(f.size)} • {f.type}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(idx)}
                    >
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Upload Evidence</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
