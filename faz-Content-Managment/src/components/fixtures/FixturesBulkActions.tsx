import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Trash2, Download, CheckCircle, Clock, XCircle, ChevronDown } from "lucide-react";

interface FixturesBulkActionsProps {
  selectedCount: number;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
  onExport: () => void;
}

const FixturesBulkActions = ({
  selectedCount,
  onStatusChange,
  onDelete,
  onExport,
}: FixturesBulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2">
      <span className="text-sm font-medium text-foreground">
        {selectedCount} selected
      </span>
      
      <div className="h-4 w-px bg-border" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Change Status
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onStatusChange("upcoming")}>
            <Clock className="mr-2 h-4 w-4 text-info" />
            Upcoming
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("completed")}>
            <CheckCircle className="mr-2 h-4 w-4 text-success" />
            Completed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("postponed")}>
            <Clock className="mr-2 h-4 w-4 text-warning" />
            Postponed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("cancelled")}>
            <XCircle className="mr-2 h-4 w-4 text-destructive" />
            Cancelled
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>

      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
};

export default FixturesBulkActions;
