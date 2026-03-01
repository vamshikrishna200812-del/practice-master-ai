import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  FileDown,
  FileText,
  Presentation,
  File,
  ChevronLeft,
  ChevronRight,
  Check,
  Layers,
  BarChart3,
  GitBranch,
  Network,
  Workflow,
  Brain,
  BookOpen,
  Sparkles,
  Eye,
} from "lucide-react";
import { downloadAsMarkdown, generateLessonNotes } from "@/utils/downloadNotes";
import { courseNoteContent } from "@/data/courseNotes";

// --- Slide Content Data ---

interface SlideData {
  id: number;
  title: string;
  type: "title" | "diagram" | "chart" | "flowchart" | "mindmap" | "checklist" | "architecture";
  accent: string;
  content: React.ReactNode;
}

const generateSlides = (courseTitle: string, lessonTitle: string): SlideData[] => [
  {
    id: 1,
    title: lessonTitle,
    type: "title",
    accent: "from-primary to-primary/60",
    content: (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Presentation className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground text-center leading-tight">{lessonTitle}</h3>
        <p className="text-xs text-muted-foreground">{courseTitle}</p>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary" className="text-[10px]">Infographic-Rich</Badge>
          <Badge variant="secondary" className="text-[10px]">Visual Guide</Badge>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Key Concepts Overview",
    type: "mindmap",
    accent: "from-blue-500/20 to-cyan-500/20",
    content: (
      <div className="p-6 h-full flex flex-col">
        <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-blue-500" /> Mind Map
        </h4>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary">Core</div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="absolute" style={{
                top: `${50 + 52 * Math.sin((i * Math.PI * 2) / 4 - Math.PI / 4)}%`,
                left: `${50 + 52 * Math.cos((i * Math.PI * 2) / 4 - Math.PI / 4)}%`,
                transform: "translate(-50%, -50%)",
              }}>
                <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "System Architecture",
    type: "architecture",
    accent: "from-violet-500/20 to-purple-500/20",
    content: (
      <div className="p-6 h-full flex flex-col">
        <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Network className="w-3.5 h-3.5 text-violet-500" /> Architecture
        </h4>
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          {["Client Layer", "API Gateway", "Service Layer", "Data Store"].map((layer, i) => (
            <div key={i} className="w-full max-w-[160px]">
              <div className={`h-8 rounded-md border border-border flex items-center justify-center text-[10px] font-medium ${
                i === 0 ? "bg-blue-500/10 text-blue-600" :
                i === 1 ? "bg-green-500/10 text-green-600" :
                i === 2 ? "bg-amber-500/10 text-amber-600" :
                "bg-violet-500/10 text-violet-600"
              }`}>{layer}</div>
              {i < 3 && <div className="flex justify-center"><div className="w-px h-2 bg-border" /></div>}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Process Flowchart",
    type: "flowchart",
    accent: "from-emerald-500/20 to-green-500/20",
    content: (
      <div className="p-6 h-full flex flex-col">
        <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Workflow className="w-3.5 h-3.5 text-emerald-500" /> Flowchart
        </h4>
        <div className="flex-1 flex flex-col items-center justify-center gap-1">
          {["Start", "Analyze", "Design", "Implement", "Review"].map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`px-4 py-1.5 text-[10px] font-medium border border-border ${
                i === 0 || i === 4 ? "rounded-full bg-primary/10 text-primary" : "rounded-md bg-muted"
              }`}>{step}</div>
              {i < 4 && <div className="w-px h-2 bg-border" />}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "Performance Metrics",
    type: "chart",
    accent: "from-orange-500/20 to-amber-500/20",
    content: (
      <div className="p-6 h-full flex flex-col">
        <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-orange-500" /> Metrics
        </h4>
        <div className="flex-1 flex items-end justify-center gap-3 pb-4">
          {[65, 82, 45, 90, 73].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-6 rounded-t-sm bg-gradient-to-t from-primary/80 to-primary/40"
                style={{ height: `${h * 0.8}px` }}
              />
              <span className="text-[8px] text-muted-foreground">Q{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "Quick Reference",
    type: "checklist",
    accent: "from-rose-500/20 to-pink-500/20",
    content: (
      <div className="p-6 h-full flex flex-col">
        <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-rose-500" /> Cheat Sheet
        </h4>
        <div className="flex-1 space-y-2">
          {["Key Pattern #1", "Key Pattern #2", "Key Pattern #3", "Key Pattern #4"].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px]">
              <div className="w-3 h-3 rounded-sm border border-primary/40 bg-primary/10 flex items-center justify-center">
                <Check className="w-2 h-2 text-primary" />
              </div>
              <span className="text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// --- Resource metadata ---

interface ResourceMeta {
  fileName: string;
  fileSize: string;
  pages: number;
  fileType: "pdf" | "ppt" | "doc";
  tags: string[];
}

const getResourceMeta = (courseTitle: string, lessonTitle: string): ResourceMeta => {
  const safeName = `${lessonTitle}`.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
  return {
    fileName: `${safeName}_Deck.pdf`,
    fileSize: "4.5 MB",
    pages: 24,
    fileType: "pdf",
    tags: ["Infographic-Rich", "Cheat Sheet", "Summary Deck"],
  };
};

const fileTypeIcon: Record<string, { icon: typeof FileText; color: string }> = {
  pdf: { icon: FileText, color: "text-red-500" },
  ppt: { icon: Presentation, color: "text-orange-500" },
  doc: { icon: File, color: "text-blue-500" },
};

// --- Component ---

interface ResourcesDownloadsProps {
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  lessonDescription: string;
  keyTakeaways: string[];
}

const ResourcesDownloads = ({
  courseTitle,
  lessonId,
  lessonTitle,
  lessonDescription,
  keyTakeaways,
}: ResourcesDownloadsProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "done">("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);

  const slides = generateSlides(courseTitle, lessonTitle);
  const meta = getResourceMeta(courseTitle, lessonTitle);
  const FIcon = fileTypeIcon[meta.fileType]?.icon || FileText;
  const fColor = fileTypeIcon[meta.fileType]?.color || "text-muted-foreground";
  const noteKey = `${courseTitle}-${lessonId}`;
  const hasNotes = !!courseNoteContent[noteKey];

  const handleDownload = useCallback(() => {
    if (!hasNotes || downloadState !== "idle") return;
    setDownloadState("loading");
    setDownloadProgress(0);

    // Simulate brief progress animation
    const interval = setInterval(() => {
      setDownloadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 20;
      });
    }, 120);

    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);
      const notes = generateLessonNotes(courseTitle, lessonTitle, keyTakeaways, lessonDescription, courseNoteContent[noteKey]);
      const safeName = `${courseTitle}-${lessonTitle}`.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
      downloadAsMarkdown(notes, `${safeName}-deck.md`);
      setDownloadState("done");
      setTimeout(() => {
        setDownloadState("idle");
        setDownloadProgress(0);
      }, 2000);
    }, 700);
  }, [hasNotes, downloadState, courseTitle, lessonTitle, keyTakeaways, lessonDescription, noteKey, lessonId]);

  const navigateSlide = (dir: 1 | -1) => {
    setActiveSlide((p) => Math.max(0, Math.min(slides.length - 1, p + dir)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Layers className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Resources & Downloads</h3>
          <p className="text-xs text-muted-foreground">Visual slide deck & downloadable materials</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        {/* Slide Viewer */}
        <Card className="border-border/50 overflow-hidden shadow-md">
          <div className="relative aspect-[16/10] bg-gradient-to-br from-muted/40 to-muted/80">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {slides[activeSlide]?.content}
              </motion.div>
            </AnimatePresence>

            {/* Slide nav overlay */}
            <button
              onClick={() => navigateSlide(-1)}
              disabled={activeSlide === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur border border-border/60 flex items-center justify-center hover:bg-background transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateSlide(1)}
              disabled={activeSlide === slides.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur border border-border/60 flex items-center justify-center hover:bg-background transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Slide counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/80 backdrop-blur border border-border/60 text-[11px] font-medium text-muted-foreground">
              {activeSlide + 1} / {slides.length}
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="border-t border-border/50 bg-muted/30 p-3">
            <ScrollArea className="w-full">
              <div className="flex gap-2">
                {slides.map((slide, i) => (
                  <motion.button
                    key={slide.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSlide(i)}
                    className={`relative shrink-0 w-[88px] h-[56px] rounded-md border-2 overflow-hidden transition-all duration-200 ${
                      i === activeSlide
                        ? "border-primary shadow-sm shadow-primary/20"
                        : "border-border/50 hover:border-primary/40"
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent} opacity-40`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[8px] font-semibold text-foreground/70 text-center px-1 leading-tight line-clamp-2">
                        {slide.title}
                      </span>
                    </div>
                    {i === activeSlide && (
                      <motion.div
                        layoutId="thumb-ring"
                        className="absolute inset-0 border-2 border-primary rounded-md"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </Card>

        {/* Resource Details Card */}
        <div className="space-y-4">
          <Card className="border-border/50 shadow-md">
            <CardContent className="pt-5 space-y-4">
              {/* File info */}
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0`}>
                  <FIcon className={`w-5 h-5 ${fColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{meta.fileName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {meta.fileSize} • {meta.pages} pages
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {meta.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Download button */}
              <div className="pt-1">
                {downloadState === "loading" ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Downloading...</span>
                      <span>{downloadProgress}%</span>
                    </div>
                    <Progress value={downloadProgress} className="h-2" indicatorClassName="bg-primary transition-all duration-150" />
                  </div>
                ) : downloadState === "done" ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-center gap-2 h-10 rounded-md bg-green-500/10 border border-green-500/30 text-green-600 text-sm font-medium"
                  >
                    <Check className="w-4 h-4" />
                    Downloaded!
                  </motion.div>
                ) : (
                  <Button
                    className="w-full gap-2"
                    onClick={handleDownload}
                    disabled={!hasNotes}
                  >
                    <FileDown className="w-4 h-4" />
                    {hasNotes ? "Download PDF" : "Coming Soon"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Diagram preview cards */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Included Diagrams</p>
            {[
              { icon: GitBranch, label: "Decision Flowcharts", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { icon: Network, label: "System Architecture", color: "text-violet-500", bg: "bg-violet-500/10" },
              { icon: Brain, label: "Concept Mind Maps", color: "text-blue-500", bg: "bg-blue-500/10" },
            ].map((diag) => (
              <motion.div
                key={diag.label}
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/40 transition-colors cursor-default"
              >
                <div className={`w-8 h-8 rounded-md ${diag.bg} flex items-center justify-center shrink-0`}>
                  <diag.icon className={`w-4 h-4 ${diag.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground">{diag.label}</p>
                  <p className="text-[10px] text-muted-foreground">Visual breakdown included</p>
                </div>
                <Eye className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResourcesDownloads;
