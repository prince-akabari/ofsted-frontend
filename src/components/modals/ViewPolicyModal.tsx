import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  CalendarDays,
  ShieldCheck,
  Layers3,
  Users2,
  FileCheck2,
  Info,
  BookOpen,
  EyeIcon,
} from "lucide-react";
import { format } from "date-fns";
import api from "@/services/apiService";
import { useEffect } from "react";
import { hasRole } from "@/lib/utils";

export default function ViewPolicyModal({
  isOpen,
  onClose,
  policy,
  onUpdatePolicy,
}) {
  if (!policy) return null;

  useEffect(() => {
    if (hasRole(["staff"])) {
      const acknowledgePolicy = async () => {
        if (
          policy?.id &&
          isOpen &&
          policy.acknowledgements !== policy.assignedStaff.length
        ) {
          try {
            await api.post(`/policy/${policy.id}/acknowledge`);
            onUpdatePolicy();
          } catch (error) {
            console.error("Failed to acknowledge policy:", error);
          }
        }
      };

      acknowledgePolicy();
    }
  }, [isOpen, policy]);

  const baseURL = `${import.meta.env.VITE_BACKEND_URL}/documents/policies/`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[75vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Policy Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[52vh] pr-2">
          <div className="space-y-4 text-sm text-foreground">
            {/* Title */}
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Title:</span>
              <span>{policy.title}</span>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Category:</span>
              <Badge
                variant="outline"
                className="text-xs bg-blue-50 border-primary-500 text-primary-600"
              >
                {policy.category}
              </Badge>
            </div>

            {/* Version */}
            <div className="flex items-center gap-2">
              <Layers3 className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Version:</span>
              <span>{policy.version}</span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Status:</span>
              <Badge
                variant={
                  policy.status === "high"
                    ? "destructive"
                    : policy.status === "medium"
                    ? "secondary"
                    : "outline"
                }
                className="capitalize"
              >
                {policy.status}
              </Badge>
            </div>

            {/* Created At */}
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Created At:</span>
              <span>{format(new Date(policy.createdAt), "PPP")}</span>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Last Updated:</span>
              <span>{format(new Date(policy.lastUpdated), "PPP")}</span>
            </div>

            {/* Document */}
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Document:</span>
              <Badge
                variant="outline"
                className="mt-1 text-xs bg-blue-50 border-gray-500 text-gray-600"
              >
                <a
                  href={`${baseURL}${policy.document}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-1"
                >
                  <EyeIcon className="w-4 h-4" />
                  {policy.document}
                </a>
              </Badge>
            </div>

            {/* Assigned Staff */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users2 className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Assigned Staff:</span>
              </div>
              <div className="space-y-2">
                {policy.assignedStaff?.map((staff) => (
                  <div
                    key={staff.id}
                    className="p-3 bg-muted rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {staff.email}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {staff.role}
                      </Badge>
                      <Badge
                        variant={
                          staff.status === "Pending" ? "destructive" : "default"
                        }
                        className="text-xs capitalize"
                      >
                        {staff.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
