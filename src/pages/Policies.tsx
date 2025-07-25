import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Upload, Download, Users, Calendar } from "lucide-react";
import { UploadPolicyModal } from "@/components/modals/UploadPolicyModal";
import api from "@/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";
import { hasRole } from "@/lib/utils";
import ViewPolicyModal from "@/components/modals/ViewPolicyModal";

const policyCategories = [
  "All Categories",
  "Safeguarding & Protection",
  "Health & Wellbeing",
  "Daily Living & Care",
  "Staffing & HR",
  "Education & Activities",
  "Emergency & Risk",
];

export default function Policies() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [uploadPolicyOpen, setUploadPolicyOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const handleView = (policy) => {
    setSelectedPolicy(policy);
    setViewOpen(true);
  };
  // Load policies on mount
  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    setLoading(true);
    await api
      .get("/policy")
      .then((res) => setPolicies(res.data.policies))
      .catch((err) => console.error("Failed to fetch policies:", err));
    setLoading(false);
  };

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      policy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: any["status"]) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "low":
        return `${baseClasses} bg-success text-success-foreground`;
      case "medium":
        return `${baseClasses} bg-warning text-warning-foreground`;
      case "high":
        return `${baseClasses} bg-destructive text-destructive-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const getStatusText = (status: any["status"]) => {
    switch (status) {
      case "low":
        return "LOW PRIORITY";
      case "medium":
        return "MEDIUM PRIORITY";
      case "high":
        return "HIGH PRIORITY";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Policies & Documents
          </h1>
          <p className="text-muted-foreground">
            Manage policies, procedures, and essential documents
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <Input
              placeholder="Search policies and documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {policyCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {hasRole(["admin"]) && (
            <Button
              className="flex items-center gap-2"
              onClick={() => setUploadPolicyOpen(true)}
            >
              <Upload className="h-4 w-4" />
              Upload Policy
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {!loading ? (
            <>
              <Card className="p-4 h-[120px] text-center">
                <div className="text-2xl font-bold text-foreground">
                  {policies.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Policies
                </div>
              </Card>
              <Card className="p-4 h-[120px] text-center">
                <div className="text-2xl font-bold text-success">
                  {policies.filter((p) => p.status === "current").length}
                </div>
                <div className="text-sm text-muted-foreground">Current</div>
              </Card>
              <Card className="p-4 h-[120px] text-center">
                <div className="text-2xl font-bold text-warning">
                  {policies.filter((p) => p.status === "review-needed").length}
                </div>
                <div className="text-sm text-muted-foreground">Need Review</div>
              </Card>
              <Card className="p-4 h-[120px] text-center">
                <div className="text-2xl font-bold text-destructive">
                  {policies.filter((p) => p.status === "expired").length}
                </div>
                <div className="text-sm text-muted-foreground">Expired</div>
              </Card>
            </>
          ) : (
            [...Array(4)].map((_, i) => (
              <Card key={i} className="p-4 h-[120px] text-center">
                <div className="mx-auto h-6 w-16 rounded bg-muted animate-pulse mb-2" />
                <div className="h-4 w-24 mx-auto rounded bg-muted/70 animate-pulse" />
              </Card>
            ))
          )}
        </div>

        {/* Policies List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Policy Documents</h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card
                  key={i}
                  className="p-6 h-[160px] flex flex-col justify-between space-y-4"
                >
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </Card>
              ))}
            </div>
          ) : (
            filteredPolicies.map((policy) => (
              <Card key={policy.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg space-x-4">
                            {policy.title}{" "}
                            <Badge className={getStatusBadge(policy.status)}>
                              {getStatusText(policy.status).toUpperCase()}
                            </Badge>
                          </h3>
                          <p className="text-muted-foreground">
                            {policy.category}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(policy)}
                          >
                            {hasRole(["staff"]) &&
                            policy.acknowledgements !==
                              policy.assignedStaff.length
                              ? "Acknowledge"
                              : "View"}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Version {policy.version}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Updated:{" "}
                            {new Date(policy.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>
                            {policy.acknowledgements}/
                            {policy.assignedStaff.length} acknowledged
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (policy.acknowledgements /
                                policy.assignedStaff.length) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col  ml-4"></div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* OFSTED Checklist */}
        {hasRole(["staff"]) && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Essential OFSTED Policies Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Safeguarding & Protection",
                "Daily Living & Care",
                "Staffing & HR",
                "Health & Safety",
                "Behavior Management",
                "Education & Development",
                "Finance & Administration",
                "Regulatory Compliance",
              ].map((policyName) => {
                const exists = policies.some((p) => p.category === policyName);
                return (
                  <div
                    key={policyName}
                    className="flex items-center gap-2 p-2 border border-border rounded"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        exists ? "bg-success" : "bg-destructive"
                      }`}
                    ></div>
                    <span
                      className={`text-sm ${
                        exists ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {policyName}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      <ViewPolicyModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        policy={selectedPolicy}
        onUpdatePolicy={fetchPolicy}
      />
      <UploadPolicyModal
        open={uploadPolicyOpen}
        onOpenChange={setUploadPolicyOpen}
        onAddPolicy={fetchPolicy}
      />
    </div>
  );
}
