import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format } from "date-fns";
import { X, Save, Send, CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";
import ArticlePreview from "./ArticlePreview";
import { uploadImage } from "@/api/content";

interface ArticleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (article: ArticleData) => void;
  editArticle?: ArticleData | null;
}

export interface ArticleData {
  id: string;
  title: string;
  type: string;
  status: "published" | "draft" | "scheduled";
  author: string;
  date: string;
  content: string;
  category: string;
  featuredImage?: string;
  metaDescription?: string;
  keywords?: string;
  slug?: string;
  scheduledDate?: string;
}

const CATEGORIES = [
  { value: "teams", label: "Teams" },
  { value: "fixtures", label: "Fixtures" },
  { value: "competitions", label: "Competitions" },
  { value: "youth-development", label: "Youth Development" },
  { value: "womens-football", label: "Women's Football" },
  { value: "stadium-infrastructure", label: "Stadium Infrastructure" },
  { value: "legends-corner", label: "Legends Corner" },
  { value: "general", label: "General" },
];

const ArticleForm = ({ open, onClose, onSubmit, editArticle }: ArticleFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("News");
  const [category, setCategory] = useState("general");
  const [author, setAuthor] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string | undefined>();
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [slug, setSlug] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load edit article data
  useEffect(() => {
    if (editArticle) {
      setTitle(editArticle.title);
      setContent(editArticle.content);
      setType(editArticle.type);
      setCategory(editArticle.category);
      setAuthor(editArticle.author);
      setFeaturedImage(editArticle.featuredImage);
      setMetaDescription(editArticle.metaDescription || "");
      setKeywords(editArticle.keywords || "");
      setSlug(editArticle.slug || "");
      if (editArticle.scheduledDate) {
        setScheduledDate(new Date(editArticle.scheduledDate));
      }
    }
  }, [editArticle]);

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !editArticle) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  }, [title, editArticle]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!open || !title.trim()) return;

    const interval = setInterval(() => {
      setLastSaved(new Date());
      // In a real app, this would save to backend
      console.log("Auto-saving draft...");
    }, 30000);

    return () => clearInterval(interval);
  }, [open, title]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveDraft();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, title, content]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setType("News");
    setCategory("general");
    setAuthor("");
    setFeaturedImage(undefined);
    setMetaDescription("");
    setKeywords("");
    setSlug("");
    setScheduledDate(undefined);
    setLastSaved(null);
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    let imageUrl = featuredImage;
    try {
      if (featuredImage && featuredImage.startsWith('data:')) {
        const blob = await (await fetch(featuredImage)).blob();
        const file = new File([blob], `image-${Date.now()}.png`, { type: blob.type });
        const up = await uploadImage(file);
        if (up?.ok) imageUrl = up.url;
      }
    } catch (err) {
      console.error('Image upload failed', err);
      toast.error('Image upload failed');
    }

    const article: ArticleData = {
      id: editArticle?.id || Date.now().toString(),
      title,
      type,
      status: "draft",
      author: author || "Admin",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      content,
      category,
      featuredImage: imageUrl,
      metaDescription,
      keywords,
      slug,
    };

    onSubmit(article);
    toast.success("Article saved as draft");
    resetForm();
    onClose();
  };

  const handleSchedule = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!scheduledDate) {
      toast.error("Please select a scheduled date");
      return;
    }

    let imageUrl = featuredImage;
    try {
      if (featuredImage && featuredImage.startsWith('data:')) {
        const blob = await (await fetch(featuredImage)).blob();
        const file = new File([blob], `image-${Date.now()}.png`, { type: blob.type });
        const up = await uploadImage(file);
        if (up?.ok) imageUrl = up.url;
      }
    } catch (err) {
      console.error('Image upload failed', err);
      toast.error('Image upload failed');
    }

    const article: ArticleData = {
      id: editArticle?.id || Date.now().toString(),
      title,
      type,
      status: "scheduled",
      author: author || "Admin",
      date: format(scheduledDate, "MMM d, yyyy"),
      content,
      category,
      featuredImage: imageUrl,
      metaDescription,
      keywords,
      slug,
      scheduledDate: scheduledDate.toISOString(),
    };

    onSubmit(article);
    toast.success(`Article scheduled for ${format(scheduledDate, "MMMM d, yyyy")}`);
    resetForm();
    onClose();
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!content.trim()) {
      toast.error("Please enter content");
      return;
    }

    let imageUrl = featuredImage;
    try {
      if (featuredImage && featuredImage.startsWith('data:')) {
        const blob = await (await fetch(featuredImage)).blob();
        const file = new File([blob], `image-${Date.now()}.png`, { type: blob.type });
        const up = await uploadImage(file);
        if (up?.ok) imageUrl = up.url;
      }
    } catch (err) {
      console.error('Image upload failed', err);
      toast.error('Image upload failed');
    }

    const article: ArticleData = {
      id: editArticle?.id || Date.now().toString(),
      title,
      type,
      status: "published",
      author: author || "Admin",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      content,
      category,
      featuredImage: imageUrl,
      metaDescription,
      keywords,
      slug,
    };

    onSubmit(article);
    toast.success("Article published successfully!");
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">
            {editArticle ? "Edit Article" : "Create New Article"}
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>Fill in the details below to create a news article.</span>
            {lastSaved && (
              <span className="text-xs text-muted-foreground">
                Last saved: {format(lastSaved, "h:mm a")}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6 mt-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter article title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  {/* Type & Category Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="News">News</SelectItem>
                          <SelectItem value="Article">Article</SelectItem>
                          <SelectItem value="Report">Report</SelectItem>
                          <SelectItem value="Press Release">Press Release</SelectItem>
                          <SelectItem value="Match Report">Match Report</SelectItem>
                          <SelectItem value="Interview">Interview</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      placeholder="Author name (defaults to Admin)"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>

                  {/* Rich Text Content */}
                  <div className="space-y-2">
                    <Label>Content *</Label>
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Write your article content here..."
                    />
                  </div>

                  {/* Featured Image */}
                  <div className="space-y-2">
                    <Label>Featured Image</Label>
                    <ImageUpload
                      value={featuredImage}
                      onChange={setFeaturedImage}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-6 mt-4">
                  {/* Slug */}
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">/news/</span>
                      <Input
                        id="slug"
                        placeholder="article-url-slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">
                      Meta Description
                      <span className="text-xs text-muted-foreground ml-2">
                        ({metaDescription.length}/160)
                      </span>
                    </Label>
                    <Textarea
                      id="metaDescription"
                      placeholder="Brief description for search engines..."
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))}
                      className="resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Keywords */}
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="football, zambia, national team (comma separated)"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Schedule */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-4 border border-border">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Label>Schedule Publication</Label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !scheduledDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {scheduledDate && (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleSchedule}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Schedule for {format(scheduledDate, "MMM d")}
                  </Button>
                )}
              </div>

              {/* Preview */}
              <ArticlePreview
                title={title}
                content={content}
                author={author || "Admin"}
                category={CATEGORIES.find((c) => c.value === category)?.label || "General"}
                type={type}
                featuredImage={featuredImage}
                publishDate={scheduledDate || new Date()}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={handlePublish}>
              <Send className="mr-2 h-4 w-4" />
              Publish Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleForm;
