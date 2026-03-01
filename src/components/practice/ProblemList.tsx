import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Code, BookOpen, CheckCircle2, ChevronRight, Trophy } from "lucide-react";
import { codingProblems, codingCourses, allTags, allCategories } from "@/data/codingProblems";
import { motion } from "framer-motion";
import { useCodingSubmissions } from "@/hooks/useCodingSubmissions";
import { useNavigate } from "react-router-dom";

interface ProblemListProps {
  onSelectProblem: (slug: string) => void;
}

const difficultyColor: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Hard: "bg-red-500/15 text-red-400 border-red-500/30",
};

const ProblemList = ({ onSelectProblem }: ProblemListProps) => {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [view, setView] = useState<"problems" | "courses">("problems");
  const [solvedSet, setSolvedSet] = useState<Set<string>>(new Set());
  const { getSolvedProblems } = useCodingSubmissions();
  const navigate = useNavigate();

  useEffect(() => {
    getSolvedProblems().then(setSolvedSet);
  }, []);

  const filtered = useMemo(() => {
    return codingProblems.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.tags.some(t => t.includes(search.toLowerCase()))) return false;
      if (difficultyFilter !== "all" && p.difficulty !== difficultyFilter) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (selectedTag && !p.tags.includes(selectedTag)) return false;
      return true;
    });
  }, [search, difficultyFilter, categoryFilter, selectedTag]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-hero text-white rounded-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Code className="w-8 h-8" />
          Coding Challenges
        </h1>
        <p className="text-white/80 max-w-xl">
          Sharpen your skills with {codingProblems.length} hand-picked problems across {allCategories.length} categories.
          <span className="ml-2 text-white/60">{solvedSet.size} solved</span>
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-3 gap-2"
          onClick={() => navigate("/leaderboard")}
        >
          <Trophy className="w-4 h-4" /> Leaderboard
        </Button>
      </div>

      {/* View Toggle */}
      <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
        <TabsList>
          <TabsTrigger value="problems" className="gap-2"><Code className="w-4 h-4" /> Problems</TabsTrigger>
          <TabsTrigger value="courses" className="gap-2"><BookOpen className="w-4 h-4" /> Courses</TabsTrigger>
        </TabsList>
      </Tabs>

      {view === "courses" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {codingCourses.map((course) => (
            <Card key={course.id} className="p-5 hover:shadow-lg transition-shadow cursor-default">
              <div className="text-3xl mb-3">{course.icon}</div>
              <h3 className="font-bold text-lg mb-1">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
              <p className="text-xs text-muted-foreground">{course.problemIds.length} problems</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {course.problemIds.slice(0, 3).map((pid) => {
                  const prob = codingProblems.find((p) => p.id === pid);
                  return prob ? (
                    <Badge
                      key={pid}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-accent"
                      onClick={() => onSelectProblem(prob.slug)}
                    >
                      {prob.title}
                    </Badge>
                  ) : null;
                })}
                {course.problemIds.length > 3 && (
                  <Badge variant="outline" className="text-xs">+{course.problemIds.length - 3} more</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search problems or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "Easy", "Medium", "Hard"].map((d) => (
                <Button
                  key={d}
                  size="sm"
                  variant={difficultyFilter === d ? "default" : "outline"}
                  onClick={() => setDifficultyFilter(d)}
                  className="text-xs"
                >
                  {d === "all" ? "All" : d}
                </Button>
              ))}
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={categoryFilter === "all" ? "secondary" : "ghost"}
              onClick={() => setCategoryFilter("all")}
              className="text-xs h-7"
            >
              All Categories
            </Button>
            {allCategories.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={categoryFilter === c ? "secondary" : "ghost"}
                onClick={() => setCategoryFilter(c)}
                className="text-xs h-7"
              >
                {c}
              </Button>
            ))}
          </div>

          {/* Tag pills */}
          <div className="flex gap-1.5 flex-wrap">
            {allTags.map((t) => (
              <Badge
                key={t}
                variant={selectedTag === t ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedTag(selectedTag === t ? null : t)}
              >
                {t}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{filtered.length} problem{filtered.length !== 1 ? "s" : ""}</span>
            <span>•</span>
            <span className="text-emerald-400">{filtered.filter(p => p.difficulty === "Easy").length} Easy</span>
            <span className="text-amber-400">{filtered.filter(p => p.difficulty === "Medium").length} Medium</span>
            <span className="text-red-400">{filtered.filter(p => p.difficulty === "Hard").length} Hard</span>
          </div>

          {/* Problem Table */}
          <Card className="overflow-hidden">
            <div className="divide-y divide-border">
              {filtered.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">No problems match your filters.</div>
              )}
              {filtered.map((problem, i) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-accent/50 cursor-pointer transition-colors group"
                  onClick={() => onSelectProblem(problem.slug)}
                >
                  {solvedSet.has(problem.id) ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-muted-foreground/40 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{problem.title}</div>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      {problem.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs shrink-0 ${difficultyColor[problem.difficulty]}`}>
                    {problem.difficulty}
                  </Badge>
                  <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">{problem.category}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </motion.div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProblemList;
