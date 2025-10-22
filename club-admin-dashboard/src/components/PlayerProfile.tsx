import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, FileText, CheckCircle, XCircle, Clock, User, Shield, Activity, History } from "lucide-react";

interface PlayerProfileProps {
  player: any;
  onBack: () => void;
  getStatusBadgeVariant?: (status: string) => "default" | "secondary" | "destructive" | "outline";
  getEligibilityBadgeVariant?: (status: string) => "default" | "secondary" | "destructive" | "outline";
}

export default function PlayerProfile({
  player,
  onBack,
  getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'active': return 'default';
      case 'pending approval': return 'secondary';
      case 'suspended': return 'destructive';
      case 'retired': return 'outline';
      default: return 'secondary';
    }
  },
  getEligibilityBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'eligible': return 'default';
      case 'under review': return 'secondary';
      case 'ineligible': return 'destructive';
      case 'conditional': return 'outline';
      default: return 'secondary';
    }
  }
}: PlayerProfileProps) {
  const details = player;

  return (
    <div className="flex-1">
      <header className="bg-card border-b px-8 py-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-primary hover:text-primary/80"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Players
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Player Profile</h1>
            <p className="text-muted-foreground mt-1">{details.name} - Professional Registration Details</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg overflow-hidden">
                  {details.avatar ? (
                    <img
                      src={
                        details.avatar.startsWith('http')
                          ? details.avatar
                          : details.avatar.startsWith('/')
                            ? details.avatar
                            : `/player-documents/${details.avatar}`
                      }
                      alt={details.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-primary-foreground">
                      {details.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">{details.name}</h1>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Position:</span>
                      <span className="ml-2 font-medium">{details.position}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Age:</span>
                      <span className="ml-2 font-medium">{details.age}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Nationality:</span>
                      <span className="ml-2 font-medium">{details.nationality}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 mb-4">
                    <Badge variant={getStatusBadgeVariant(details.currentStatus?.registrationStatus || details.status)}>
                      {details.currentStatus?.registrationStatus || details.status}
                    </Badge>
                    <Badge variant={getEligibilityBadgeVariant(details.currentStatus?.eligibilityStatus || 'Under Review')}>
                      {details.currentStatus?.eligibilityStatus || 'Under Review'}
                    </Badge>
                    {details.documentCompleteness && (
                      <Badge variant={details.documentCompleteness.percentage >= 80 ? 'default' : 'secondary'}>
                        Documents: {details.documentCompleteness.percentage}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User size={16} />
                Personal
              </TabsTrigger>
              <TabsTrigger value="registration" className="flex items-center gap-2">
                <Shield size={16} />
                Registration
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText size={16} />
                Documents
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <Activity size={16} />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History size={16} />
                History
              </TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            {/* --- Personal Tab --- */}
            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                      <p className="text-foreground font-medium">{details.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                      <p className="text-foreground font-medium">
                        {details.dateOfBirth ? new Date(details.dateOfBirth).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">National Registration Card</Label>
                      <p className="text-foreground font-medium">{details.nrc}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nationality</Label>
                      <p className="text-foreground font-medium">{details.nationality}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <p className="text-foreground font-medium">{details.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-foreground font-medium">{details.email}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Physical Attributes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Height</Label>
                      <p className="text-foreground font-medium">
                        {details.physicalAttributes?.height ? `${details.physicalAttributes.height} cm` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Weight</Label>
                      <p className="text-foreground font-medium">
                        {details.physicalAttributes?.weight ? `${details.physicalAttributes.weight} kg` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Preferred Foot</Label>
                      <p className="text-foreground font-medium">
                        {details.physicalAttributes?.preferredFoot || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Blood Type</Label>
                      <p className="text-foreground font-medium">
                        {details.physicalAttributes?.bloodType || 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                      <p className="text-foreground font-medium">{details.emergencyContact?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Relationship</Label>
                      <p className="text-foreground font-medium">{details.emergencyContact?.relationship || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <p className="text-foreground font-medium">{details.emergencyContact?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-foreground font-medium">{details.emergencyContact?.email || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* --- Registration Tab --- */}
            <TabsContent value="registration" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Registration IDs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">League Registration Number</Label>
                      <p className="text-foreground font-medium">{details.leagueRegistrationNumber || 'Not Assigned'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">FAZ ID</Label>
                      <p className="text-foreground font-medium">{details.fazId || 'Not Assigned'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">CAF ID</Label>
                      <p className="text-foreground font-medium">{details.cafId || 'Not Assigned'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">FIFA ID</Label>
                      <p className="text-foreground font-medium">{details.fifaId || 'Not Assigned'}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Registration Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Registration Status</Label>
                      <div className="mt-1">
                        <Badge variant={getStatusBadgeVariant(details.currentStatus?.registrationStatus || 'Pending')}>
                          {details.currentStatus?.registrationStatus || 'Pending Approval'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Eligibility Status</Label>
                      <div className="mt-1">
                        <Badge variant={getEligibilityBadgeVariant(details.currentStatus?.eligibilityStatus || 'Under Review')}>
                          {details.currentStatus?.eligibilityStatus || 'Under Review'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Last Verification</Label>
                      <p className="text-foreground font-medium">
                        {details.currentStatus?.lastVerificationDate ?
                          new Date(details.currentStatus.lastVerificationDate).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Verification Notes</Label>
                      <p className="text-foreground font-medium">
                        {details.currentStatus?.verificationNotes || 'No notes'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* --- Documents Tab --- */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {details.documentCompleteness && (
                    <div className="mb-6 p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Document Completeness</span>
                        <Badge variant={details.documentCompleteness.percentage >= 80 ? 'default' : 'secondary'}>
                          {details.documentCompleteness.percentage}%
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${details.documentCompleteness.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {details.documentCompleteness.uploaded} of {details.documentCompleteness.total} required documents uploaded
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(details.documents || {}).map(([docType, doc]: [string, any]) => (
                      <div key={docType} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize">{docType.replace(/([A-Z])/g, ' $1').trim()}</h4>
                          {doc.verified ? (
                            <CheckCircle className="text-green-500" size={20} />
                          ) : doc.path ? (
                            <Clock className="text-yellow-500" size={20} />
                          ) : (
                            <XCircle className="text-red-500" size={20} />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {doc.path ? (
                            <>
                              <p>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                              <p>Status: {doc.verified ? 'Verified' : 'Pending Verification'}</p>
                              {doc.verificationDate && (
                                <p>Verified: {new Date(doc.verificationDate).toLocaleDateString()}</p>
                              )}
                            </>
                          ) : (
                            <p>Not uploaded</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* --- Statistics Tab --- */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Season Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Goals</Label>
                        <p className="text-2xl font-bold text-foreground">{details.stats?.goals || 0}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Assists</Label>
                        <p className="text-2xl font-bold text-foreground">{details.stats?.assists || 0}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Appearances</Label>
                        <p className="text-2xl font-bold text-foreground">{details.stats?.appearances || 0}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Yellow Cards</Label>
                        <p className="text-2xl font-bold text-yellow-500">{details.stats?.yellowCards || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Career Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Total Goals</Label>
                        <p className="text-2xl font-bold text-foreground">{details.careerStats?.totalGoals || 0}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Total Assists</Label>
                        <p className="text-2xl font-bold text-foreground">{details.careerStats?.totalAssists || 0}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Total Appearances</Label>
                        <p className="text-2xl font-bold text-foreground">{details.careerStats?.totalAppearances || 0}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Total Cards</Label>
                        <p className="text-2xl font-bold text-red-500">
                          {(details.careerStats?.totalYellowCards || 0) + (details.careerStats?.totalRedCards || 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* --- History Tab --- */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Movement History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {details.movementHistory?.map((movement: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary pl-4 pb-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground">{movement.action}</h4>
                          <Badge variant={movement.status === 'Completed' ? 'default' : 'secondary'}>
                            {movement.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(movement.date).toLocaleDateString()} • {movement.reason}
                        </p>
                        {movement.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{movement.notes}</p>
                        )}
                      </div>
                    )) || <p className="text-muted-foreground">No movement history available</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* --- Actions Tab --- */}
            <TabsContent value="actions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Player Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 flex-wrap">
                    <Button className="bg-primary hover:bg-primary/90">
                      <Edit size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline">
                      <FileText size={16} className="mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline">
                      <History size={16} className="mr-2" />
                      Transfer History
                    </Button>
                    <Button variant="outline">
                      <Shield size={16} className="mr-2" />
                      Verify Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}