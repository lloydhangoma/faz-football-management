import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Save, X, Loader2, Users, MapPin, Trophy, Clock, Tv, Ticket } from "lucide-react";
import { toast } from "sonner";

const TEAMS = [
  { id: "chipolopolo-men", name: "Chipolopolo (Men)", category: "Senior" },
  { id: "shepolopolo-women", name: "Shepolopolo (Women)", category: "Senior" },
  { id: "u20-men", name: "Chipolopolo (U20 Men)", category: "Youth" },
  { id: "u20-women", name: "Shepolopolo (U20 Women)", category: "Youth" },
  { id: "u17-men", name: "Chipolopolo (U17 Men)", category: "Youth" },
  { id: "u17-women", name: "Shepolopolo (U17 Women)", category: "Youth" },
  { id: "u15-men", name: "Chipolopolo (U15 Men)", category: "Youth" },
  { id: "futsal", name: "Futsal National Team", category: "Other" },
  { id: "legends", name: "Legends / Masters", category: "Other" },
];

const COMPETITIONS = [
  { id: "afcon-qual", name: "AFCON Qualifiers", type: "Continental" },
  { id: "afcon", name: "AFCON Finals", type: "Continental" },
  { id: "wafcon-qual", name: "WAFCON Qualifiers", type: "Continental" },
  { id: "wafcon", name: "WAFCON Finals", type: "Continental" },
  { id: "cosafa", name: "COSAFA Cup", type: "Regional" },
  { id: "cosafa-u20", name: "COSAFA U20", type: "Regional" },
  { id: "cosafa-u17", name: "COSAFA U17", type: "Regional" },
  { id: "cosafa-women", name: "COSAFA Women", type: "Regional" },
  { id: "cosafa-futsal", name: "COSAFA Futsal", type: "Regional" },
  { id: "wcq", name: "World Cup Qualifiers", type: "International" },
  { id: "friendly", name: "International Friendly", type: "Friendly" },
  { id: "legends-inv", name: "Legends Invitational", type: "Exhibition" },
];

const VENUES = [
  "National Heroes Stadium",
  "Levy Mwanawasa Stadium",
  "Nkoloma Stadium",
  "Edwin Imboela Stadium",
  "Independence Stadium",
  "Arthur Davies Stadium",
  "OYDC",
  "Away Venue",
];

const STATUSES = [
  { id: "upcoming", label: "Upcoming", color: "bg-info/10 text-info" },
  { id: "live", label: "Live", color: "bg-accent text-accent-foreground" },
  { id: "completed", label: "Completed", color: "bg-muted text-muted-foreground" },
  { id: "postponed", label: "Postponed", color: "bg-warning/10 text-warning" },
  { id: "cancelled", label: "Cancelled", color: "bg-destructive/10 text-destructive" },
];

export interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  competition: string;
  status: "upcoming" | "live" | "completed" | "postponed" | "cancelled";
  referee?: string;
  assistantRef1?: string;
  assistantRef2?: string;
  fourthOfficial?: string;
  tvBroadcast?: string;
  streamingLink?: string;
  ticketStatus?: "available" | "sold-out" | "not-on-sale";
  notes?: string;
}

interface FixtureFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fixture?: Fixture | null;
  onSave: (fixture: Fixture) => void;
}

