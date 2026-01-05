import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import ContentTable from "@/components/dashboard/ContentTable";
import FixtureCard from "@/components/dashboard/FixtureCard";
import QuickAction from "@/components/dashboard/QuickAction";
import { 
  Newspaper, 
  Users, 
  Trophy, 
  Calendar, 
  TrendingUp,
  PlusCircle,
  FileEdit,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const recentContent = [
  {
    id: "1",
    title: "SAFA Announces New National Team Coach",
    type: "News",
    status: "published" as const,
    author: "Admin",
    date: "Dec 21, 2024",
  },
  {
    id: "2",
    title: "Premier League Fixtures Update",
    type: "Fixtures",
    status: "published" as const,
    author: "Editor",
    date: "Dec 20, 2024",
  },
  {
    id: "3",
    title: "Youth Development Program Launch",
    type: "News",
    status: "draft" as const,
    author: "Admin",
    date: "Dec 19, 2024",
  },
  {
    id: "4",
    title: "Stadium Renovation Project",
    type: "Article",
    status: "scheduled" as const,
    author: "Content Team",
    date: "Dec 25, 2024",
  },
  {
    id: "5",
    title: "National Cup Quarter Finals Draw",
    type: "Competition",
    status: "published" as const,
    author: "Admin",
    date: "Dec 18, 2024",
  },
];

const upcomingFixtures = [
  {
    homeTeam: "Orlando Pirates",
    awayTeam: "Kaizer Chiefs",
    date: "Dec 24, 2024",
    time: "15:30",
    venue: "FNB Stadium",
    competition: "Premier League",
    status: "upcoming" as const,
  },
  {
    homeTeam: "Mamelodi Sundowns",
    awayTeam: "Cape Town City",
    homeScore: 2,
    awayScore: 1,
    date: "Dec 22, 2024",
    time: "17:00",
    venue: "Loftus Versfeld",
    competition: "Premier League",
    status: "live" as const,
  },
];

const Index = () => {
  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back, Admin">
      {/* Stats Row */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Articles"
          value="1,247"
          change="+12% from last month"
          changeType="positive"
          icon={Newspaper}
        />
        <StatCard
          title="Registered Teams"
          value="384"
          change="+5 new teams"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Active Competitions"
          value="12"
          change="2 starting soon"
          changeType="neutral"
          icon={Trophy}
        />
        <StatCard
          title="Upcoming Fixtures"
          value="48"
          change="This week"
          changeType="neutral"
          icon={Calendar}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <QuickAction
            title="Create News Article"
            description="Publish latest updates"
            icon={PlusCircle}
            href="/news/new"
            color="primary"
          />
          <QuickAction
            title="Manage Fixtures"
            description="Update match schedules"
            icon={FileEdit}
            href="/fixtures"
            color="accent"
          />
          <QuickAction
            title="Upload Media"
            description="Add photos & videos"
            icon={ImagePlus}
            href="/media"
            color="success"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Content - 2 columns */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent Content</h2>
            <Button variant="ghost" size="sm">
              View All
              <TrendingUp className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <ContentTable items={recentContent} />
        </div>

        {/* Upcoming Fixtures - 1 column */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Live & Upcoming</h2>
            <Button variant="ghost" size="sm">
              All Fixtures
            </Button>
          </div>
          <div className="space-y-4">
            {upcomingFixtures.map((fixture, index) => (
              <FixtureCard key={index} {...fixture} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
