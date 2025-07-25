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
      <DialogContent className="max-w-3xl max-h-[72vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Policy Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[49vh] pr-2">
          <div className="space-y-6 text-sm text-foreground">
            {/* Title and Category */}
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                {policy.title}
                <Badge
                  variant="outline"
                  className="mt-1 text-xs bg-blue-50 border-primary-500 text-primary-600"
                >
                  {policy.category}
                </Badge>
              </h2>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Layers3 className="w-4 h-4" /> Version
                </p>
                <p>{policy.version}</p>
              </div>

              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Info className="w-4 h-4" /> Status
                </p>
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

              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" /> Last Updated
                </p>
                <p>{format(new Date(policy.lastUpdated), "PPP")}</p>
              </div>

              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" /> Created At
                </p>
                <p>{format(new Date(policy.createdAt), "PPP")}</p>
              </div>
            </div>

            {/* Document */}
            <div>
              <p className="text-muted-foreground mb-1 flex items-center gap-1">
                <FileCheck2 className="w-4 h-4" /> Document
              </p>
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
                </a>{" "}
              </Badge>
            </div>

            {/* Assigned Staff */}
            <div>
              <p className="font-medium mb-2 flex items-center gap-2">
                <Users2 className="w-4 h-4 text-muted-foreground" />
                Assigned Staff
              </p>
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
