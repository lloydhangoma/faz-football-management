import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Assuming you have a list of Zambian provinces and leagues
const ZAMBIAN_PROVINCES = [
  "Central", "Copperbelt", "Eastern", "Luapula", "Lusaka", "Muchinga", "Northern", "North-Western", "Southern", "Western",
];

const ZAMBIAN_LEAGUES = [
  "MTN Super League", "National Division One", "Provincial Division One - Copperbelt", "Provincial Division One - Lusaka",
  // ... add more as needed
];

const API_BASE_URL = "/api";

export default function RegisterPage() {
  // State for all the new club fields
  const [clubName, setClubName] = useState("");
  const [clubAbbreviation, setClubAbbreviation] = useState("");
  const [clubLogo, setClubLogo] = useState<File | null>(null);
  const [homeStadium, setHomeStadium] = useState("");
  const [province, setProvince] = useState("");
  const [foundingYear, setFoundingYear] = useState("");
  const [league, setLeague] = useState("");
  const [currentLeaguePosition, setCurrentLeaguePosition] = useState("");
  const [previousLeaguePosition, setPreviousLeaguePosition] = useState("");
  const [leagueTitles, setLeagueTitles] = useState("");
  const [cupsWon, setCupsWon] = useState("");
  const [presidentName, setPresidentName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [socialMediaLinks, setSocialMediaLinks] = useState("");

  // State for the administrative user account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleHome = () => {
    // Navigate to the main login page (root)
    navigate("/");
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!clubName || !email || !password || !province || !league) {
      setError("Please fill in all required fields marked with *.");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("clubName", clubName);
      formData.append("clubAbbreviation", clubAbbreviation);
      if (clubLogo) formData.append("clubLogo", clubLogo);
      formData.append("homeStadium", homeStadium);
      formData.append("province", province);
      formData.append("foundingYear", foundingYear);
      formData.append("league", league);
      formData.append("currentLeaguePosition", currentLeaguePosition);
      formData.append("previousLeaguePosition", previousLeaguePosition);
      formData.append("leagueTitles", leagueTitles);
      formData.append("cupsWon", cupsWon);
      formData.append("presidentName", presidentName);
      formData.append("contactPhone", contactPhone);
      formData.append("websiteUrl", websiteUrl);
      formData.append("socialMediaLinks", socialMediaLinks);
      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch(`${API_BASE_URL}/club/register`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Club registration failed.");
        setIsLoading(false);
        return;
      }

      // Successful registration: redirect to login page (/)
      navigate("/", { state: { message: "Registration successful. Please log in." } });

    } catch (err: any) {
      setError("Network error. Please try again.");
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-3xl bg-card text-card-foreground border border-border rounded-xl shadow-lg">
        <form onSubmit={handleRegistrationSubmit} className="space-y-6">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-foreground">
              Club Registration
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Register your football club with all its details.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Club Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2 border-b border-border pb-1">Club Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clubName" className="text-foreground">Club Name *</Label>
                  <Input
                    id="clubName"
                    type="text"
                    required
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clubAbbreviation" className="text-foreground">Abbreviation</Label>
                  <Input
                    id="clubAbbreviation"
                    type="text"
                    value={clubAbbreviation}
                    onChange={(e) => setClubAbbreviation(e.target.value)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label htmlFor="clubLogo" className="text-foreground">Club Logo</Label>
                  <Input
                    id="clubLogo"
                    type="file"
                    onChange={(e) => setClubLogo(e.target.files?.[0] || null)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeStadium" className="text-foreground">Home Stadium</Label>
                  <Input
                    id="homeStadium"
                    type="text"
                    value={homeStadium}
                    onChange={(e) => setHomeStadium(e.target.value)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundingYear" className="text-foreground">Founding Year</Label>
                  <Input
                    id="foundingYear"
                    type="number"
                    value={foundingYear}
                    onChange={(e) => setFoundingYear(e.target.value)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province" className="text-foreground">Province *</Label>
                  <select
                    id="province"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full p-2 rounded-md bg-muted text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select Province</option>
                    {ZAMBIAN_PROVINCES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="league" className="text-foreground">League *</Label>
                  <select
                    id="league"
                    required
                    value={league}
                    onChange={(e) => setLeague(e.target.value)}
                    className="w-full p-2 rounded-md bg-muted text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select League</option>
                    {ZAMBIAN_LEAGUES.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sporting Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2 border-b border-border pb-1">Sporting Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentLeaguePosition" className="text-foreground">Current League Position</Label>
                  <Input
                    id="currentLeaguePosition"
                    type="number"
                    value={currentLeaguePosition}
                    onChange={(e) => setCurrentLeaguePosition(e.target.value)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previousLeaguePosition" className="text-foreground">Previous League Position</Label>
                  <Input
                    id="previousLeaguePosition"
                    type="number"
                    value={previousLeaguePosition}
                    onChange={(e) => setPreviousLeaguePosition(e.target.value)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leagueTitles" className="text-foreground">Number of League Titles</Label>
                  <Input
                    id="leagueTitles"
                    type="number"
                    value={leagueTitles}
                    onChange={(e) => setLeagueTitles(e.target.value)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cupsWon" className="text-foreground">Number of Cups Won</Label>
                  <Input
                    id="cupsWon"
                    type="number"
                    value={cupsWon}
                    onChange={(e) => setCupsWon(e.target.value)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Administrative & Contact Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2 border-b border-border pb-1">Administrative & Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="presidentName" className="text-foreground">President's Name</Label>
                  <Input
                    id="presidentName"
                    type="text"
                    value={presidentName}
                    onChange={(e) => setPresidentName(e.target.value)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-foreground">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl" className="text-foreground">Official Website</Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialMediaLinks" className="text-foreground">Social Media Links</Label>
                  <Input
                    id="socialMediaLinks"
                    type="text"
                    placeholder="e.g., Facebook, X/Twitter, Instagram"
                    value={socialMediaLinks}
                    onChange={(e) => setSocialMediaLinks(e.target.value)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Account Creation Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2 border-b border-border pb-1">Create Admin Account</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Admin Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mister.faz@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-muted text-foreground placeholder-muted-foreground border-border focus:border-primary"
                  />
                </div>
              </div>
            </div>
            
            {error && (
              <p className="text-sm text-destructive font-medium text-center mt-4">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full mt-6 bg-primary text-primary-foreground transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register Club"}
            </Button>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/" className="underline text-primary hover:text-primary/80">
                Log in
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
      
    </div>
  );
}
