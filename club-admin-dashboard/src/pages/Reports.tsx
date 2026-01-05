import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, TrendingUp, Users, Trophy } from "lucide-react";

const reports = [
  {
    id: 1,
    title: "Player Registration Report",
    description: "Monthly summary of new player registrations",
    type: "Monthly",
    lastGenerated: "2024-01-15",
    size: "2.4 MB"
  },
  {
    id: 2,
    title: "Transfer Activity Report",
    description: "Comprehensive transfer statistics and trends",
    type: "Weekly",
    lastGenerated: "2024-01-10",
    size: "1.8 MB"
  },
  {
    id: 3,
    title: "Match Results Summary",
    description: "Complete match results and statistics",
    type: "Daily",
    lastGenerated: "2024-01-18",
    size: "5.2 MB"
  },
  {
    id: 4,
    title: "Disciplinary Actions Report",
    description: "Summary of all disciplinary actions and bans",
    type: "Monthly",
    lastGenerated: "2024-01-01",
    size: "1.1 MB"
  }
];

const quickStats = [
  {
    title: "Total Reports Generated",
    value: "156",
    icon: FileText,
    change: "+12% from last month"
  },
  {
    title: "Active Players",
    value: "1,247",
    icon: Users,
    change: "+5% from last month"
  },
  {
    title: "Completed Transfers",
    value: "89",
    icon: TrendingUp,
    change: "+18% from last month"
  },
  {
    title: "Matches Played",
    value: "234",
    icon: Trophy,
    change: "+8% from last month"
  }
];

export default function Reports() {
  return (
    <div className="flex-1">
      {/* Header */}
      <header className="bg-card border-b px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Generate and download comprehensive reports</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <FileText size={16} className="mr-2" />
            Generate Custom Report
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-success mt-1">{stat.change}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <Icon size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Reports */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>Type: {report.type}</span>
                        <span>•</span>
                        <span>Size: {report.size}</span>
                        <span>•</span>
                        <span>Last: {report.lastGenerated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar size={14} className="mr-1" />
                      Schedule
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Player Reports</h3>
                <p className="text-sm text-muted-foreground mb-4">Generate detailed player statistics and registration reports</p>
                <Button variant="outline" className="w-full">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp size={32} className="text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Transfer Reports</h3>
                <p className="text-sm text-muted-foreground mb-4">Analyze transfer patterns and market activity</p>
                <Button variant="outline" className="w-full">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy size={32} className="text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Match Reports</h3>
                <p className="text-sm text-muted-foreground mb-4">Comprehensive match results and performance analytics</p>
                <Button variant="outline" className="w-full">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}