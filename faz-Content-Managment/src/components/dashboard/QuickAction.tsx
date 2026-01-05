import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: "primary" | "accent" | "success";
}

const QuickAction = ({ title, description, icon: Icon, href, color = "primary" }: QuickActionProps) => {
  const colorStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    accent: "bg-accent text-accent-foreground hover:bg-accent/90",
    success: "bg-success text-success-foreground hover:bg-success/90",
  };

  return (
    <Link
      to={href}
      className={`group flex items-center gap-4 rounded-xl p-4 transition-all duration-200 hover:shadow-elevated ${colorStyles[color]}`}
    >
      <div className="rounded-lg bg-background/20 p-3">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm opacity-80">{description}</p>
      </div>
      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
    </Link>
  );
};

export default QuickAction;
