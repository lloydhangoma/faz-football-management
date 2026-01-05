import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ExternalLink, Save, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const Shop = () => {
  const [shopUrl, setShopUrl] = useState("https://faz-market.online/");
  const [tempUrl, setTempUrl] = useState(shopUrl);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Basic URL validation
    try {
      new URL(tempUrl);
      setShopUrl(tempUrl);
      setIsEditing(false);
      toast({ 
        title: "Shop URL Updated", 
        description: "The MyFAZShop URL has been updated successfully." 
      });
    } catch {
      toast({ 
        title: "Invalid URL", 
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setTempUrl(shopUrl);
    setIsEditing(false);
  };

  return (
    <DashboardLayout title="MyFAZShop" subtitle="Manage the external shop link">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <LinkIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>External Shop URL</CardTitle>
                <CardDescription>
                  Configure the URL that links to the FAZ online merchandise store
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="shopUrl">Shop URL</Label>
              {isEditing ? (
                <Input
                  id="shopUrl"
                  type="url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="font-mono"
                />
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm flex-1 truncate">{shopUrl}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    Save URL
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="flex-1">
                    Edit URL
                  </Button>
                  <Button asChild>
                    <a href={shopUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Shop
                    </a>
                  </Button>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                This URL will be used on the public FAZ website to redirect visitors to the official merchandise store.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Shop;
