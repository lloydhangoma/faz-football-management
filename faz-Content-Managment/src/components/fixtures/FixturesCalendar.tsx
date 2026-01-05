import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Fixture } from "./FixtureForm";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, MapPin, Trophy } from "lucide-react";

interface FixturesCalendarProps {
  fixtures: Fixture[];
  onSelectFixture: (fixture: Fixture) => void;
}

const FixturesCalendar = ({ fixtures, onSelectFixture }: FixturesCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getFixturesForDate = (date: Date) => {
    return fixtures.filter((fixture) => {
      const fixtureDate = new Date(fixture.date);
      return (
        fixtureDate.getDate() === date.getDate() &&
        fixtureDate.getMonth() === date.getMonth() &&
        fixtureDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const selectedDateFixtures = selectedDate ? getFixturesForDate(selectedDate) : [];

  const hasFixtures = (date: Date) => getFixturesForDate(date).length > 0;

  const statusColors: Record<string, string> = {
    upcoming: "bg-info",
    live: "bg-accent",
    completed: "bg-success",
    postponed: "bg-warning",
    cancelled: "bg-destructive",
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Calendar */}
      <div className="stat-card">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md pointer-events-auto"
          modifiers={{
            hasFixture: (date) => hasFixtures(date),
          }}
          modifiersStyles={{
            hasFixture: {
              fontWeight: "bold",
            },
          }}
          components={{
            DayContent: ({ date }) => {
              const fixturesOnDay = getFixturesForDate(date);
              return (
                <div className="relative flex h-full w-full items-center justify-center">
                  {date.getDate()}
                  {fixturesOnDay.length > 0 && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {fixturesOnDay.slice(0, 3).map((f, i) => (
                        <div
                          key={i}
                          className={cn("h-1 w-1 rounded-full", statusColors[f.status])}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            },
          }}
        />

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-info" />
            <span className="text-muted-foreground">Upcoming</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-muted-foreground">Live</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">Postponed</span>
          </div>
        </div>
      </div>

      {/* Selected Date Fixtures */}
      <div className="stat-card">
        <div className="mb-4 flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <h3 className="font-display font-semibold text-foreground">
            {selectedDate
              ? selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Select a date"}
          </h3>
        </div>

        <ScrollArea className="h-[300px]">
          {selectedDateFixtures.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <CalendarIcon className="mb-2 h-8 w-8 opacity-50" />
              <p className="text-sm">No fixtures scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateFixtures.map((fixture) => (
                <div
                  key={fixture.id}
                  onClick={() => onSelectFixture(fixture)}
                  className="cursor-pointer rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/50 hover:bg-muted/30"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        fixture.status === "live" && "bg-accent text-accent-foreground",
                        fixture.status === "upcoming" && "bg-info/10 text-info",
                        fixture.status === "completed" && "bg-muted text-muted-foreground"
                      )}
                    >
                      {fixture.status === "live" ? "LIVE" : fixture.time}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{fixture.competition}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{fixture.homeTeam}</p>
                    </div>
                    {fixture.status === "completed" || fixture.status === "live" ? (
                      <div className="flex items-center gap-1 font-mono text-lg font-bold">
                        <span>{fixture.homeScore}</span>
                        <span className="text-muted-foreground">-</span>
                        <span>{fixture.awayScore}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">vs</span>
                    )}
                    <div className="flex-1 text-right">
                      <p className="font-medium text-foreground">{fixture.awayTeam}</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {fixture.venue}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default FixturesCalendar;
