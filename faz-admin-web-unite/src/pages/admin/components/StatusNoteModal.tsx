import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function StatusNoteModal({
  open,
  title,
  label = "Message",
  placeholder = "Type your message…",
  submitLabel = "Send",
  defaultValue = "",
  onCancel,
  onSubmit,
  busy = false,
}: {
  open: boolean;
  title: string;
  label?: string;
  placeholder?: string;
  submitLabel?: string;
  defaultValue?: string;
  onCancel: () => void;
  onSubmit: (note: string) => void;
  busy?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const first = useRef<boolean>(true);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      first.current = false;
    }
  }, [open, defaultValue]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="absolute inset-x-0 top-20 mx-auto w-full max-w-lg rounded-xl bg-card text-card-foreground shadow-xl border border-border">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="px-5 py-4 space-y-2">
          <label className="block text-sm font-medium">{label}</label>
          <textarea
            className="w-full rounded-md border border-input bg-background p-2 text-sm"
            rows={5}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="px-5 py-3 border-t border-border flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button onClick={() => onSubmit(value)} disabled={busy}>
            {busy ? "Sending…" : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
