import { Clock, UserCheck, ArrowRightLeft, AlertTriangle } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "registration",
    message: "Moses Banda registered successfully",
    time: "2 hours ago",
    icon: UserCheck,
    color: "text-success bg-success/10"
  },
  {
    id: 2,
    type: "transfer",
    message: "Transfer request submitted for John Phiri",
    time: "5 hours ago",
    icon: ArrowRightLeft,
    color: "text-primary bg-primary/10"
  },
  {
    id: 3,
    type: "disciplinary",
    message: "Patrick Mulenga received disciplinary action",
    time: "1 day ago",
    icon: AlertTriangle,
    color: "text-destructive bg-destructive/10"
  }
];

export default function RecentActivity() {
  return (
    <div className="bg-card rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {activity.message}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-medium">JM</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">John Mwanza</p>
            <p className="text-xs text-muted-foreground">Club Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}