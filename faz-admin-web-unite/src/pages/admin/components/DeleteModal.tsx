import { Button } from "@/components/ui/button";

export default function DeleteModal({
  open,
  title = "Delete",
  description = "Are you sure?",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onCancel,
  onConfirm,
  confirming = false,
}: {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  confirming?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="absolute inset-x-0 top-24 mx-auto w-full max-w-md rounded-xl bg-card text-card-foreground shadow-xl border border-border">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
          <Button variant="outline" onClick={onCancel} disabled={confirming}>
            {cancelLabel}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={confirming}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
