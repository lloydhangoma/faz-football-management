import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Star, Eye, Trash2 } from "lucide-react";
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

interface Legend {
  id: string;
  name: string;
  position: string;
  yearsActive: string;
  achievements: string;
  bio: string;
  inducted: string;
}

const initialLegends: Legend[] = [
  { id: "1", name: "Kalusha Bwalya", position: "Forward", yearsActive: "1982-2000", achievements: "1988 African Footballer of the Year, 1994 AFCON Winner", bio: "Considered the greatest Zambian footballer of all time. Led Zambia to AFCON glory and had a successful European club career.", inducted: "2010" },
  { id: "2", name: "Godfrey Chitalu", position: "Striker", yearsActive: "1968-1980", achievements: "Most goals in a calendar year (107 in 1972)", bio: "Legendary striker whose goal-scoring record still stands. A true icon of Zambian football.", inducted: "2010" },
  { id: "3", name: "Samuel 'Zoom' Ndhlovu", position: "Midfielder", yearsActive: "1978-1993", achievements: "Multiple league titles with Nkana FC", bio: "Skillful midfielder known for his exceptional ball control and vision.", inducted: "2012" },
  { id: "4", name: "Efford Chabala", position: "Defender", yearsActive: "1974-1991", achievements: "1974 Independence Cup Winner", bio: "Rock-solid defender who anchored the Zambian defense for nearly two decades.", inducted: "2015" },
  { id: "5", name: "Kennedy Mweene", position: "Goalkeeper", yearsActive: "2002-2022", achievements: "2012 AFCON Winner, Multiple SA league titles", bio: "Legendary goalkeeper who was part of the historic 2012 AFCON winning squad.", inducted: "2023" },
  { id: "6", name: "Christopher Katongo", position: "Forward", yearsActive: "1999-2017", achievements: "2012 AFCON Player of the Tournament", bio: "Captain of the 2012 AFCON winning team and African Footballer of the Year.", inducted: "2020" },
];

const Legends = () => {
  const [legends, setLegends] = useState<Legend[]>(initialLegends);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLegend, setEditingLegend] = useState<Legend | null>(null);
  const [formData, setFormData] = useState({ name: "", position: "", yearsActive: "", achievements: "", bio: "" });

  const handleSave = () => {
    if (editingLegend) {
      setLegends(legends.map(l => l.id === editingLegend.id ? { ...l, ...formData } : l));
      toast({ title: "Legend Updated", description: `${formData.name} profile has been updated.` });
    } else {
      const newLegend: Legend = { id: Date.now().toString(), ...formData, inducted: new Date().getFullYear().toString() };
      setLegends([...legends, newLegend]);
      toast({ title: "Legend Added", description: `${formData.name} has been inducted into the Legends Corner.` });
    }
    setIsDialogOpen(false);
    setEditingLegend(null);
    setFormData({ name: "", position: "", yearsActive: "", achievements: "", bio: "" });
  };

  const openEdit = (legend: Legend) => {
    setEditingLegend(legend);
    setFormData({ name: legend.name, position: legend.position, yearsActive: legend.yearsActive, achievements: legend.achievements, bio: legend.bio });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setLegends(legends.filter(l => l.id !== id));
    toast({ title: "Legend Removed", description: "The legend has been removed from the corner." });
  };

  return (
    <DashboardLayout title="Legends Corner" subtitle="Manage FAZ Hall of Fame">
      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingLegend(null); setFormData({ name: "", position: "", yearsActive: "", achievements: "", bio: "" }); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Legend
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingLegend ? "Edit Legend" : "Induct New Legend"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Player name" />
                </div>
                <div>
                  <Label>Position</Label>
                  <Input value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} placeholder="e.g. Forward" />
                </div>
              </div>
              <div>
                <Label>Years Active</Label>
                <Input value={formData.yearsActive} onChange={e => setFormData({...formData, yearsActive: e.target.value})} placeholder="e.g. 1990-2010" />
              </div>
              <div>
                <Label>Achievements</Label>
                <Input value={formData.achievements} onChange={e => setFormData({...formData, achievements: e.target.value})} placeholder="Major achievements" />
              </div>
              <div>
                <Label>Biography</Label>
                <Textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Player biography..." rows={4} />
              </div>
              <Button onClick={handleSave} className="w-full">Save Legend</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {legends.map(legend => (
          <Card key={legend.id} className="overflow-hidden">
            <CardHeader className="bg-primary/5 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <Star className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">{legend.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{legend.position} • {legend.yearsActive}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-primary font-medium mb-2">{legend.achievements}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{legend.bio}</p>
              <p className="text-xs text-muted-foreground mt-2">Inducted: {legend.inducted}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1"><Eye className="h-4 w-4 mr-1" /> View</Button>
                <Button variant="outline" size="sm" onClick={() => openEdit(legend)}><Edit className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(legend.id)} className="hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Legends;
