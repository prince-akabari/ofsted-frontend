import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ProgressChart } from "@/components/ProgressChart";
import { StatCard } from "@/components/DashboardStats";
import api from "@/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    ofstedProgress: 0,
    auditCompletion: 0,
    outstandingActions: 0,
    lastVisitRating: "N/A",
  });

  const [auditChecklistData, setAuditChecklistData] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/dashboard");
        const data = res.data;

        setDashboardStats({
          ofstedProgress: data.overallReadiness,
          auditCompletion: data.auditCompletion,
          outstandingActions: data.outstandingActions,
          lastVisitRating: data.lastOfstedVisit?.rating || "N/A",
        });

        setAuditChecklistData(data.checklistOverview || []);
        setReportsData(data.recentReports || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const recentReports = reportsData.slice(0, 3);
  const auditCategories = [
    ...new Set(auditChecklistData.map((item) => item.category)),
  ];

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "complete":
        return `${baseClasses} bg-success text-success-foreground`;
      case "in_progress":
        return `${baseClasses} bg-warning text-warning-foreground`;
      case "overdue":
        return `${baseClasses} bg-destructive text-destructive-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            OFSTED preparation overview and key metrics
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {loading ? (
            <>
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </>
          ) : (
            <>
              <ProgressChart
                percentage={dashboardStats.ofstedProgress}
                title="OFSTED Rating Progress"
                subtitle="Overall readiness"
                size="medium"
              />

              <StatCard
                title="Audit Completion"
                value={`${dashboardStats.auditCompletion}%`}
                status="warning"
              />

              <StatCard
                title="Outstanding Actions"
                value={dashboardStats.outstandingActions}
                status="danger"
              />

              <StatCard
                title="Last OFSTED Visit"
                value={dashboardStats.lastVisitRating}
                status="success"
              />
            </>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audit Checklist Overview */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Audit Checklist Overview
            </h2>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-4 w-1/2 mt-4" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ) : (
              <div className="space-y-3">
                {auditCategories.map((category) => {
                  const categoryItems = auditChecklistData.filter(
                    (item) => item.category === category
                  );
                  const completedItems = categoryItems.filter(
                    (item) => item.completed > 0
                  ).length;
                  const progressPercentage = Math.round(
                    (completedItems / categoryItems.length) * 100
                  );

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm text-muted-foreground">
                          {completedItems}/{categoryItems.length}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recent Reports */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ) : (
              <div className="space-y-4">
                {recentReports.map((report, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-sm">{report.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {report.date}
                      </p>
                    </div>
                    <span className={getStatusBadge(report.status)}>
                      {report.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

