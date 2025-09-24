import { LucideIcon, Shield, AlertTriangle, CheckCircle, XCircle, Eye, Filter, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface ComplianceMonitorProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const complianceChecks = [
  {
    id: 1,
    club: "Zanaco FC",
    category: "Financial",
    requirement: "Annual Financial Statements",
    status: "Compliant",
    lastCheck: "2024-01-15",
    nextDue: "2024-12-31",
    score: 95,
    issues: 0
  },
  {
    id: 2,
    club: "Power Dynamos FC",
    category: "Licensing",
    requirement: "Club License Renewal",
    status: "Pending",
    lastCheck: "2024-01-10",
    nextDue: "2024-02-15",
    score: 78,
    issues: 2
  },
  {
    id: 3,
    club: "Nkana FC",
    category: "Financial",
    requirement: "Player Salary Documentation",
    status: "Non-Compliant",
    lastCheck: "2024-01-12",
    nextDue: "2024-01-31",
    score: 45,
    issues: 5
  },
  {
    id: 4,
    club: "Forest Rangers FC",
    category: "Youth Development",
    requirement: "Youth Academy Report",
    status: "Compliant",
    lastCheck: "2024-01-14",
    nextDue: "2024-06-30",
    score: 88,
    issues: 1
  },
  {
    id: 5,
    club: "Green Buffaloes FC",
    category: "Infrastructure",
    requirement: "Stadium Safety Certification",
    status: "Warning",
    lastCheck: "2024-01-08",
    nextDue: "2024-03-01",
    score: 65,
    issues: 3
  },
];

const stats = [
  { title: "Total Clubs", value: "18", status: "Monitored", icon: Shield, color: "text-primary" },
  { title: "Compliant", value: "12", status: "66.7%", icon: CheckCircle, color: "text-success" },
  { title: "Warnings", value: "4", status: "22.2%", icon: AlertTriangle, color: "text-warning" },
  { title: "Non-Compliant", value: "2", status: "11.1%", icon: XCircle, color: "text-destructive" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Compliant':
      return <CheckCircle className="w-4 h-4 text-success" />;
    case 'Non-Compliant':
      return <XCircle className="w-4 h-4 text-destructive" />;
    case 'Warning':
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    case 'Pending':
      return <Clock className="w-4 h-4 text-info" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Compliant':
      return 'success';
    case 'Non-Compliant':
      return 'destructive';
    case 'Warning':
      return 'warning';
    case 'Pending':
      return 'info';
    default:
      return 'outline';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-destructive';
};

export default function ComplianceMonitor({ title, description, icon: Icon }: ComplianceMonitorProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-primary">
            <Shield className="w-4 h-4 mr-2" />
            Run Check
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <Badge variant="outline" className="text-xs">
                      {stat.status}
                    </Badge>
                  </div>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance Overview Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Compliance by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Financial Compliance</span>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Licensing</span>
                <span className="text-sm text-muted-foreground">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Youth Development</span>
                <span className="text-sm text-muted-foreground">68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Infrastructure</span>
                <span className="text-sm text-muted-foreground">82%</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Violations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-destructive rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nkana FC</p>
                  <p className="text-xs text-muted-foreground">Missing salary documentation</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Green Buffaloes FC</p>
                  <p className="text-xs text-muted-foreground">Stadium safety concerns</p>
                  <p className="text-xs text-muted-foreground">5 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-info rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Power Dynamos FC</p>
                  <p className="text-xs text-muted-foreground">License renewal pending</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Compliance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Input placeholder="Search clubs..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Club</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complianceChecks.map((check) => (
                <TableRow key={check.id}>
                  <TableCell>
                    <div className="font-medium">{check.club}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{check.category}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{check.requirement}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(check.status)}
                      <Badge variant={getStatusVariant(check.status)}>
                        {check.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getScoreColor(check.score)}`}>
                      {check.score}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {check.issues > 0 ? (
                      <Badge variant="destructive" className="text-xs">
                        {check.issues}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {check.nextDue}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}