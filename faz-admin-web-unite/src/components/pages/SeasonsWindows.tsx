import { LucideIcon, Calendar, Plus, Edit, Trash2, Play, Pause, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface SeasonsWindowsProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const seasons = [
  {
    id: 1,
    name: "2024 League Season",
    startDate: "2024-03-01",
    endDate: "2024-11-30",
    status: "Active",
    competitions: ["MTN Super League", "ABSA Cup", "Champions League"],
    teams: 18
  },
  {
    id: 2,
    name: "2023 League Season",
    startDate: "2023-03-01",
    endDate: "2023-11-30",
    status: "Completed",
    competitions: ["MTN Super League", "ABSA Cup"],
    teams: 18
  },
];

const transferWindows = [
  {
    id: 1,
    name: "January 2024 Transfer Window",
    type: "Mid-Season",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    status: "Active",
    transfers: 45,
    registrations: 123
  },
  {
    id: 2,
    name: "July 2023 Transfer Window",
    type: "Pre-Season",
    startDate: "2023-07-01",
    endDate: "2023-08-31",
    status: "Closed",
    transfers: 167,
    registrations: 289
  },
  {
    id: 3,
    name: "January 2023 Transfer Window",
    type: "Mid-Season",
    startDate: "2023-01-01",
    endDate: "2023-01-31",
    status: "Closed",
    transfers: 89,
    registrations: 156
  },
];

const registrationPeriods = [
  {
    id: 1,
    name: "Player Registration Period 2024",
    type: "Player Registration",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    status: "Upcoming",
    applications: 0
  },
  {
    id: 2,
    name: "Club License Renewal 2024",
    type: "Club Licensing",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    status: "Active",
    applications: 12
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Upcoming':
      return 'secondary';
    case 'Closed':
    case 'Completed':
      return 'outline';
    default:
      return 'secondary';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'text-success';
    case 'Upcoming':
      return 'text-info';
    case 'Closed':
    case 'Completed':
      return 'text-muted-foreground';
    default:
      return 'text-muted-foreground';
  }
};

export default function SeasonsWindows({ title, description, icon: Icon }: SeasonsWindowsProps) {
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
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Period
        </Button>
      </div>

      {/* Current Season Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Season</p>
                <p className="text-xl font-bold">2024 League</p>
                <Badge variant="default" className="mt-2">Active</Badge>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transfer Window</p>
                <p className="text-xl font-bold">January 2024</p>
                <Badge variant="default" className="mt-2">Open</Badge>
              </div>
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Registrations</p>
                <p className="text-xl font-bold">2</p>
                <Badge variant="secondary" className="mt-2">In Progress</Badge>
              </div>
              <div className="w-8 h-8 bg-info/20 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seasons */}
      <Card>
        <CardHeader>
          <CardTitle>Football Seasons</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Season</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Competitions</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seasons.map((season) => (
                <TableRow key={season.id}>
                  <TableCell>
                    <div className="font-medium">{season.name}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {season.startDate} to {season.endDate}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(season.status)}>
                      {season.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {season.competitions.slice(0, 2).map((comp, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                      {season.competitions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{season.competitions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{season.teams}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transfer Windows */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Windows</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Window</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transfers</TableHead>
                <TableHead>Registrations</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transferWindows.map((window) => (
                <TableRow key={window.id}>
                  <TableCell>
                    <div className="font-medium">{window.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{window.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {window.startDate} to {window.endDate}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(window.status)}>
                      {window.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{window.transfers}</TableCell>
                  <TableCell>{window.registrations}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {window.status === 'Active' ? (
                          <DropdownMenuItem>
                            <Pause className="mr-2 h-4 w-4" />
                            Close Window
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <Play className="mr-2 h-4 w-4" />
                            Open Window
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Registration Periods */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Periods</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrationPeriods.map((period) => (
                <TableRow key={period.id}>
                  <TableCell>
                    <div className="font-medium">{period.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{period.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {period.startDate} to {period.endDate}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(period.status)}>
                      {period.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{period.applications}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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