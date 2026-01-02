import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, Star, FileText, Search } from "lucide-react";
import { toast } from "sonner";

interface StarStory {
  id: string;
  title: string;
  situation: string | null;
  task: string | null;
  action: string | null;
  result: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const emptyStory = {
  title: "",
  situation: "",
  task: "",
  action: "",
  result: "",
  tags: [] as string[],
};

const CheatSheet = () => {
  const [stories, setStories] = useState<StarStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<StarStory | null>(null);
  const [formData, setFormData] = useState(emptyStory);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("star_stories")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast.error("Failed to load your stories");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingStory(null);
    setFormData(emptyStory);
    setTagInput("");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (story: StarStory) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      situation: story.situation || "",
      task: story.task || "",
      action: story.action || "",
      result: story.result || "",
      tags: story.tags || [],
    });
    setTagInput("");
    setIsDialogOpen(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const storyData = {
        user_id: user.id,
        title: formData.title.trim(),
        situation: formData.situation.trim() || null,
        task: formData.task.trim() || null,
        action: formData.action.trim() || null,
        result: formData.result.trim() || null,
        tags: formData.tags,
      };

      if (editingStory) {
        const { error } = await supabase
          .from("star_stories")
          .update(storyData)
          .eq("id", editingStory.id);

        if (error) throw error;
        toast.success("Story updated successfully");
      } else {
        const { error } = await supabase
          .from("star_stories")
          .insert(storyData);

        if (error) throw error;
        toast.success("Story created successfully");
      }

      setIsDialogOpen(false);
      fetchStories();
    } catch (error) {
      console.error("Error saving story:", error);
      toast.error("Failed to save story");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;

    try {
      const { error } = await supabase
        .from("star_stories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Story deleted");
      fetchStories();
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story");
    }
  };

  const filteredStories = stories.filter((story) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      story.title.toLowerCase().includes(searchLower) ||
      story.situation?.toLowerCase().includes(searchLower) ||
      story.task?.toLowerCase().includes(searchLower) ||
      story.action?.toLowerCase().includes(searchLower) ||
      story.result?.toLowerCase().includes(searchLower) ||
      story.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">STAR Method Cheat Sheet</h1>
            <p className="text-muted-foreground mt-1">
              Store your success stories to reference during interviews
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleOpenCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Story
            </Button>
          </div>
        </div>

        {/* STAR Method Guide */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Star className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">The STAR Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-primary">S - Situation</p>
                    <p className="text-muted-foreground">Set the scene and context</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary">T - Task</p>
                    <p className="text-muted-foreground">Describe your responsibility</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary">A - Action</p>
                    <p className="text-muted-foreground">Explain what you did</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary">R - Result</p>
                    <p className="text-muted-foreground">Share the outcome</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {stories.length === 0 ? "No stories yet" : "No matching stories"}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {stories.length === 0
                  ? "Create your first STAR method story to reference during interviews"
                  : "Try adjusting your search terms"}
              </p>
              {stories.length === 0 && (
                <Button onClick={handleOpenCreate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Story
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStories.map((story) => (
              <Card key={story.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{story.title}</CardTitle>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleOpenEdit(story)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(story.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {story.tags && story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {story.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  {story.situation && (
                    <div>
                      <p className="text-xs font-medium text-primary">Situation</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{story.situation}</p>
                    </div>
                  )}
                  {story.task && (
                    <div>
                      <p className="text-xs font-medium text-primary">Task</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{story.task}</p>
                    </div>
                  )}
                  {story.action && (
                    <div>
                      <p className="text-xs font-medium text-primary">Action</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{story.action}</p>
                    </div>
                  )}
                  {story.result && (
                    <div>
                      <p className="text-xs font-medium text-primary">Result</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{story.result}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStory ? "Edit Story" : "Create New Story"}</DialogTitle>
              <DialogDescription>
                Fill in your STAR method story details. You can always come back and edit later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Led cross-functional team project"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="situation">Situation</Label>
                <Textarea
                  id="situation"
                  placeholder="Describe the context and background..."
                  value={formData.situation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, situation: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task">Task</Label>
                <Textarea
                  id="task"
                  placeholder="What was your specific responsibility?"
                  value={formData.task}
                  onChange={(e) => setFormData((prev) => ({ ...prev, task: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <Textarea
                  id="action"
                  placeholder="What steps did you take?"
                  value={formData.action}
                  onChange={(e) => setFormData((prev) => ({ ...prev, action: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="result">Result</Label>
                <Textarea
                  id="result"
                  placeholder="What was the outcome? Include metrics if possible."
                  value={formData.result}
                  onChange={(e) => setFormData((prev) => ({ ...prev, result: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag (e.g., leadership, teamwork)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingStory ? "Update Story" : "Create Story"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CheatSheet;
