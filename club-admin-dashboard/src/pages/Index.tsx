import { Users, UserCheck, Clock, Ban } from "lucide-react";

import StatsCard from "@/components/StatsCard";
import PlayerRoster from "@/components/PlayerRoster";
import RecentActivity from "@/components/RecentActivity";


const Index = () => {
  return (
    <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Club Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your club's players and operations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search players..."
                  className="pl-4 pr-4 py-2 border rounded-lg bg-background text-sm w-80"
                />
              </div>
              <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-destructive-foreground text-xs font-bold">1</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8">
          {/* League Table removed from dashboard */}
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Players"
              value="24"
              subtitle="+ 1 this month"
              icon={Users}
              color="blue"
            />
            <StatsCard
              title="Active Players"
              value="22"
              subtitle="91.7% active"
              icon={UserCheck}
              color="green"
            />
            <StatsCard
              title="Pending Transfers"
              value="5"
              subtitle="3 outgoing"
              icon={Clock}
              color="orange"
            />
            <StatsCard
              title="Banned Players"
              value="2"
              subtitle="Under review"
              icon={Ban}
              color="red"
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Player Roster - Takes 2 columns */}
            <div className="xl:col-span-2">
              <PlayerRoster />
            </div>
            
            {/* Recent Activity - Takes 1 column */}
            <div>
              <RecentActivity />
            </div>
          </div>
        </main>
    </div>
  );
};

export default Index;
