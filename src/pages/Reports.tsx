import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import api from "@/services/apiService";
import { hasRole } from "@/lib/utils";

interface Report {
  id: string;
  title: string;
  type: string;
  category: string;
  date: string;
  status: string;
  createdByUser: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function Reports() {
  const [selectedType, setSelectedType] = useState(null);
  const [reportsData, setReportsData] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingReportIndex, setGeneratingReportIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports");
        setReportsData(res.data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports =
    selectedType === null
      ? reportsData
      : reportsData.filter((report) => report.type === selectedType);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "complete":
        return `${baseClasses} bg-success text-success-foreground`;
      case "in_progress":
      case "in-progress":
        return `${baseClasses} bg-warning text-warning-foreground`;
      case "scheduled":
        return `${baseClasses} bg-primary text-primary-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const quickReports = [
    {
      title: "OFSTED Readiness Report",
      description: "Complete overview of inspection readiness",
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      type: "ofsted",
    },
    {
      title: "Staff Compliance Summary",
      description: "Current status of all staff requirements",
      icon: <FileText className="h-6 w-6 text-primary" />,
      type: "Staff",
    },
    {
      title: "Audit Progress Report",
      description: "Detailed audit checklist completion status",
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      type: "audit",
    },
    {
      title: "Policy Compliance Report",
      description: "Status of all policies and acknowledgements",
      icon: <FileText className="h-6 w-6 text-primary" />,
      type: "policy",
    },
  ];
  const handleGenerateReport = async (report: any, index: number) => {
    setGeneratingReportIndex(index);
    try {
      const payload = {
        title: report.title,
        type: report.type,
        category: report.category,
        status: report.status,
        date: new Date().toISOString(),
      };

      await api.post("/reports", payload);

      const updatedReports = await api.get("/reports");
      setReportsData(updatedReports.data);
    } catch (error) {
      console.error("Report generation failed", error);
    } finally {
      setGeneratingReportIndex(null);
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredReports);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const fileName = `Reports_${formattedDate}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Reports & Logs
          </h1>
          <p className="text-muted-foreground">
            Generate and view inspection readiness reports
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Quick Report Generation */}
        {hasRole(["admin"]) && (
          <>
            <h2 className="text-lg font-semibold mb-4">Generate New Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickReports.map((report, index) => (
                <Card
                  key={index}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                      {report.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{report.title}</h3>
                      <p className="text-xs text-muted-foreground h-8">
                        {report.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleGenerateReport(report, index)}
                      disabled={generatingReportIndex === index}
                    >
                      {generatingReportIndex === index ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-primary"></span>
                          Generating...
                        </span>
                      ) : (
                        "Generate"
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
        {/* Report Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4">
              {loading ? (
                <Skeleton className="h-6 w-full" />
              ) : (
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {i === 0
                      ? reportsData.length
                      : i === 1
                      ? reportsData.filter((r) => r.status === "complete")
                          .length
                      : i === 2
                      ? reportsData.filter(
                          (r) =>
                            r.status === "in_progress" ||
                            r.status === "in-progress"
                        ).length
                      : reportsData.filter((r) => r.status === "scheduled")
                          .length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {i === 0
                      ? "Total Reports"
                      : i === 1
                      ? "Completed"
                      : i === 2
                      ? "In Progress"
                      : "Scheduled"}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Report Filters and List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Report History</h2>
            <div className="flex gap-4">
              <Select onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>{"All Reports"}</SelectItem>
                  {quickReports.map((type) => (
                    <SelectItem key={type.title} value={type.type}>
                      {type.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasRole(["admin", "staff"]) && (
                <Button variant="outline" onClick={handleExport}>
                  Export All
                </Button>
              )}
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-3">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <Card key={i} className="p-4 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-8 w-full mt-2" />
                  </Card>
                ))
              : filteredReports.map((report) => (
                  <Card key={report.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{report.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(report.date).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>{report.type}</span>
                            <span>•</span>
                            <span>{report.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3"></div>
                    </div>
                  </Card>
                ))}
          </div>
        </div>

        {/* Scheduled Reports */}
        {/* <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Scheduled Reports</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Weekly", "Monthly", "Quarterly"].map((label, idx) => (
                <Card key={idx} className="p-4 bg-muted/30">
                  <div className="space-y-2">
                    <h3 className="font-medium">
                      {label}{" "}
                      {idx === 0
                        ? "Compliance Summary"
                        : idx === 1
                        ? "Audit Progress"
                        : "OFSTED Readiness"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {idx === 0
                        ? "Every Monday at 9:00 AM"
                        : idx === 1
                        ? "First day of each month"
                        : "Every 3 months"}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost">
                        Disable
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="pt-4 border-t border-border">
              <Button>Add Scheduled Report</Button>
            </div>
          </div>
        </Card> */}
      </div>
    </div>
  );
}
