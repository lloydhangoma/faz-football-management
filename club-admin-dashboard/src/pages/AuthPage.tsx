import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom"; // Assuming you have Link for navigation

// Assuming you have a list of Zambian provinces and leagues
const ZAMBIAN_PROVINCES = [
  "Central",
  "Copperbelt",
  "Eastern",
  "Luapula",
  "Lusaka",
  "Muchinga",
  "Northern",
  "North-Western",
  "Southern",
  "Western",
];

const ZAMBIAN_LEAGUES = [
  "MTN Super League",
  "National Division One",
  "Provincial Division One - Copperbelt",
  "Provincial Division One - Lusaka",
  // ... add more as needed
];

const API_BASE_URL = "/api";

export default function AuthPage() {
  const [view, setView] = useState("register"); // 'register' or 'login'

  // State for all the new club fields
  const [clubName, setClubName] = useState("");
  const [clubAbbreviation, setClubAbbreviation] = useState("");
  const [clubLogo, setClubLogo] = useState(null);
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
    navigate("/");
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!clubName || !email || !password || !province || !league) {
      setError("Please fill in all required fields.");
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

      // Store the club data with the uploaded logo URL (if available)
      const clubData = {
        name: clubName,
        logo: clubLogo ? URL.createObjectURL(clubLogo) : null,
      };
      localStorage.setItem("clubData", JSON.stringify(clubData));

      // Clear the form fields and switch to login view on successful registration
      setClubName("");
      setClubAbbreviation("");
      setClubLogo(null);
      setHomeStadium("");
      setProvince("");
      setFoundingYear("");
      setLeague("");
      setCurrentLeaguePosition("");
      setPreviousLeaguePosition("");
      setLeagueTitles("");
      setCupsWon("");
      setPresidentName("");
      setContactPhone("");
      setWebsiteUrl("");
      setSocialMediaLinks("");
      setEmail("");
      setPassword("");

      setView("login");
      setError("Registration successful. Please log in.");

    } catch (err) {
      setError("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }
      

      // Fetch real club info by email from backend
      localStorage.removeItem("clubData");
      const clubRes = await fetch(`/api/clubs/by-email/${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const clubData = await clubRes.json();
      if (!clubRes.ok) throw new Error(clubData.message || "Failed to fetch club info");
      localStorage.setItem("clubData", JSON.stringify({
        name: clubData.clubName,
        logo: clubData.clubLogo,
        id: clubData._id,
      }));
      navigate("/dashboard");

    } catch (err) {
      setError("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  const renderForm = () => {
    if (view === "register") {
      return (
        <form onSubmit={handleRegistrationSubmit} className="space-y-6">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-gray-100">
              Club Registration
            </CardTitle>
            <p className="text-sm text-gray-400 mt-1">
              Register your football club with all its details.
            </p>
          </CardHeader>
          <CardContent>
            {/* Club Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">Club Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clubName" className="text-white">Club Name *</Label>
                  <Input
                    id="clubName"
                    type="text"
                    required
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clubAbbreviation" className="text-white">Abbreviation</Label>
                  <Input
                    id="clubAbbreviation"
                    type="text"
                    value={clubAbbreviation}
                    onChange={(e) => setClubAbbreviation(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label htmlFor="clubLogo" className="text-white">Club Logo</Label>
                  <Input
                    id="clubLogo"
                    type="file"
                    onChange={(e) => setClubLogo(e.target.files?.[0] || null)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeStadium" className="text-white">Home Stadium</Label>
                  <Input
                    id="homeStadium"
                    type="text"
                    value={homeStadium}
                    onChange={(e) => setHomeStadium(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundingYear" className="text-white">Founding Year</Label>
                  <Input
                    id="foundingYear"
                    type="number"
                    value={foundingYear}
                    onChange={(e) => setFoundingYear(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province" className="text-white">Province *</Label>
                  <select
                    id="province"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Province</option>
                    {ZAMBIAN_PROVINCES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="league" className="text-white">League *</Label>
                  <select
                    id="league"
                    required
                    value={league}
                    onChange={(e) => setLeague(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              <h3 className="text-lg font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">Sporting Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentLeaguePosition" className="text-white">Current League Position</Label>
                  <Input
                    id="currentLeaguePosition"
                    type="number"
                    value={currentLeaguePosition}
                    onChange={(e) => setCurrentLeaguePosition(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previousLeaguePosition" className="text-white">Previous League Position</Label>
                  <Input
                    id="previousLeaguePosition"
                    type="number"
                    value={previousLeaguePosition}
                    onChange={(e) => setPreviousLeaguePosition(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leagueTitles" className="text-white">Number of League Titles</Label>
                  <Input
                    id="leagueTitles"
                    type="number"
                    value={leagueTitles}
                    onChange={(e) => setLeagueTitles(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cupsWon" className="text-white">Number of Cups Won</Label>
                  <Input
                    id="cupsWon"
                    type="number"
                    value={cupsWon}
                    onChange={(e) => setCupsWon(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Administrative & Contact Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">Administrative & Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="presidentName" className="text-white">President's Name</Label>
                  <Input
                    id="presidentName"
                    type="text"
                    value={presidentName}
                    onChange={(e) => setPresidentName(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-white">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl" className="text-white">Official Website</Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialMediaLinks" className="text-white">Social Media Links</Label>
                  <Input
                    id="socialMediaLinks"
                    type="text"
                    placeholder="e.g., Facebook, X/Twitter, Instagram"
                    value={socialMediaLinks}
                    onChange={(e) => setSocialMediaLinks(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Account Creation Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">Create Admin Account</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Admin Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mister.faz@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 font-medium text-center">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register Club"}
            </Button>
            <div className="mt-4 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <button type="button" onClick={() => setView("login")} className="underline text-blue-400 hover:text-blue-600 bg-transparent border-none p-0 cursor-pointer">
                Log in
              </button>
            </div>
          </CardContent>
        </form>
      );
    } else {
      return (
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-gray-100">
              Club Login
            </CardTitle>
            <p className="text-sm text-gray-400 mt-1">
              Log in to your club's administrative dashboard.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mister.faz@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-blue-500"
                />
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-400 font-medium text-center mt-4">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
            <div className="mt-4 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <button type="button" onClick={() => setView("register")} className="underline text-blue-400 hover:text-blue-600 bg-transparent border-none p-0 cursor-pointer">
                Register
              </button>
            </div>
          </CardContent>
        </form>
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 p-4">
      <Card className="w-full max-w-2xl bg-gray-900 text-white border border-gray-700 rounded-xl shadow-lg">
        {renderForm()}
      </Card>
      <div className="absolute top-4 right-4">
        <Button onClick={handleHome} variant="outline" className="bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700">
          Home
        </Button>
      </div>
    </div>
  );
}
