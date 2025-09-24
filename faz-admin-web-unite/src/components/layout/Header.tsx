// 📁 src/components/layout/Header.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API } from "@/api/client";
import { Search, Bell, User, Moon, Sun, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Admin = {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
};

export default function Header(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // THEME
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // LOAD CURRENT ADMIN (for header + modal)
  const { data: admin } = useQuery({
    queryKey: ["admin.me"],
    queryFn: async () => {
      const res = await API.get<{ admin?: Admin }>("/settings/admin-check-auth", {
        withCredentials: true,
      });
      return res.data.admin;
    },
    staleTime: 5 * 60 * 1000,
  });

  // PROFILE MODAL STATE
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profileOpen && admin) {
      setName(admin.name || "");
      setEmail(admin.email || "");
      setNewPassword("");
    }
  }, [profileOpen, admin]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin?._id) return;

    try {
      setSaving(true);
      await API.put(
        `/settings/admins/${admin._id}`,
        {
          name,
          email,
          ...(newPassword.trim() ? { password: newPassword.trim() } : {}),
        },
        { withCredentials: true }
      );
      toast.success("Profile updated");
      setProfileOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin.me"] });
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("❌ Update profile error:", err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // LOGOUT
  const handleLogout = async (): Promise<void> => {
    try {
      await API.post("/settings/admin-logout", {}, { withCredentials: true });
      queryClient.clear();
      toast.success("Logged out successfully");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("❌ Logout error:", err);
      toast.error("Failed to log out cleanly. Session cleared.");
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  const displayName = admin?.name || "John Mwanza";
  const displayRole = admin?.role || "Super Admin";

  return (
    <>
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Click to go back, hold to see history
          </Button>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search players, clubs, officials..."
              className="pl-10 bg-background border-input"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="text-muted-foreground"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Clickable profile area opens modal */}
          <div
            className="flex items-center gap-4 pl-4 border-l border-border cursor-pointer select-none"
            onClick={() => setProfileOpen(true)}
            title="View / Edit Profile"
          >
            <div className="text-right leading-tight">
              <div className="text-sm font-semibold text-foreground">{displayName}</div>
              <div className="text-xs text-muted-foreground">{displayRole}</div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Bigger account button: 44x44 with larger icon */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-11 w-11 p-0 border border-border"
                  aria-label="Account menu"
                >
                  <User className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                  <User className="mr-2 h-5 w-5" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-5 w-5" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>
              Update your account details. Leave password blank to keep it unchanged.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@faz.co.zm"
                required
                autoComplete="email"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">New Password (optional)</Label>
              <Input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 6 characters. Leave empty to keep your current password.
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setProfileOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
