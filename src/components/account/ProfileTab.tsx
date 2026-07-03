import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin } from "lucide-react";
import { type AppUser } from "@/lib/auth/types";

interface ProfileTabProps {
  user: AppUser;
}

const emptyLabel = "Not set";

const ProfileTab = ({ user }: ProfileTabProps) => (
  <div className="grid md:grid-cols-2 gap-6">
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { label: "Full Name", value: user.name || emptyLabel },
          { label: "Email", value: user.email || emptyLabel },
          { label: "Phone", value: user.phone || emptyLabel },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              {field.label}
            </label>
            <p className="text-foreground font-medium mt-1">{field.value}</p>
          </div>
        ))}
        <Button
          variant="outline"
          className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          disabled
        >
          Edit Profile
        </Button>
      </CardContent>
    </Card>

    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Delivery Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Default Address
          </label>
          <p className="text-foreground font-medium mt-1">{user.address || emptyLabel}</p>
        </div>
        <Button
          variant="outline"
          className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          disabled
        >
          Manage Addresses
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default ProfileTab;
