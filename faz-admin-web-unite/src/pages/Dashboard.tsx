import { Building2, Users, ArrowRightLeft, Shield, ArrowUpRight, FileCheck, AlertTriangle, Clock, UserPlus } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import WorkQueue from "@/components/dashboard/WorkQueue";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const workQueueItems = [
    {
      id: "1",
      title: "Transfer Approvals",
      description: "12 transfers awaiting approval",
      count: 12,
      icon: ArrowRightLeft,
      iconColor: "destructive" as const,
      actionLabel: "Review Now",
      actionVariant: "destructive" as const,
    },
    {
      id: "2",
      title: "Club Applications",
      description: "5 new club applications",
      count: 5,
      icon: FileCheck,
      iconColor: "warning" as const,
      actionLabel: "Review Now",
      actionVariant: "warning" as const,
    },
    {
      id: "3",
      title: "Ban Requests",
      description: "8 ban requests pending",
      count: 8,
      icon: Shield,
      iconColor: "warning" as const,
      actionLabel: "Review Now",
      actionVariant: "warning" as const,
    },
    {
      id: "4",
      title: "Compliance Issues",
      description: "23 documents expiring soon",
      count: 23,
      icon: AlertTriangle,
      iconColor: "primary" as const,
      actionLabel: "View Details",
      actionVariant: "default" as const,
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "transfer" as const,
      title: "Transfer approved: Emmanuel Banda from Nkana FC to Power Dynamos FC",
      description: "2 minutes ago",
      timestamp: "2 minutes ago",
      actor: "John Mwanza",
      icon: ArrowRightLeft,
    },
    {
      id: "2",
      type: "club" as const,
      title: "New club approved: Lusaka United FC registration completed",
      description: "15 minutes ago",
      timestamp: "15 minutes ago",
      actor: "Sarah Tembo",
      icon: Building2,
    },
    {
      id: "3",
      type: "ban" as const,
      title: "Ban imposed: Collins Sikombe suspended for 3 matches (violent conduct)",
      description: "1 hour ago",
      timestamp: "1 hour ago",
      actor: "Players' Status Committee",
      icon: Shield,
    },
    {
      id: "4",
      type: "compliance" as const,
      title: "Compliance alert: 15 players' medical certificates expire within 30 days",
      description: "2 hours ago",
      timestamp: "2 hours ago",
      actor: "System Generated",
      icon: AlertTriangle,
    },
    {
      id: "5",
      type: "registration" as const,
      title: "Mass registration: 47 new players registered by Zanaco FC",
      description: "3 hours ago",
      timestamp: "3 hours ago",
      actor: "Club Admin",
      icon: UserPlus,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, John. Here's what's happening with Zambian football today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Registered Clubs"
          value="247"
          change="↑ +12 this month"
          changeType="positive"
          icon={Building2}
          iconColor="primary"
        />
        <StatCard
          title="Registered Players"
          value="18,542"
          change="↑ +234 this month"
          changeType="positive"
          icon={Users}
          iconColor="success"
        />
        <StatCard
          title="Pending Transfers"
          value="12"
          change="⚠ Needs attention"
          changeType="negative"
          icon={ArrowRightLeft}
          iconColor="warning"
        />
        <StatCard
          title="Active Bans"
          value="8"
          change="⏱ 3 expire soon"
          changeType="neutral"
          icon={Shield}
          iconColor="destructive"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Work Queues - 2/3 width */}
        <div className="lg:col-span-2">
          <WorkQueue title="Work Queues" items={workQueueItems} />
        </div>

        {/* Seasons & Windows - 1/3 width */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg border border-border shadow-card">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-card-foreground">Seasons & Windows</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-success">2024 Season</span>
                  <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded">Active</span>
                </div>
                <p className="text-xs text-muted-foreground">March 1 - November 30, 2024</p>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary">Transfer Window</span>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Open</span>
                </div>
                <p className="text-xs text-muted-foreground">Closes in 18 days</p>
                <div className="mt-2 bg-background rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Registration Window</span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Closed</span>
                </div>
                <p className="text-xs text-muted-foreground">Opens January 1, 2025</p>
              </div>

              <Button variant="outline" className="w-full">
                Manage Windows
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <RecentActivity activities={recentActivities} />

        {/* Charts Placeholder */}
        <div className="bg-card rounded-lg border border-border shadow-card">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-card-foreground">Player Registration Trends</h3>
            <select className="text-sm bg-background border border-input rounded px-3 py-1">
              <option>Last 12 months</option>
              <option>Last 6 months</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="p-6 h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowUpRight className="w-8 h-8" />
              </div>
              <p>Registration trends chart would appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}