import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Eye } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface AboutPage {
  id: string;
  title: string;
  category: "about" | "development";
  content: string;
  lastUpdated: string;
  status: "published" | "draft";
}

const initialPages: AboutPage[] = [
  { id: "1", title: "Introduction to FAZ", category: "about", content: "The Football Association of Zambia (FAZ) is the governing body of football in Zambia...", lastUpdated: "2024-12-15", status: "published" },
  { id: "2", title: "President's Corner", category: "about", content: "Welcome message from the FAZ President...", lastUpdated: "2024-12-10", status: "published" },
  { id: "3", title: "Mission Statement", category: "about", content: "To develop, promote and govern football in Zambia...", lastUpdated: "2024-12-08", status: "published" },
  { id: "4", title: "Executive Committee (NEC)", category: "about", content: "The National Executive Committee oversees all FAZ operations...", lastUpdated: "2024-12-05", status: "published" },
  { id: "5", title: "Secretariat", category: "about", content: "The FAZ Secretariat handles day-to-day operations...", lastUpdated: "2024-12-01", status: "published" },
  { id: "6", title: "Schools Football", category: "development", content: "FAZ Schools Football Program nurtures young talent...", lastUpdated: "2024-11-28", status: "published" },
  { id: "7", title: "Coaching Education", category: "development", content: "FAZ Coaching courses and certifications...", lastUpdated: "2024-11-25", status: "published" },
  { id: "8", title: "Refereeing", category: "development", content: "Referee development and certification programs...", lastUpdated: "2024-11-20", status: "published" },
  { id: "9", title: "Technical Centre", category: "development", content: "State-of-the-art football development facility...", lastUpdated: "2024-11-15", status: "draft" },
];

const About = () => {
  const [pages, setPages] = useState<AboutPage[]>(initialPages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<AboutPage | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "", category: "about" as "about" | "development" });

  const aboutPages = pages.filter(p => p.category === "about");
  const developmentPages = pages.filter(p => p.category === "development");

  const handleSave = () => {
    if (editingPage) {
      setPages(pages.map(p => p.id === editingPage.id ? { ...p, ...formData, lastUpdated: new Date().toISOString().split('T')[0] } : p));
      toast({ title: "Page Updated", description: `${formData.title} has been updated.` });
    } else {
      const newPage: AboutPage = {
        id: Date.now().toString(),
        ...formData,
        lastUpdated: new Date().toISOString().split('T')[0],
        status: "draft"
      };
      setPages([...pages, newPage]);
      toast({ title: "Page Created", description: `${formData.title} has been created.` });
    }
    setIsDialogOpen(false);
    setEditingPage(null);
    setFormData({ title: "", content: "", category: "about" });
  };

  const openEdit = (page: AboutPage) => {
    setEditingPage(page);
    setFormData({ title: page.title, content: page.content, category: page.category });
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout title="About FAZ" subtitle="Manage About and Development pages">
      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingPage(null); setFormData({ title: "", content: "", category: "about" }); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPage ? "Edit Page" : "Add New Page"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Title</Label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Page title" />
              </div>
              <div>
                <Label>Category</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as "about" | "development"})}>
                  <option value="about">About FAZ</option>
                  <option value="development">Development</option>
                </select>
              </div>
              <div>
                <Label>Content</Label>
                <Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Page content..." rows={6} />
              </div>
              <Button onClick={handleSave} className="w-full">Save Page</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">About FAZ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aboutPages.map(page => (
              <div key={page.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium text-foreground">{page.title}</p>
                  <p className="text-sm text-muted-foreground">Updated: {page.lastUpdated}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(page)}><Edit className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Development</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {developmentPages.map(page => (
              <div key={page.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium text-foreground">{page.title}</p>
                  <p className="text-sm text-muted-foreground">Updated: {page.lastUpdated}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(page)}><Edit className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default About;
