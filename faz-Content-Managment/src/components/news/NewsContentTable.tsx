import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Send,
  Archive,
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: "published" | "draft" | "scheduled";
  author: string;
  date: string;
  category?: string;
}

interface NewsContentTableProps {
  items: ContentItem[];
  selectedIds: string[];
  onSelectItem: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
}

const NewsContentTable = ({
  items,
  selectedIds,
  onSelectItem,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  onPublish,
}: NewsContentTableProps) => {
  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < items.length;

  const statusBadge = (status: "published" | "draft" | "scheduled") => {
    const styles = {
      published: "bg-primary/10 text-primary border-primary/20",
      draft: "bg-muted text-muted-foreground border-border",
      scheduled: "bg-accent/10 text-accent border-accent/20",
    };

    return (
      <Badge variant="outline" className={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                ref={(ref) => {
                  if (ref) {
                    (ref as any).indeterminate = someSelected;
                  }
                }}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-28">Type</TableHead>
            <TableHead className="w-28">Category</TableHead>
            <TableHead className="w-28">Status</TableHead>
            <TableHead className="w-32">Author</TableHead>
            <TableHead className="w-32">Date</TableHead>
            <TableHead className="w-16 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                <p className="text-muted-foreground">No articles found</p>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} className="table-row">
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={(checked) => onSelectItem(item.id, !!checked)}
                  />
                </TableCell>
                <TableCell>
                  <span className="font-medium line-clamp-1">{item.title}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-muted-foreground capitalize">
                    {item.category?.replace("-", " ") || "General"}
                  </span>
                </TableCell>
                <TableCell>{statusBadge(item.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.author}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.date}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
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
                      {item.status === "draft" && (
                        <DropdownMenuItem onClick={() => onPublish?.(item.id)}>
                          <Send className="mr-2 h-4 w-4" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete?.(item.id)}
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

export default NewsContentTable;
