import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Send, Trash2, Tag, Archive } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onPublish: () => void;
  onDelete: () => void;
  onChangeCategory: (category: string) => void;
  onArchive: () => void;
}

const CATEGORIES = [
  { value: "teams", label: "Teams" },
  { value: "fixtures", label: "Fixtures" },
  { value: "competitions", label: "Competitions" },
  { value: "youth-development", label: "Youth Development" },
  { value: "womens-football", label: "Women's Football" },
  { value: "stadium-infrastructure", label: "Stadium Infrastructure" },
  { value: "legends-corner", label: "Legends Corner" },
  { value: "general", label: "General" },
];

const BulkActions = ({
  selectedCount,
  onPublish,
  onDelete,
  onChangeCategory,
  onArchive,
}: BulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
      <span className="text-sm font-medium">
        {selectedCount} article{selectedCount !== 1 ? "s" : ""} selected
      </span>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm" onClick={onPublish}>
          <Send className="mr-2 h-4 w-4" />
          Publish
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Tag className="mr-2 h-4 w-4" />
              Category
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {CATEGORIES.map((cat) => (
              <DropdownMenuItem
                key={cat.value}
                onClick={() => onChangeCategory(cat.value)}
              >
                {cat.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" onClick={onArchive}>
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </Button>

        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;
