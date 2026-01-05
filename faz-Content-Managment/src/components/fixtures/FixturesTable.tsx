import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Edit, Trash2, Copy, Eye } from "lucide-react";
import { Fixture } from "./FixtureForm";

interface FixturesTableProps {
  fixtures: Fixture[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (fixture: Fixture) => void;
  onDelete: (id: string) => void;
  onDuplicate: (fixture: Fixture) => void;
}

const FixturesTable = ({
  fixtures,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  onDuplicate,
}: FixturesTableProps) => {
  const statusStyles: Record<string, string> = {
    upcoming: "bg-info/10 text-info border-info/20",
    live: "bg-accent text-accent-foreground border-accent/20 animate-pulse",
    completed: "bg-muted text-muted-foreground border-muted",
    postponed: "bg-warning/10 text-warning border-warning/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(fixtures.map(f => f.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(i => i !== id));
    }
  };

  const getResult = (fixture: Fixture) => {
    if (fixture.status === "completed" || fixture.status === "live") {
      const home = fixture.homeScore ?? 0;
      const away = fixture.awayScore ?? 0;
      if (home > away) return "W";
      if (home < away) return "L";
      return "D";
    }
    return "-";
  };

  const getResultStyle = (result: string) => {
    switch (result) {
      case "W":
        return "bg-success/10 text-success";
      case "L":
        return "bg-destructive/10 text-destructive";
      case "D":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === fixtures.length && fixtures.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Match</TableHead>
            <TableHead>Competition</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Result</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fixtures.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No fixtures found
              </TableCell>
            </TableRow>
          ) : (
            fixtures.map((fixture) => (
              <TableRow key={fixture.id} className="hover:bg-muted/20">
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(fixture.id)}
                    onCheckedChange={(checked) => handleSelectOne(fixture.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{fixture.homeTeam}</span>
                    <span className="text-sm text-muted-foreground">vs {fixture.awayTeam}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{fixture.competition}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{fixture.date}</span>
                    <span className="text-xs text-muted-foreground">{fixture.time}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{fixture.venue}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", statusStyles[fixture.status])}>
                    {fixture.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {fixture.status === "completed" || fixture.status === "live" ? (
                    <span className="font-mono font-bold text-foreground">
                      {fixture.homeScore} - {fixture.awayScore}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={cn("badge-status text-xs", getResultStyle(getResult(fixture)))}>
                    {getResult(fixture)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(fixture)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(fixture)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(fixture.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FixturesTable;
