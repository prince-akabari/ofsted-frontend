import { 
  Home, 
  CheckSquare, 
  Users, 
  FileText, 
  Bell, 
  BarChart3, 
  Settings,
  UserCog,
  Activity,
  LogOut,
  User
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Audit Checklist", url: "/audit-checklist", icon: CheckSquare },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Staff Compliance", url: "/staff-compliance", icon: Users },
  { title: "Policies & Docs", url: "/policies", icon: FileText },
  { title: "Alerts", url: "/alerts", icon: Bell },
];

const adminItems = [
  { title: "User Management", url: "/user-management", icon: UserCog },
  { title: "Activity Logs", url: "/activity-logs", icon: Activity },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";
  
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Successfully logged out");
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getNavStyles = (path: string) => {
    const baseStyles = "flex items-center gap-3 w-full justify-start px-3 py-2 rounded-lg transition-colors";
    if (isActive(path)) {
      return `${baseStyles} bg-primary text-primary-foreground`;
    }
    return `${baseStyles} text-sidebar-foreground hover:bg-sidebar-accent`;
  };

  const getNavButtonStyles = (path: string) => {
    const baseStyles = "flex items-center gap-3 w-full justify-start px-3 py-2 rounded-lg transition-colors border-0 bg-transparent";
    if (isActive(path)) {
      return `${baseStyles} bg-primary text-primary-foreground hover:bg-primary`;
    }
    return `${baseStyles} text-sidebar-foreground hover:bg-sidebar-accent`;
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"}>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">O</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-semibold text-lg">OFSTEDPrep</h1>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 flex-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavStyles(item.url)}>
                      <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : ''}`} />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavStyles(item.url)}>
                        <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : ''}`} />
                        {!collapsed && <span className="font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/profile" className={getNavStyles("/profile")}>
                <User className={`h-5 w-5 ${collapsed ? 'mx-auto' : ''}`} />
                {!collapsed && <span className="font-medium">Profile</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" onClick={handleLogout} className={getNavButtonStyles("/logout")}>
                <LogOut className={`h-5 w-5 ${collapsed ? 'mx-auto' : ''}`} />
                {!collapsed && <span className="font-medium">Logout</span>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}