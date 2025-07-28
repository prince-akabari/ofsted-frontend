import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import api from "@/services/apiService";
import { Button } from "./ui/button";

interface AlertReminder {
  id: string;
  type: "danger" | "warning" | "info";
  title: string;
  description: string;
  date: string;
  category: string;
  urgent: boolean;
}

const severityStyles = {
  danger: "bg-red-100 text-red-800",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-blue-100 text-blue-800",
};

export default function ReminderDropdown() {
  const [reminders, setReminders] = useState<AlertReminder[]>([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false); // control menu open state
  const navigate = useNavigate();

  const fetchAlerts = async () => {
    const res = await api.get("/alerts?take=8");
    setReminders(res.data.alerts || []);
    setTotal(res.data.counts?.total || 0);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleClick = (alert: AlertReminder) => {
    setOpen(false); // close dropdown
    if (!alert?.category) return;

    const category = alert.category.toLowerCase();

    if (category.includes("staff compliance")) {
      navigate("/staff-compliance");
    } else if (category.includes("policy") || category.includes("policies")) {
      navigate("/policies");
    } else {
      navigate("/alerts");
    }
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate("/alerts");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="relative p-2 hover:bg-muted rounded-full">
        <Bell className="h-5 w-5 text-gray-600" />
        {total > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
            {total}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[360px] p-2 shadow-lg rounded-md border bg-white z-50">
        <div className="text-sm font-medium px-2 pb-1 text-gray-700">
          Reminders
        </div>

        {reminders.length === 0 && (
          <p className="text-sm text-center text-muted-foreground p-3">
            No new reminders.
          </p>
        )}

        {reminders.slice(0, 4).map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => handleClick(item)}
            className="flex flex-col items-start gap-1 px-2 py-2 hover:bg-gray-50 rounded-md cursor-pointer"
          >
            <div className="flex justify-between w-full items-center">
              <div className="flex items-center gap-1">
                {item.urgent && (
                  <AlertCircle className="text-red-600 w-4 h-4 animate-ping-slow" />
                )}
                <span className="font-medium text-sm truncate max-w-[220px]">
                  {item.title}
                </span>
              </div>
              <Badge className={clsx("text-xs", severityStyles[item.type])}>
                {item.type.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 max-w-[300px]">
              {item.description.slice(0, 50)}
              {item.description.length > 50 && "..."}
            </p>
            <span className="text-[10px] text-muted-foreground">
              {item.date}
            </span>
          </DropdownMenuItem>
        ))}

        {reminders.length > 0 && (
          <div className="pt-2 px-2">
            <Button
              onClick={handleViewAll}
              className="w-full text-sm font-medium text-center"
            >
              View All Alerts
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
