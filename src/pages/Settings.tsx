import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Bell, Shield, Download } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your OFSTED Prep configuration and preferences
          </p>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Organization Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input id="org-name" defaultValue="OFSTEDPrep" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-type">Organization Type</Label>
                    <Select defaultValue="residential-care">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential-care">
                          Residential Care
                        </SelectItem>
                        <SelectItem value="childrens-home">
                          Children's Home
                        </SelectItem>
                        <SelectItem value="supported-living">
                          Supported Living
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registration-number">
                      OFSTED Registration Number
                    </Label>
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
                <h3 className="text-lg font-semibold mb-4">
                  System Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Automatic Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Send reminders for upcoming audit deadlines
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important email updates
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="p-6 space-y-6">
              <h3 className="text-lg font-semibold">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "DBS Check Expiry Reminders",
                    desc: "30 days before expiry",
                  },
                  {
                    label: "Training Due Notifications",
                    desc: "14 days before due date",
                  },
                  {
                    label: "Audit Item Overdue Alerts",
                    desc: "Same day as due date",
                  },
                  { label: "Weekly Summary Reports", desc: "Every Monday" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <Label>{item.label}</Label>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <Button>Save Notification Settings</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Card className="p-6 space-y-6">
              <h3 className="text-lg font-semibold">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Strong Passwords</Label>
                    <p className="text-sm text-muted-foreground">
                      At least 8 characters, mixed case
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Recommended for Admins
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="pt-4">
                <Button>Update Security Settings</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
