import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const SettingsTab = () => (
  <div className="grid md:grid-cols-2 gap-6">
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-display text-xl">Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { title: "Email Notifications", desc: "Receive order updates and promotions", action: "On" },
          { title: "Language", desc: "Display language preference", action: "English" },
          { title: "Currency", desc: "Preferred display currency", action: "EUR (€)" },
        ].map((item, i, arr) => (
          <div key={item.title} className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
            <div>
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
            <Button variant="outline" size="sm">{item.action}</Button>
          </div>
        ))}
      </CardContent>
    </Card>

    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-display text-xl">Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-muted">Change Password</Button>
        <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-muted">Privacy Settings</Button>
        <Button variant="outline" className="w-full justify-start gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default SettingsTab;
