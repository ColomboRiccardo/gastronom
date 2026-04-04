import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin } from "lucide-react";

const mockUser = {
  name: "Maria Ivanova",
  email: "maria.ivanova@email.com",
  phone: "+39 345 678 9012",
  address: "Via Roma 42, 17025 Loano (SV), Liguria, Italia",
};

const ProfileTab = () => (
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
          { label: "Full Name", value: mockUser.name },
          { label: "Email", value: mockUser.email },
          { label: "Phone", value: mockUser.phone },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{field.label}</label>
            <p className="text-foreground font-medium mt-1">{field.value}</p>
          </div>
        ))}
        <Button variant="outline" className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
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
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Default Address</label>
          <p className="text-foreground font-medium mt-1">{mockUser.address}</p>
        </div>
        <Button variant="outline" className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          Manage Addresses
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default ProfileTab;
