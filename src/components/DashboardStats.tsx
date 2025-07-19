import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  status?: "success" | "warning" | "danger" | "default";
}

export function StatCard({
  title,
  value,
  subtitle,
  status = "default",
}: StatCardProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "danger":
        return "text-destructive";
      default:
        return "text-foreground";
    }
  };

  return (
    <Card className="flex items-center justify-center p-6 bg-card border border-border w-full h-full">
      <div className="text-center">
        <div className={`text-3xl font-bold ${getStatusStyles()}`}>{value}</div>
        <div className="text-sm font-medium text-foreground mt-1">{title}</div>
        {subtitle && (
          <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
        )}
      </div>
    </Card>
  );
}

// Dummy data for dashboard stats
export const dashboardStats = {
  ofstedProgress: 75,
  auditCompletion: 45,
  outstandingActions: 8,
  lastVisitRating: "Good",
  staffCompliance: 82,
  overdueTasks: 3,
  policiesUpToDate: 94,
  alertsCount: 5,
};
