import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: "published" | "draft" | "scheduled";
  author: string;
  date: string;
}

interface ContentTableProps {
  items: ContentItem[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ContentTable = ({ items, onView, onEdit, onDelete }: ContentTableProps) => {
  const statusBadge = (status: ContentItem["status"]) => {
    const styles = {
      published: "badge-published",
      draft: "badge-draft",
      scheduled: "badge-scheduled",
    };
    const labels = {
      published: "Published",
      draft: "Draft",
      scheduled: "Scheduled",
    };
    return <span className={`badge-status ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Title
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Type
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Author
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Date
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr 
              key={item.id} 
              className="table-row animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <td className="px-6 py-4">
                <p className="font-medium text-foreground">{item.title}</p>
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{item.type}</td>
              <td className="px-6 py-4">{statusBadge(item.status)}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{item.author}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{item.date}</td>
              <td className="px-6 py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView?.(item.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(item.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(item.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContentTable;
