import { LucideIcon } from "lucide-react";

interface SimplePageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}

export default function SimplePage({ title, description, icon: Icon, children }: SimplePageProps) {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground max-w-md mx-auto">{description}</p>
        {children}
      </div>
    </div>
  );
}