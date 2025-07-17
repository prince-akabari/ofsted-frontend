import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Users, Bell, Shield, Download } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your OFSTED Prep configuration and preferences</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Backup
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Organization Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-name">Organization Name</Label>
                      <Input id="org-name" defaultValue="Sunset Care Home" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-type">Organization Type</Label>
                      <Select defaultValue="residential-care">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential-care">Residential Care Home</SelectItem>
                          <SelectItem value="childrens-home">Children's Home</SelectItem>
                          <SelectItem value="supported-living">Supported Living</SelectItem>
                          <SelectItem value="day-care">Day Care</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registration-number">OFSTED Registration Number</Label>
                      <Input id="registration-number" defaultValue="SC123456" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="manager-name">Registered Manager</Label>
                      <Input id="manager-name" defaultValue="Sarah Johnson" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">System Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Automatic Reminders</Label>
                        <p className="text-sm text-muted-foreground">Send automatic reminders for upcoming deadlines</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive email updates for critical alerts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-save Progress</Label>
                        <p className="text-sm text-muted-foreground">Automatically save changes as you work</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button>Save Changes</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <Button>Invite New User</Button>
                </div>

                {/* User List */}
                <div className="space-y-3">
                  {[
                    { name: "Sarah Johnson", email: "sarah@example.com", role: "Admin", status: "Active" },
                    { name: "Mark Thompson", email: "mark@example.com", role: "Staff", status: "Active" },
                    { name: "Lisa Chen", email: "lisa@example.com", role: "Staff", status: "Pending" },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Role: </span>
                          <span>{user.role}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'Active' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'
                        }`}>
                          {user.status}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="ghost">Remove</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Role Permissions */}
                <div className="space-y-4">
                  <h4 className="font-medium">Role Permissions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <h5 className="font-medium mb-2">Admin</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Full access to all features</li>
                        <li>• Can manage users and settings</li>
                        <li>• Can generate all reports</li>
                        <li>• Can modify audit checklists</li>
                      </ul>
                    </Card>
                    <Card className="p-4">
                      <h5 className="font-medium mb-2">Staff</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• View assigned tasks</li>
                        <li>• Upload documents</li>
                        <li>• Complete audit items</li>
                        <li>• View policies</li>
                      </ul>
                    </Card>
                    <Card className="p-4">
                      <h5 className="font-medium mb-2">Read-Only</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• View reports and progress</li>
                        <li>• Access dashboard</li>
                        <li>• Export data</li>
                        <li>• No editing permissions</li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Email Notifications</h4>
                    <div className="space-y-3">
                      {[
                        { label: "DBS Check Expiry Reminders", desc: "30 days before expiry", checked: true },
                        { label: "Training Due Notifications", desc: "14 days before due date", checked: true },
                        { label: "Audit Item Overdue Alerts", desc: "Same day as due date", checked: true },
                        { label: "Policy Review Reminders", desc: "Monthly policy reviews", checked: false },
                        { label: "Weekly Summary Reports", desc: "Every Monday morning", checked: true },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <Label>{item.label}</Label>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                          <Switch defaultChecked={item.checked} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">In-App Notifications</h4>
                    <div className="space-y-3">
                      {[
                        { label: "Critical Alerts", desc: "High priority issues", checked: true },
                        { label: "Task Assignments", desc: "When new tasks are assigned", checked: true },
                        { label: "Document Updates", desc: "Policy and document changes", checked: false },
                        { label: "System Updates", desc: "App updates and maintenance", checked: true },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <Label>{item.label}</Label>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                          <Switch defaultChecked={item.checked} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button>Save Notification Settings</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Card className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Security Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Password Policy</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Require Strong Passwords</Label>
                          <p className="text-sm text-muted-foreground">Minimum 8 characters with mixed case and numbers</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Require 2FA for admin users</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Session Timeout</Label>
                          <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Data Protection</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Audit Log Retention</Label>
                          <p className="text-sm text-muted-foreground">Keep audit logs for 7 years</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Automatic Backups</Label>
                          <p className="text-sm text-muted-foreground">Daily encrypted backups</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button>Update Security Settings</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Backup & Export */}
          <TabsContent value="backup">
            <Card className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Backup & Export</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Backup Options</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export All Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export Staff Records
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export Audit History
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export Policies
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Automatic Backups</h4>
                    <div className="space-y-3">
                      <div className="p-3 border border-border rounded">
                        <div className="text-sm font-medium">Last Backup</div>
                        <div className="text-sm text-muted-foreground">Today at 2:00 AM</div>
                        <div className="text-xs text-success">Successful</div>
                      </div>
                      <div className="p-3 border border-border rounded">
                        <div className="text-sm font-medium">Next Backup</div>
                        <div className="text-sm text-muted-foreground">Tomorrow at 2:00 AM</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Enable Automatic Backups</Label>
                          <p className="text-sm text-muted-foreground">Daily at 2:00 AM</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Data Retention</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Backup Retention Period</Label>
                      <Select defaultValue="1-year">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-month">1 Month</SelectItem>
                          <SelectItem value="3-months">3 Months</SelectItem>
                          <SelectItem value="6-months">6 Months</SelectItem>
                          <SelectItem value="1-year">1 Year</SelectItem>
                          <SelectItem value="7-years">7 Years (Recommended)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}