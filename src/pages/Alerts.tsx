import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Info, Bell } from "lucide-react";
import api from "@/services/apiService";

interface AlertItem {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  category: string;
  urgent: boolean;
}

export default function Alerts() {
  const [alertsData, setAlertsData] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get("/alerts");
        setAlertsData(res.data);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "danger":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <Clock className="h-5 w-5 text-warning" />;
      case "info":
        return <Info className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getAlertBadge = (type: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (type) {
      case "danger":
        return `${baseClasses} bg-destructive text-destructive-foreground`;
      case "warning":
        return `${baseClasses} bg-warning text-warning-foreground`;
      case "info":
        return `${baseClasses} bg-primary text-primary-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const urgentAlerts = alertsData.filter((alert) => alert.urgent);
  const regularAlerts = alertsData.filter((alert) => !alert.urgent);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Alerts & Notifications
          </h1>
          <p className="text-muted-foreground">
            Stay informed about important actions and deadlines
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-4 h-24">
                <div className="h-full w-full space-y-2">
                  <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {alertsData.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Alerts
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {alertsData.filter((a) => a.type === "danger").length}
                </div>
                <div className="text-sm text-muted-foreground">Critical</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {alertsData.filter((a) => a.type === "warning").length}
                </div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {alertsData.filter((a) => a.urgent).length}
                </div>
                <div className="text-sm text-muted-foreground">Urgent</div>
              </div>
            </Card>
          </div>
        )}

        {/* Urgent Alerts */}
        {!loading && urgentAlerts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h2 className="text-lg font-semibold text-foreground">
                Urgent Alerts
              </h2>
            </div>
            {urgentAlerts.map((alert) => (
              <Card
                key={alert.id}
                className="p-4 border-l-4 border-l-destructive"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {alert.title}
                        </h3>
                        <Badge className={getAlertBadge(alert.type)}>
                          {alert.type.toUpperCase()}
                        </Badge>
                        {alert.urgent && (
                          <Badge className="bg-destructive text-destructive-foreground">
                            URGENT
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Category: {alert.category}</span>
                        <span>
                          Date: {new Date(alert.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="default">
                      Take Action
                    </Button>
                    <Button size="sm" variant="ghost">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Regular Alerts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            All Notifications
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="p-6 h-30">
                  <div className="h-full w-full space-y-3">
                    <div className="h-5 w-1/4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <></>
          )}
          {!loading &&
            regularAlerts.map((alert) => (
              <Card key={alert.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">
                          {alert.title}
                        </h3>
                        <Badge className={getAlertBadge(alert.type)}>
                          {alert.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Category: {alert.category}</span>
                        <span>
                          Date: {new Date(alert.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="ghost">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>

        {/* Alert Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Alert Settings</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary focus:ring-2 focus:ring-offset-0"
                    />
                    <span className="text-sm">
                      DBS expiry reminders (30 days)
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary focus:ring-2 focus:ring-offset-0"
                    />
                    <span className="text-sm">
                      Training expiry alerts (14 days)
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary focus:ring-2 focus:ring-offset-0"
                    />
                    <span className="text-sm">Overdue audit items</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">In-App Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary focus:ring-2 focus:ring-offset-0"
                    />
                    <span className="text-sm">Critical alerts</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary focus:ring-2 focus:ring-offset-0"
                    />
                    <span className="text-sm">Policy updates</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary focus:ring-2 focus:ring-offset-0"
                    />
                    <span className="text-sm">Daily summary</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <Button>Save Settings</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
