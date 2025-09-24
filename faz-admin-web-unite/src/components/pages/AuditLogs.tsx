import { LucideIcon, Archive, Search, Filter, Download, Eye, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AuditLogsProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const auditLogs = [
  {
    id: 1,
    timestamp: "2024-01-15 14:30:25",
    user: "John Mwanza",
    action: "Transfer Approved",
    resource: "Player Transfer #TR-2024-001",
    status: "Success",
    ip: "192.168.1.100",
    details: "Approved transfer of Kennedy Musonda from Zanaco FC to Power Dynamos FC"
  },
  {
    id: 2,
    timestamp: "2024-01-15 14:25:12",
    user: "Sarah Chanda",
    action: "Club Registration",
    resource: "Club Application #CA-2024-015",
    status: "Success",
    ip: "192.168.1.105",
    details: "Registered new club: Forest Rangers Youth Academy"
  },
  {
    id: 3,
    timestamp: "2024-01-15 14:20:08",
    user: "Michael Banda",
    action: "Player Ban Modified",
    resource: "Player Ban #PB-2024-003",
    status: "Warning",
    ip: "192.168.1.110",
    details: "Modified ban duration for player Joseph Phiri from 6 to 4 matches"
  },
  {
    id: 4,
    timestamp: "2024-01-15 14:15:45",
    user: "System",
    action: "Compliance Check",
    resource: "Club Compliance #CC-2024-089",
    status: "Failed",
    ip: "127.0.0.1",
    details: "Automated compliance check failed for Nkana FC - missing financial documents"
  },
  {
    id: 5,
    timestamp: "2024-01-15 14:10:33",
    user: "Grace Tembo",
    action: "Report Generated",
    resource: "Monthly Report #MR-2024-01",
    status: "Success",
    ip: "192.168.1.115",
    details: "Generated monthly transfer activity report for January 2024"
  },
  {
    id: 6,
    timestamp: "2024-01-15 14:05:21",
    user: "David Mulenga",
    action: "Data Export",
    resource: "Player Database",
    status: "Success",
    ip: "192.168.1.120",
    details: "Exported player statistics for league analysis"
  },
];

const stats = [
  { title: "Total Actions", value: "1,247", change: "+89", icon: Archive },
  { title: "Failed Actions", value: "23", change: "-5", icon: XCircle },
  { title: "Warning Actions", value: "45", change: "+12", icon: AlertTriangle },
  { title: "Active Users", value: "18", change: "+3", icon: CheckCircle },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Success':
      return <CheckCircle className="w-4 h-4 text-success" />;
    case 'Failed':
      return <XCircle className="w-4 h-4 text-destructive" />;
    case 'Warning':
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    default:
      return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Success':
      return 'success';
    case 'Failed':
      return 'destructive';
    case 'Warning':
      return 'warning';
    default:
      return 'secondary';
  }
};

export default function AuditLogs({ title, description, icon: Icon }: AuditLogsProps) {
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
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <Badge variant={stat.change.startsWith('+') ? 'default' : 'secondary'} className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <stat.icon className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search audit logs..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{log.user}</div>
                    <div className="text-xs text-muted-foreground">{log.ip}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.action}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{log.resource}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <Badge variant={getStatusVariant(log.status)}>
                        {log.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm text-muted-foreground truncate" title={log.details}>
                      {log.details}
                    </div>
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