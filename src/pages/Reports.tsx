import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Calendar, BarChart3, TrendingUp } from "lucide-react";
import api from "@/services/apiService";

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

const reportTypes = [
  "All Reports",
  "Compliance Report",
  "Audit Report",
  "Safeguarding Report",
  "Staff Report",
  "Financial Report"
];

export default function Reports() {
  const [selectedType, setSelectedType] = useState("All Reports");
  const [reportsData, setReportsData] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports");
        setReportsData(res.data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };
    fetchReports();
  }, []);

  const filteredReports =
    selectedType === "All Reports"
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
      icon: <BarChart3 className="h-6 w-6 text-primary" />
    },
    {
      title: "Staff Compliance Summary",
      description: "Current status of all staff requirements",
      icon: <FileText className="h-6 w-6 text-primary" />
    },
    {
      title: "Audit Progress Report",
      description: "Detailed audit checklist completion status",
      icon: <TrendingUp className="h-6 w-6 text-primary" />
    },
    {
      title: "Policy Compliance Report",
      description: "Status of all policies and acknowledgements",
      icon: <FileText className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Reports & Logs</h1>
          <p className="text-muted-foreground">Generate and view inspection readiness reports</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Quick Report Generation */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Generate New Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickReports.map((report, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                    {report.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{report.title}</h3>
                    <p className="text-xs text-muted-foreground">{report.description}</p>
                  </div>
                  <Button size="sm" className="w-full">Generate</Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Report Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{reportsData.length}</div>
              <div className="text-sm text-muted-foreground">Total Reports</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {reportsData.filter((r) => r.status === 'complete').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {reportsData.filter((r) => r.status === 'in_progress' || r.status === 'in-progress').length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {reportsData.filter((r) => r.status === 'scheduled').length}
              </div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </div>
          </Card>
        </div>

        {/* Report Filters and List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Report History</h2>
            <div className="flex gap-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">Export All</Button>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-3">
            {filteredReports.map((report) => (
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
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{report.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusBadge(report.status)}>{report.status.toUpperCase()}</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex items-center gap-2"><Download className="h-4 w-4" />Download</Button>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Scheduled Reports */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Scheduled Reports</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Static scheduled items retained */}
              <Card className="p-4 bg-muted/30">
                <div className="space-y-2">
                  <h3 className="font-medium">Weekly Compliance Summary</h3>
                  <p className="text-sm text-muted-foreground">Every Monday at 9:00 AM</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="ghost">Disable</Button>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-muted/30">
                <div className="space-y-2">
                  <h3 className="font-medium">Monthly Audit Progress</h3>
                  <p className="text-sm text-muted-foreground">First day of each month</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="ghost">Disable</Button>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-muted/30">
                <div className="space-y-2">
                  <h3 className="font-medium">Quarterly OFSTED Readiness</h3>
                  <p className="text-sm text-muted-foreground">Every 3 months</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="ghost">Disable</Button>
                  </div>
                </div>
              </Card>
            </div>
            <div className="pt-4 border-t border-border">
              <Button>Add Scheduled Report</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
