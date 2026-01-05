import { useState, useEffect } from "react";
import { fetchArticles, createArticle, updateArticle, deleteArticle } from "@/api/content";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ArticleForm, { ArticleData } from "@/components/news/ArticleForm";
import NewsStats from "@/components/news/NewsStats";
import NewsContentTable from "@/components/news/NewsContentTable";
import BulkActions from "@/components/news/BulkActions";
import ContentCalendar from "@/components/news/ContentCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Filter, Search, LayoutGrid, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";

// Initially load from the API (replaces the local mock data)
const initialNewsItems: ArticleData[] = [];

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [newsItems, setNewsItems] = useState<ArticleData[]>(initialNewsItems);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editArticle, setEditArticle] = useState<ArticleData | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<"list" | "calendar">("list");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchArticles();
        if (res?.ok && mounted) {
          const items = (res.items || []).map((it: any) => ({ ...it, id: it._id }));
          setNewsItems(items);
        }
      } catch (err) {
        console.error('Fetch articles failed', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredItems = newsItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: newsItems.length,
    published: newsItems.filter((i) => i.status === "published").length,
    drafts: newsItems.filter((i) => i.status === "draft").length,
    scheduled: newsItems.filter((i) => i.status === "scheduled").length,
  };

  const handleAddArticle = async (article: ArticleData) => {
    try {
      if (editArticle && editArticle.id && newsItems.some(i => i.id === editArticle.id)) {
        const res = await updateArticle(editArticle.id, article);
        if (res?.ok) {
          const updated = { ...res.item, id: res.item._id };
          setNewsItems(prev => prev.map(i => i.id === editArticle.id ? updated : i));
          toast.success('Article updated');
        } else {
          toast.error(res?.message || 'Update failed');
        }
      } else {
        const res = await createArticle(article);
        if (res?.ok) {
          const created = { ...res.item, id: res.item._id };
          setNewsItems(prev => [created, ...prev]);
          toast.success('Article created');
        } else {
          toast.error(res?.message || 'Create failed');
        }
      }
    } catch (err) {
      console.error('Save failed', err);
      toast.error('Save failed');
    } finally {
      setEditArticle(null);
      setIsFormOpen(false);
    }
  };

  const handleEdit = (id: string) => {
    const article = newsItems.find((item) => item.id === id);
    if (article) {
      setEditArticle(article);
      setIsFormOpen(true);
    }
  };

  const handleView = (id: string) => {
    const article = newsItems.find((item) => item.id === id);
    if (article) {
      toast.info(`Viewing: ${article.title}`);
    }
  };

  const handleDeleteRequest = (ids: string[]) => {
    setItemsToDelete(ids);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await Promise.all(itemsToDelete.map(id => deleteArticle(id)));
      setNewsItems((prev) => prev.filter((item) => !itemsToDelete.includes(item.id)));
      setSelectedIds((prev) => prev.filter((id) => !itemsToDelete.includes(id)));
      toast.success(`${itemsToDelete.length} article(s) deleted`);
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    } finally {
      setItemsToDelete([]);
      setDeleteDialogOpen(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const res = await updateArticle(id, { status: 'published', publishedAt: new Date().toISOString() });
      if (res?.ok) {
        setNewsItems(prev => prev.map(item => item.id === id ? { ...res.item, id: res.item._id } : item));
        toast.success('Article published');
      } else {
        toast.error(res?.message || 'Publish failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Publish failed');
    }
  };

  const handleBulkPublish = async () => {
    try {
      await Promise.all(selectedIds.map(id => updateArticle(id, { status: 'published', publishedAt: new Date().toISOString() })));
      setNewsItems((prev) => prev.map(item => selectedIds.includes(item.id) ? { ...item, status: 'published', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : item));
      toast.success(`${selectedIds.length} article(s) published`);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      toast.error('Bulk publish failed');
    }
  };

  const handleBulkChangeCategory = (category: string) => {
    setNewsItems((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, category } : item
      )
    );
    toast.success(`Category updated for ${selectedIds.length} article(s)`);
    setSelectedIds([]);
  };

  const handleBulkArchive = () => {
    setNewsItems((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id)
          ? { ...item, status: "draft" as const }
          : item
      )
    );
    toast.success(`${selectedIds.length} article(s) archived`);
    setSelectedIds([]);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredItems.map((item) => item.id) : []);
  };

  return (
    <DashboardLayout title="News & Articles" subtitle="Manage all news content for the FAZ website">
      {/* Stats */}
      <NewsStats
        total={stats.total}
        published={stats.published}
        drafts={stats.drafts}
        scheduled={stats.scheduled}
      />

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "list" | "calendar")} className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="list" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </div>

        <TabsContent value="list" className="mt-6 space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <FileText className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="teams">Teams</SelectItem>
                <SelectItem value="fixtures">Fixtures</SelectItem>
                <SelectItem value="competitions">Competitions</SelectItem>
                <SelectItem value="youth-development">Youth Development</SelectItem>
                <SelectItem value="womens-football">Women's Football</SelectItem>
                <SelectItem value="stadium-infrastructure">Stadium Infrastructure</SelectItem>
                <SelectItem value="legends-corner">Legends Corner</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          <BulkActions
            selectedCount={selectedIds.length}
            onPublish={handleBulkPublish}
            onDelete={() => handleDeleteRequest(selectedIds)}
            onChangeCategory={handleBulkChangeCategory}
            onArchive={handleBulkArchive}
          />

          {/* Content Table */}
          <NewsContentTable
            items={filteredItems}
            selectedIds={selectedIds}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={(id) => handleDeleteRequest([id])}
            onPublish={handlePublish}
          />

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {newsItems.length} articles
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold mb-4">Upcoming & Scheduled Content</h3>
                <div className="space-y-3">
                  {newsItems
                    .filter((item) => item.status === "scheduled")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/20"
                      >
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Scheduled for {item.date}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item.id)}
                        >
                          Edit
                        </Button>
                      </div>
                    ))}
                  {newsItems.filter((item) => item.status === "scheduled").length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                      No scheduled articles
                    </p>
                  )}
                </div>
              </div>
            </div>
            <ContentCalendar
              articles={newsItems.map((item) => ({
                id: item.id,
                title: item.title,
                date: item.scheduledDate || item.date,
                status: item.status,
              }))}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Article Form Dialog */}
      <ArticleForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditArticle(null);
        }}
        onSubmit={handleAddArticle}
        editArticle={editArticle}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article(s)</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {itemsToDelete.length} article(s)? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default News;