const FixtureForm = ({ open, onOpenChange, fixture, onSave }: FixtureFormProps) => {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Fixture>>({
    homeTeam: "",
    awayTeam: "",
    competition: "",
    venue: "",
    date: "",
    time: "",
    status: "upcoming",
    ticketStatus: "not-on-sale",
  });
  const [selectedDate, setSelectedDate] = useState<Date>();

  useEffect(() => {
    if (fixture) {
      setFormData(fixture);
      if (fixture.date) {
        setSelectedDate(new Date(fixture.date));
      }
    } else {
      setFormData({
        homeTeam: "",
        awayTeam: "",
        competition: "",
        venue: "",
        date: "",
        time: "",
        status: "upcoming",
        ticketStatus: "not-on-sale",
      });
      setSelectedDate(undefined);
    }
    setStep(1);
  }, [fixture, open]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({ ...prev, date: format(date, "MMM d, yyyy") }));
    }
  };

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const newFixture: Fixture = {
        id: fixture?.id || crypto.randomUUID(),
        homeTeam: formData.homeTeam || "",
        awayTeam: formData.awayTeam || "",
        competition: formData.competition || "",
        venue: formData.venue || "",
        date: formData.date || "",
        time: formData.time || "",
        status: formData.status as Fixture["status"] || "upcoming",
        homeScore: formData.homeScore,
        awayScore: formData.awayScore,
        referee: formData.referee,
        assistantRef1: formData.assistantRef1,
        assistantRef2: formData.assistantRef2,
        fourthOfficial: formData.fourthOfficial,
        tvBroadcast: formData.tvBroadcast,
        streamingLink: formData.streamingLink,
        ticketStatus: formData.ticketStatus as Fixture["ticketStatus"],
        notes: formData.notes,
      };
      
      onSave(newFixture);
      toast.success(fixture ? "Fixture updated successfully" : "Fixture created successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save fixture");
    } finally {
      setIsSaving(false);
    }
  }, [formData, fixture, onSave, onOpenChange]);

  // Keyboard shortcut for save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (step === 3) {
          handleSave();
        }
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, step, handleSave]);

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.homeTeam && formData.awayTeam && formData.competition;
      case 2:
        return formData.date && formData.time && formData.venue;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {fixture ? "Edit Fixture" : "Create New Fixture"}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => setStep(s)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  step === s
                    ? "bg-primary text-primary-foreground"
                    : step > s
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {s}
              </button>
              {s < 3 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 w-8",
                    step > s ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Step 1: Teams & Competition */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Users className="h-4 w-4" />
                <span>Teams & Competition</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Home Team (Zambia)</Label>
                  <Select
                    value={formData.homeTeam}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, homeTeam: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAMS.map((team) => (
                        <SelectItem key={team.id} value={team.name}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Away Team (Opponent)</Label>
                  <Input
                    placeholder="e.g., Morocco, Nigeria, South Africa..."
                    value={formData.awayTeam}
                    onChange={(e) => setFormData(prev => ({ ...prev, awayTeam: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Competition</Label>
                <Select
                  value={formData.competition}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, competition: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select competition" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPETITIONS.map((comp) => (
                      <SelectItem key={comp.id} value={comp.name}>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-3 w-3" />
                          {comp.name}
                          <span className="text-xs text-muted-foreground">({comp.type})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Date, Time & Venue */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>Date, Time & Venue</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Match Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Kick-off Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="time"
                      className="pl-9"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Venue / Stadium</Label>
                <Select
                  value={formData.venue}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, venue: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {VENUES.map((venue) => (
                      <SelectItem key={venue} value={venue}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {venue}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Match Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Fixture["status"] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        <span className={cn("badge-status", status.color)}>{status.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(formData.status === "live" || formData.status === "completed") && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Home Score</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.homeScore ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, homeScore: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Away Score</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.awayScore ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, awayScore: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Additional Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Trophy className="h-4 w-4" />
                <span>Additional Details</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Referee</Label>
                  <Input
                    placeholder="Main referee name"
                    value={formData.referee ?? ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, referee: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fourth Official</Label>
                  <Input
                    placeholder="Fourth official name"
                    value={formData.fourthOfficial ?? ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, fourthOfficial: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Assistant Referee 1</Label>
                  <Input
                    placeholder="AR1 name"
                    value={formData.assistantRef1 ?? ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, assistantRef1: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assistant Referee 2</Label>
                  <Input
                    placeholder="AR2 name"
                    value={formData.assistantRef2 ?? ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, assistantRef2: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tv className="h-4 w-4" />
                    TV Broadcast
                  </Label>
                  <Input
                    placeholder="e.g., SuperSport, ZNBC"
                    value={formData.tvBroadcast ?? ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, tvBroadcast: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Streaming Link</Label>
                  <Input
                    placeholder="https://..."
                    value={formData.streamingLink ?? ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, streamingLink: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  Ticket Status
                </Label>
                <Select
                  value={formData.ticketStatus}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, ticketStatus: value as Fixture["ticketStatus"] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ticket status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-on-sale">Not On Sale</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold-out">Sold Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Any additional notes about the fixture..."
                  value={formData.notes ?? ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : onOpenChange(false)}
          >
            {step > 1 ? "Back" : "Cancel"}
          </Button>

          <div className="flex gap-2">
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid(step)}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Fixture
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FixtureForm;
