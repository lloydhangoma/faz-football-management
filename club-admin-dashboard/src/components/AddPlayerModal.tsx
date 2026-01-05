import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoaderSpinner from "./LoaderSpinner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const API_BASE_URL = "/api";

interface AddPlayerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPlayerAdded: () => void;
}

export const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ isOpen, onOpenChange, onPlayerAdded }) => {
  const [addForm, setAddForm] = useState<any>({
    name: "",
    age: "",
    dateOfBirth: "",
    nrc: "",
    position: "Forward",
    status: "Active",
    nationality: "",
    phone: "",
    email: "",
    valuation: "",
    contractExpiry: "",
    passportNumber: "",
    passportCountry: "",
    passportExpiry: "",
    placeOfBirth: "",
    countryOfBirth: "",
    physicalAttributes: {
      height: "",
      weight: "",
      preferredFoot: "Right",
      bloodType: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
      address: ""
    },
    guardian: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
    agent: {
      name: "",
      license: "",
      phone: "",
      email: "",
    },
    contractStart: "",
    leagueRegistrationNumber: "",
    fazId: "",
    cafId: "",
    fifaId: "",
  });
  const [addFiles, setAddFiles] = useState<{[key: string]: File}>({});
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [tab, setTab] = useState("basic");

  // We use httpOnly cookie for auth; XHR must send credentials

  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setAddForm((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setAddForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (fieldName: string, file: File | null) => {
    if (file) {
      setAddFiles(prev => ({ ...prev, [fieldName]: file }));
    } else {
      const newFiles = { ...addFiles };
      delete newFiles[fieldName];
      setAddFiles(newFiles);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    setAddSuccess("");
    setUploadProgress(null);

    try {
      const formData = new FormData();

  

      // Only include fields that are not IDs assigned by backend
      Object.entries(addForm).forEach(([key, value]) => {
        if (["leagueRegistrationNumber", "fazId", "cafId", "fifaId"].includes(key)) return;
        if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });

      Object.entries(addFiles).forEach(([fieldName, file]) => {
        formData.append(fieldName, file);
      });

      // Use XMLHttpRequest for upload progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE_URL}/players`);
        // send httpOnly cookie for authentication
        xhr.withCredentials = true;

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setAddSuccess("Player registered successfully!");
            setAddForm({
              name: "",
              age: "",
              dateOfBirth: "",
              nrc: "",
              position: "Forward",
              status: "Active",
              nationality: "",
              phone: "",
              email: "",
              valuation: "",
              passportNumber: "",
              passportCountry: "",
              passportExpiry: "",
              placeOfBirth: "",
              countryOfBirth: "",
              contractExpiry: "",
              physicalAttributes: {
                height: "",
                weight: "",
                preferredFoot: "Right",
                bloodType: ""
              },
              emergencyContact: {
                name: "",
                relationship: "",
                phone: "",
                email: "",
                address: ""
              },
              guardian: {
                name: "",
                relationship: "",
                phone: "",
                email: "",
              },
              leagueRegistrationNumber: "",
              fazId: "",
              cafId: "",
              fifaId: "",
            });
            setAddFiles({});
            onPlayerAdded();
            setUploadProgress(null);
            onOpenChange(false);
            resolve();
          } else {
            try {
              const { message } = JSON.parse(xhr.responseText || '{}');
              setAddError(message || 'Failed to register player');
            } catch {
              setAddError('Failed to register player');
            }
            setUploadProgress(null);
            reject(new Error('Failed to register player'));
          }
        };

        xhr.onerror = () => {
          setAddError('Network error.');
          setUploadProgress(null);
          reject(new Error('Network error.'));
        };

        xhr.send(formData);
      });
    } catch (err: any) {
      setAddError(err.message || "Registration failed.");
    } finally {
      setAddLoading(false);
    }
  };

  // Helper for file preview
  const renderFilePreview = (file: File | undefined) =>
    file ? <span className="text-green-700">{file.name}</span> : <span className="text-muted-foreground">Not uploaded</span>;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Player</DialogTitle>
          <DialogDescription>
            Fill out the details below to register a new player.
          </DialogDescription>
        </DialogHeader>
        {addLoading && <LoaderSpinner />}
        <form onSubmit={handleAddSubmit} className="space-y-6">
          {addError && <div className="text-sm text-destructive font-medium">{addError}</div>}
          {addSuccess && <div className="text-sm text-green-700 font-medium">{addSuccess}</div>}
          {uploadProgress !== null && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <div className="text-xs text-muted-foreground mt-1">Uploading: {uploadProgress}%</div>
            </div>
          )}

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="physical">Physical</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>

            {/* Basic Info */}
            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" value={addForm.name || ""} onChange={handleAddFormChange} required />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" value={addForm.dateOfBirth || ""} onChange={handleAddFormChange} type="date" required />
                </div>
                <div>
                  <Label htmlFor="nrc">National Registration Card *</Label>
                  <Input id="nrc" name="nrc" value={addForm.nrc || ""} onChange={handleAddFormChange} required />
                </div>
                <div>
                  <Label htmlFor="passportNumber">Passport Number</Label>
                  <Input id="passportNumber" name="passportNumber" value={addForm.passportNumber || ""} onChange={handleAddFormChange} />
                </div>
                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Select value={addForm.position || ""} onValueChange={(value) => setAddForm((prev: any) => ({ ...prev, position: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                      <SelectItem value="Defender">Defender</SelectItem>
                      <SelectItem value="Midfielder">Midfielder</SelectItem>
                      <SelectItem value="Forward">Forward</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Input id="nationality" name="nationality" value={addForm.nationality || ""} onChange={handleAddFormChange} required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" value={addForm.phone || ""} onChange={handleAddFormChange} required />
                </div>
                <div>
                  <Label htmlFor="placeOfBirth">Place of Birth</Label>
                  <Input id="placeOfBirth" name="placeOfBirth" value={addForm.placeOfBirth || ""} onChange={handleAddFormChange} />
                </div>
                <div>
                  <Label htmlFor="countryOfBirth">Country of Birth</Label>
                  <Input id="countryOfBirth" name="countryOfBirth" value={addForm.countryOfBirth || ""} onChange={handleAddFormChange} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" value={addForm.email || ""} onChange={handleAddFormChange} type="email" required />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact.name">Contact Name *</Label>
                    <Input id="emergencyContact.name" name="emergencyContact.name" value={addForm.emergencyContact?.name || ""} onChange={handleAddFormChange} required />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact.relationship">Relationship *</Label>
                    <Input id="emergencyContact.relationship" name="emergencyContact.relationship" value={addForm.emergencyContact?.relationship || ""} onChange={handleAddFormChange} required />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact.phone">Contact Phone *</Label>
                    <Input id="emergencyContact.phone" name="emergencyContact.phone" value={addForm.emergencyContact?.phone || ""} onChange={handleAddFormChange} required />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact.email">Contact Email</Label>
                    <Input id="emergencyContact.email" name="emergencyContact.email" value={addForm.emergencyContact?.email || ""} onChange={handleAddFormChange} type="email" />
                  </div>
                </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Guardian (if under 18)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="guardian.name">Guardian Name</Label>
                        <Input id="guardian.name" name="guardian.name" value={addForm.guardian?.name || ""} onChange={handleAddFormChange} />
                      </div>
                      <div>
                        <Label htmlFor="guardian.relationship">Relationship</Label>
                        <Input id="guardian.relationship" name="guardian.relationship" value={addForm.guardian?.relationship || ""} onChange={handleAddFormChange} />
                      </div>
                      <div>
                        <Label htmlFor="guardian.phone">Guardian Phone</Label>
                        <Input id="guardian.phone" name="guardian.phone" value={addForm.guardian?.phone || ""} onChange={handleAddFormChange} />
                      </div>
                      <div>
                        <Label htmlFor="guardian.email">Guardian Email</Label>
                        <Input id="guardian.email" name="guardian.email" value={addForm.guardian?.email || ""} onChange={handleAddFormChange} type="email" />
                      </div>
                    </div>
                  </div>
              </div>
            </TabsContent>

            {/* Professional */}
            <TabsContent value="professional" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leagueRegistrationNumber">League Registration Number</Label>
                  <Input id="leagueRegistrationNumber" name="leagueRegistrationNumber" value={addForm.leagueRegistrationNumber || ""} onChange={handleAddFormChange} />
                </div>
                <div>
                  <Label htmlFor="fazId">FAZ ID</Label>
                  <Input id="fazId" name="fazId" value={addForm.fazId || ""} onChange={handleAddFormChange} />
                </div>
                <div>
                  <Label htmlFor="cafId">CAF ID</Label>
                  <Input id="cafId" name="cafId" value={addForm.cafId || ""} onChange={handleAddFormChange} />
                </div>
                <div>
                  <Label htmlFor="fifaId">FIFA ID</Label>
                  <Input id="fifaId" name="fifaId" value={addForm.fifaId || ""} onChange={handleAddFormChange} />
                </div>
                <div>
                  <Label htmlFor="passportCountry">Passport Country</Label>
                  <Input id="passportCountry" name="passportCountry" value={addForm.passportCountry || ""} onChange={handleAddFormChange} />
                </div>
                <div>
                  <Label htmlFor="passportExpiry">Passport Expiry</Label>
                  <Input id="passportExpiry" name="passportExpiry" value={addForm.passportExpiry || ""} onChange={handleAddFormChange} type="date" />
                </div>
                <div>
                  <Label htmlFor="valuation">Player Valuation (USD)</Label>
                  <Input id="valuation" name="valuation" value={addForm.valuation || ""} onChange={handleAddFormChange} type="number" />
                </div>
                <div>
                  <Label htmlFor="contractStart">Contract Start</Label>
                  <Input id="contractStart" name="contractStart" value={addForm.contractStart || ""} onChange={handleAddFormChange} type="date" />
                </div>
                <div>
                  <Label htmlFor="contractExpiry">Contract Expiry</Label>
                  <Input id="contractExpiry" name="contractExpiry" value={addForm.contractExpiry || ""} onChange={handleAddFormChange} type="date" />
                </div>
                <div>
                  <Label htmlFor="agent.name">Agent Name</Label>
                  <Input id="agent.name" name="agent.name" value={addForm.agent?.name || ""} onChange={handleAddFormChange} />
                </div>
                <div>
                  <Label htmlFor="agent.license">Agent License / ID</Label>
                  <Input id="agent.license" name="agent.license" value={addForm.agent?.license || ""} onChange={handleAddFormChange} />
                </div>
                <div>
                  <Label htmlFor="agent.phone">Agent Phone</Label>
                  <Input id="agent.phone" name="agent.phone" value={addForm.agent?.phone || ""} onChange={handleAddFormChange} />
                </div>
                <div>
                  <Label htmlFor="agent.email">Agent Email</Label>
                  <Input id="agent.email" name="agent.email" value={addForm.agent?.email || ""} onChange={handleAddFormChange} type="email" />
                </div>
              </div>
            </TabsContent>

            {/* Physical */}
            <TabsContent value="physical" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="physicalAttributes.height">Height (cm)</Label>
                  <Input id="physicalAttributes.height" name="physicalAttributes.height" value={addForm.physicalAttributes?.height || ""} onChange={handleAddFormChange} type="number" />
                </div>
                <div>
                  <Label htmlFor="physicalAttributes.weight">Weight (kg)</Label>
                  <Input id="physicalAttributes.weight" name="physicalAttributes.weight" value={addForm.physicalAttributes?.weight || ""} onChange={handleAddFormChange} type="number" />
                </div>
                <div>
                  <Label htmlFor="physicalAttributes.preferredFoot">Preferred Foot</Label>
                  <Select value={addForm.physicalAttributes?.preferredFoot || "Right"} onValueChange={(value) => setAddForm((prev: any) => ({
                    ...prev,
                    physicalAttributes: { ...prev.physicalAttributes, preferredFoot: value }
                  }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Right">Right</SelectItem>
                      <SelectItem value="Left">Left</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="physicalAttributes.bloodType">Blood Type</Label>
                  <Select value={addForm.physicalAttributes?.bloodType || ""} onValueChange={(value) => setAddForm((prev: any) => ({
                    ...prev,
                    physicalAttributes: { ...prev.physicalAttributes, bloodType: value }
                  }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Documents */}
            <TabsContent value="documents" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="avatar">Player Photo</Label>
                  <Input id="avatar" type="file" accept="image/*" onChange={(e) => handleFileChange('avatar', e.target.files?.[0] || null)} />
                </div>
                <div>
                  <Label htmlFor="birthCertificate">Birth Certificate *</Label>
                  <Input id="birthCertificate" type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange('birthCertificate', e.target.files?.[0] || null)} />
                </div>
                <div>
                  <Label htmlFor="medicalClearance">Medical Clearance *</Label>
                  <Input id="medicalClearance" type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange('medicalClearance', e.target.files?.[0] || null)} />
                </div>
                <div>
                  <Label htmlFor="educationCertificate">Education Certificate</Label>
                  <Input id="educationCertificate" type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange('educationCertificate', e.target.files?.[0] || null)} />
                </div>
                <div>
                  <Label htmlFor="parentalConsent">Parental Consent (if under 18)</Label>
                  <Input id="parentalConsent" type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange('parentalConsent', e.target.files?.[0] || null)} />
                </div>
                <div>
                  <Label htmlFor="passport">Passport (for foreign players)</Label>
                  <Input id="passport" type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange('passport', e.target.files?.[0] || null)} />
                </div>
                <div>
                  <Label htmlFor="workPermit">Work Permit (for foreign players)</Label>
                  <Input id="workPermit" type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange('workPermit', e.target.files?.[0] || null)} />
                </div>
              </div>
            </TabsContent>

            {/* Review Tab */}
            <TabsContent value="review" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review Player Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>Name:</strong> {addForm.name}</div>
                    <div><strong>Date of Birth:</strong> {addForm.dateOfBirth}</div>
                    <div><strong>NRC:</strong> {addForm.nrc}</div>
                    <div><strong>Position:</strong> {addForm.position}</div>
                    <div><strong>Nationality:</strong> {addForm.nationality}</div>
                    <div><strong>Phone:</strong> {addForm.phone}</div>
                    <div><strong>Email:</strong> {addForm.email}</div>
                    <div><strong>League Registration Number:</strong> {addForm.leagueRegistrationNumber || "Pending"}</div>
                    <div><strong>FAZ ID:</strong> {addForm.fazId || "Pending"}</div>
                    <div><strong>CAF ID:</strong> {addForm.cafId || "Pending"}</div>
                    <div><strong>FIFA ID:</strong> {addForm.fifaId || "Pending"}</div>
                    <div><strong>Valuation:</strong> {addForm.valuation}</div>
                    <div><strong>Contract Expiry:</strong> {addForm.contractExpiry}</div>
                    <div><strong>Contract Start:</strong> {addForm.contractStart || 'N/A'}</div>
                    <div><strong>Agent:</strong> {addForm.agent?.name ? `${addForm.agent.name} (${addForm.agent.license || 'N/A'})` : 'N/A'}</div>
                    <div><strong>Physical:</strong> {addForm.physicalAttributes?.height}cm, {addForm.physicalAttributes?.weight}kg, {addForm.physicalAttributes?.preferredFoot} foot, {addForm.physicalAttributes?.bloodType}</div>
                    <div><strong>Emergency Contact:</strong> {addForm.emergencyContact?.name} ({addForm.emergencyContact?.relationship}), {addForm.emergencyContact?.phone}, {addForm.emergencyContact?.email}</div>
                    <div><strong>Player Photo:</strong> {renderFilePreview(addFiles.avatar)}</div>
                    <div><strong>Birth Certificate:</strong> {renderFilePreview(addFiles.birthCertificate)}</div>
                    <div><strong>Medical Clearance:</strong> {renderFilePreview(addFiles.medicalClearance)}</div>
                    <div><strong>Education Certificate:</strong> {renderFilePreview(addFiles.educationCertificate)}</div>
                    <div><strong>Parental Consent:</strong> {renderFilePreview(addFiles.parentalConsent)}</div>
                    <div><strong>Passport:</strong> {renderFilePreview(addFiles.passport)}</div>
                    <div><strong>Work Permit:</strong> {renderFilePreview(addFiles.workPermit)}</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          <div className="flex gap-4 mt-8 pt-6 border-t">
            <Button
              type="submit"
              disabled={addLoading || tab !== "review"}
              className="bg-primary text-primary-foreground"
            >
              {addLoading ? "Registering..." : "Register Player"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </Tabs>
      </form>
    </DialogContent>
  </Dialog>
);
}