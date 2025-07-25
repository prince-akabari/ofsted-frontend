import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewPdfModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentUrl: string; // Full PDF URL
  title?: string;
}

export function ViewPdfModal({
  open,
  onOpenChange,
  documentUrl,
  title = "Document Viewer",
}: ViewPdfModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        {/* PDF Viewer */}
        <div className="flex-1 w-full h-full px-6 pb-4">
          <iframe
            src={documentUrl}
            title="PDF Viewer"
            className="w-full h-[70vh] rounded-md border"
          />
        </div>

        <DialogFooter className="px-6 pb-6 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
