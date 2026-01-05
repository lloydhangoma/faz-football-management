import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Phone, Mail, MapPin, Clock, Globe, Facebook, Twitter } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  facebook: string;
  twitter: string;
}

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: "Football House, Alick Nkhata Road, Lusaka, Zambia",
    phone: "+260 211 250 946",
    email: "info@fazfootball.com",
    website: "www.fazfootball.com",
    hours: "Monday - Friday: 08:00 - 17:00",
    facebook: "facebook.com/FAZFootball",
    twitter: "@FAaborZambia"
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ContactInfo>(contactInfo);

  const handleSave = () => {
    setContactInfo(formData);
    setIsDialogOpen(false);
    toast({ title: "Contact Info Updated", description: "The contact information has been updated successfully." });
  };

  const InfoCard = ({ icon: Icon, title, value }: { icon: React.ElementType; title: string; value: string }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-foreground">{value}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout title="Contact" subtitle="Manage contact information displayed on the website">
      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(contactInfo)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Contact Info
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Contact Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Address</Label>
                <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Website</Label>
                  <Input value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                </div>
                <div>
                  <Label>Office Hours</Label>
                  <Input value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Facebook</Label>
                  <Input value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} />
                </div>
                <div>
                  <Label>Twitter</Label>
                  <Input value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Office Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoCard icon={MapPin} title="Address" value={contactInfo.address} />
            <InfoCard icon={Phone} title="Phone" value={contactInfo.phone} />
            <InfoCard icon={Mail} title="Email" value={contactInfo.email} />
            <InfoCard icon={Clock} title="Office Hours" value={contactInfo.hours} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Online Presence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoCard icon={Globe} title="Website" value={contactInfo.website} />
            <InfoCard icon={Facebook} title="Facebook" value={contactInfo.facebook} />
            <InfoCard icon={Twitter} title="Twitter" value={contactInfo.twitter} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "John Mwanza", subject: "Ticket Inquiry", date: "2024-12-20", status: "Pending" },
              { name: "Grace Banda", subject: "Media Accreditation", date: "2024-12-19", status: "Replied" },
              { name: "Peter Chileshe", subject: "Coaching Course Registration", date: "2024-12-18", status: "Replied" },
              { name: "Mary Phiri", subject: "Club Registration Support", date: "2024-12-17", status: "Pending" },
            ].map((inquiry, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium text-foreground">{inquiry.name}</p>
                  <p className="text-sm text-muted-foreground">{inquiry.subject}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded ${inquiry.status === "Pending" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"}`}>
                    {inquiry.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{inquiry.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Contact;
