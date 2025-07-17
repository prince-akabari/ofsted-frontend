import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, X, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { StaffMember } from "@/data/dummyData";

interface UploadDocumentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember | null;
}

export function UploadDocumentsModal({ open, onOpenChange, staff }: UploadDocumentsModalProps) {
  const [uploadData, setUploadData] = useState({
    documentType: "",
    file: null as File | null,
    expiryDate: "",
    notes: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
  }>>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      
      // Check file type
      const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        toast.error("Please upload PDF, DOC, DOCX, JPG, JPEG, or PNG files only");
        return;
      }
      
      setUploadData({ ...uploadData, file });
    }
  };

  const handleUpload = () => {
    if (!uploadData.documentType || !uploadData.file) {
      toast.error("Please select document type and file");
      return;
    }

    const newFile = {
      id: Date.now().toString(),
      name: uploadData.file.name,
      type: uploadData.documentType,
      size: (uploadData.file.size / 1024 / 1024).toFixed(2) + " MB",
      uploadDate: new Date().toLocaleDateString(),
    };

    setUploadedFiles([...uploadedFiles, newFile]);
    toast.success("Document uploaded successfully");
    
    // Reset form
    setUploadData({
      documentType: "",
      file: null,
      expiryDate: "",
      notes: "",
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
    toast.success("Document removed");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents - {staff.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Upload Form */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type *</Label>
                  <Select 
                    value={uploadData.documentType} 
                    onValueChange={(value) => setUploadData({ ...uploadData, documentType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dbs-certificate">DBS CERTIFICATE</SelectItem>
                      <SelectItem value="safeguarding-training">SAFEGUARDING TRAINING</SelectItem>
                      <SelectItem value="first-aid-training">FIRST AID TRAINING</SelectItem>
                      <SelectItem value="medication-training">MEDICATION TRAINING</SelectItem>
                      <SelectItem value="reference">REFERENCE</SelectItem>
                      <SelectItem value="contract">EMPLOYMENT CONTRACT</SelectItem>
                      <SelectItem value="cv">CV/RESUME</SelectItem>
                      <SelectItem value="other">OTHER</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={uploadData.expiryDate}
                    onChange={(e) => setUploadData({ ...uploadData, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Select File *</Label>
                <div className="border-2 border-dashed border-muted-foreground rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload file</p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB)
                    </p>
                    {uploadData.file && (
                      <div className="mt-2 p-2 bg-muted rounded flex items-center justify-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{uploadData.file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({formatFileSize(uploadData.file.size)})
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={uploadData.notes}
                  onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
                  placeholder="Add any additional notes about this document..."
                  rows={3}
                />
              </div>

              <Button onClick={handleUpload} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </CardContent>
          </Card>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Uploaded Documents</h3>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-success" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {file.type.toUpperCase()} • {file.size} • Uploaded on {file.uploadDate}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing Documents */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Existing Documents</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">DBS Certificate</p>
                      <p className="text-sm text-muted-foreground">
                        PDF • 1.2 MB • Expires: {new Date(staff.dbsCheck.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Training Certificates</p>
                      <p className="text-sm text-muted-foreground">PDF • 856 KB • Last updated: 15/03/2024</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
