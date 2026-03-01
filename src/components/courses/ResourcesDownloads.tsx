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
  Network,
  Workflow,
  Brain,
  BookOpen,
  Sparkles,
  Eye,
  Target,
  Lightbulb,
  Zap,
  Shield,
  Database,
  Globe,
  MessageSquare,
  Users,
  Timer,
  Code,
  ArrowRight,
} from "lucide-react";
import { downloadAsMarkdown, generateLessonNotes } from "@/utils/downloadNotes";
import { courseNoteContent } from "@/data/courseNotes";

// --- Slide Content Data ---

interface SlideData {
  id: number;
  title: string;
  type: string;
  accent: string;
  content: React.ReactNode;
}

// --- Course-specific diagram metadata ---

interface DiagramInfo {
  icon: typeof FileText;
  label: string;
  color: string;
  bg: string;
  description: string;
}

const courseDiagrams: Record<string, DiagramInfo[]> = {
  "Mastering Technical Interviews": [
    { icon: Workflow, label: "Algorithm Flowcharts", color: "text-emerald-500", bg: "bg-emerald-500/10", description: "Step-by-step algorithm walkthroughs" },
    { icon: BarChart3, label: "Complexity Comparisons", color: "text-orange-500", bg: "bg-orange-500/10", description: "Big O visual comparisons" },
    { icon: Code, label: "Code Pattern Diagrams", color: "text-blue-500", bg: "bg-blue-500/10", description: "Common coding pattern visuals" },
  ],
  "Behavioral Interview Excellence": [
    { icon: Target, label: "STAR Framework Maps", color: "text-violet-500", bg: "bg-violet-500/10", description: "Situation → Task → Action → Result" },
    { icon: Users, label: "Competency Matrices", color: "text-blue-500", bg: "bg-blue-500/10", description: "Skills & traits assessment grids" },
    { icon: MessageSquare, label: "Response Templates", color: "text-emerald-500", bg: "bg-emerald-500/10", description: "Structured answer blueprints" },
  ],
  "System Design Fundamentals": [
    { icon: Network, label: "System Architecture", color: "text-violet-500", bg: "bg-violet-500/10", description: "Full system topology diagrams" },
    { icon: Database, label: "Data Flow Diagrams", color: "text-blue-500", bg: "bg-blue-500/10", description: "Request lifecycle & data paths" },
    { icon: Globe, label: "Infrastructure Maps", color: "text-emerald-500", bg: "bg-emerald-500/10", description: "CDN, LB & server layouts" },
  ],
  "Communication Skills for Developers": [
    { icon: Brain, label: "Concept Mind Maps", color: "text-blue-500", bg: "bg-blue-500/10", description: "Visual idea organization" },
    { icon: Users, label: "Interaction Models", color: "text-violet-500", bg: "bg-violet-500/10", description: "Communication flow patterns" },
    { icon: Lightbulb, label: "Strategy Frameworks", color: "text-amber-500", bg: "bg-amber-500/10", description: "Technique decision trees" },
  ],
};

// --- Resource metadata per course ---

interface ResourceMeta {
  fileName: string;
  fileSize: string;
  pages: number;
  fileType: "pdf" | "ppt" | "doc";
  tags: string[];
}

const courseMetaConfig: Record<string, { fileType: "pdf" | "ppt" | "doc"; basePages: number; baseSize: string; tags: string[] }> = {
  "Mastering Technical Interviews": { fileType: "pdf", basePages: 28, baseSize: "5.2", tags: ["Code Diagrams", "Cheat Sheet", "Algorithm Visuals"] },
  "Behavioral Interview Excellence": { fileType: "ppt", basePages: 18, baseSize: "3.8", tags: ["STAR Templates", "Story Framework", "Infographic-Rich"] },
  "System Design Fundamentals": { fileType: "pdf", basePages: 32, baseSize: "6.1", tags: ["Architecture Diagrams", "Scale Patterns", "Summary Deck"] },
  "Communication Skills for Developers": { fileType: "doc", basePages: 14, baseSize: "2.4", tags: ["Practice Exercises", "Quick Reference", "Tip Sheets"] },
};

const getResourceMeta = (courseTitle: string, lessonTitle: string, lessonId: string): ResourceMeta => {
  const config = courseMetaConfig[courseTitle] || { fileType: "pdf" as const, basePages: 20, baseSize: "4.0", tags: ["Summary Deck"] };
  const safeName = lessonTitle.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
  const idNum = parseInt(lessonId, 10) || 1;
  const pageVariation = Math.round(config.basePages * (0.7 + (idNum * 0.12)));
  const sizeVariation = (parseFloat(config.baseSize) * (0.6 + idNum * 0.15)).toFixed(1);

  return {
    fileName: `${safeName}_Deck.${config.fileType}`,
    fileSize: `${sizeVariation} MB`,
    pages: pageVariation,
    fileType: config.fileType,
    tags: config.tags,
  };
};

const fileTypeIcon: Record<string, { icon: typeof FileText; color: string }> = {
  pdf: { icon: FileText, color: "text-red-500" },
  ppt: { icon: Presentation, color: "text-orange-500" },
  doc: { icon: File, color: "text-blue-500" },
};

// --- Dynamic slide generation ---

const generateSlides = (
  courseTitle: string,
  lessonTitle: string,
  lessonDescription: string,
  keyTakeaways: string[],
): SlideData[] => {
  const slides: SlideData[] = [];

  // Slide 1: Title
  slides.push({
    id: 1,
    title: lessonTitle,
    type: "title",
    accent: "from-primary to-primary/60",
    content: (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Presentation className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-base font-bold text-foreground text-center leading-tight max-w-[260px]">{lessonTitle}</h3>
        <p className="text-[10px] text-muted-foreground">{courseTitle}</p>
        <p className="text-[9px] text-muted-foreground text-center max-w-[220px] leading-relaxed mt-1">{lessonDescription.slice(0, 100)}…</p>
      </div>
    ),
  });

  // Slide 2: Key Takeaways
  slides.push({
    id: 2,
    title: "Key Takeaways",
    type: "takeaways",
    accent: "from-emerald-500/20 to-green-500/20",
    content: (
      <div className="p-5 h-full flex flex-col">
        <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Key Takeaways
        </h4>
        <div className="flex-1 space-y-2">
          {keyTakeaways.map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-primary">{i + 1}</span>
              </div>
              <p className="text-[10px] text-foreground/80 leading-relaxed">{t}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  });

  // Slide 3: Course-specific visual
  if (courseTitle === "Mastering Technical Interviews") {
    // Complexity chart slide
    const complexities = [
      { label: "O(1)", h: 10, color: "from-green-500 to-green-400" },
      { label: "O(log n)", h: 25, color: "from-emerald-500 to-emerald-400" },
      { label: "O(n)", h: 45, color: "from-amber-500 to-amber-400" },
      { label: "O(n log n)", h: 60, color: "from-orange-500 to-orange-400" },
      { label: "O(n²)", h: 85, color: "from-red-500 to-red-400" },
    ];
    slides.push({
      id: 3,
      title: "Algorithm Complexity",
      type: "chart",
      accent: "from-orange-500/20 to-amber-500/20",
      content: (
        <div className="p-5 h-full flex flex-col">
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-orange-500" /> Complexity Comparison
          </h4>
          <div className="flex-1 flex items-end justify-center gap-2 pb-2">
            {complexities.map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-7 rounded-t-sm bg-gradient-to-t ${c.color}`} style={{ height: `${c.h}px` }} />
                <span className="text-[7px] text-muted-foreground font-mono">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    });
  } else if (courseTitle === "Behavioral Interview Excellence") {
    // STAR framework visual
    const starSteps = [
      { letter: "S", label: "Situation", desc: "Set the scene", color: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
      { letter: "T", label: "Task", desc: "Your responsibility", color: "bg-violet-500/15 text-violet-600 border-violet-500/30" },
      { letter: "A", label: "Action", desc: "What you did", color: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
      { letter: "R", label: "Result", desc: "The outcome", color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
    ];
    slides.push({
      id: 3,
      title: "STAR Framework",
      type: "framework",
      accent: "from-violet-500/20 to-purple-500/20",
      content: (
        <div className="p-5 h-full flex flex-col">
          <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-violet-500" /> STAR Method
          </h4>
          <div className="flex-1 flex flex-col justify-center gap-1.5">
            {starSteps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg border ${s.color} flex items-center justify-center text-xs font-bold shrink-0`}>{s.letter}</div>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-foreground">{s.label}</p>
                  <p className="text-[8px] text-muted-foreground">{s.desc}</p>
                </div>
                {i < 3 && <ArrowRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      ),
    });
  } else if (courseTitle === "System Design Fundamentals") {
    // Architecture layers
    const layers = [
      { label: "Client / CDN", icon: Globe, color: "bg-blue-500/10 text-blue-600" },
      { label: "Load Balancer", icon: Shield, color: "bg-green-500/10 text-green-600" },
      { label: "App Servers", icon: Zap, color: "bg-amber-500/10 text-amber-600" },
      { label: "Cache Layer", icon: Timer, color: "bg-orange-500/10 text-orange-600" },
      { label: "Database", icon: Database, color: "bg-violet-500/10 text-violet-600" },
    ];
    slides.push({
      id: 3,
      title: "System Architecture",
      type: "architecture",
      accent: "from-violet-500/20 to-purple-500/20",
      content: (
        <div className="p-5 h-full flex flex-col">
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-violet-500" /> Architecture Layers
          </h4>
          <div className="flex-1 flex flex-col items-center justify-center gap-1">
            {layers.map((l, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border ${l.color} text-[9px] font-medium`}>
                  <l.icon className="w-3 h-3" />{l.label}
                </div>
                {i < layers.length - 1 && <div className="w-px h-1.5 bg-border" />}
              </div>
            ))}
          </div>
        </div>
      ),
    });
  } else {
    // Communication: Interaction model
    slides.push({
      id: 3,
      title: "Communication Flow",
      type: "flow",
      accent: "from-blue-500/20 to-cyan-500/20",
      content: (
        <div className="p-5 h-full flex flex-col">
          <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Communication Model
          </h4>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-36 h-36">
              {["Listen", "Process", "Clarify", "Respond"].map((step, i) => {
                const angle = (i * Math.PI * 2) / 4 - Math.PI / 2;
                return (
                  <div key={i} className="absolute" style={{
                    top: `${50 + 40 * Math.sin(angle)}%`,
                    left: `${50 + 40 * Math.cos(angle)}%`,
                    transform: "translate(-50%, -50%)",
                  }}>
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[8px] font-semibold text-primary">{step}</div>
                  </div>
                );
              })}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
                  <Brain className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    });
  }

  // Slide 4: Flowchart specific to takeaways
  const flowSteps = keyTakeaways.map((t) => {
    const words = t.split(" ");
    return words.slice(0, 3).join(" ");
  });
  slides.push({
    id: 4,
    title: "Learning Path",
    type: "flowchart",
    accent: "from-emerald-500/20 to-green-500/20",
    content: (
      <div className="p-5 h-full flex flex-col">
        <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Workflow className="w-3.5 h-3.5 text-emerald-500" /> Learning Path
        </h4>
        <div className="flex-1 flex flex-col items-center justify-center gap-1">
          <div className="flex flex-col items-center">
            <div className="px-4 py-1.5 text-[9px] font-medium rounded-full bg-primary/10 text-primary border border-primary/30">Begin</div>
            <div className="w-px h-2 bg-border" />
          </div>
          {flowSteps.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="px-3 py-1.5 text-[9px] font-medium rounded-md bg-muted border border-border max-w-[160px] text-center truncate">{step}</div>
              {i < flowSteps.length - 1 && <div className="w-px h-2 bg-border" />}
            </div>
          ))}
          <div className="w-px h-2 bg-border" />
          <div className="px-4 py-1.5 text-[9px] font-medium rounded-full bg-primary/10 text-primary border border-primary/30">Mastered ✓</div>
        </div>
      </div>
    ),
  });

  // Slide 5: Mind Map with actual takeaways
  slides.push({
    id: 5,
    title: "Concept Map",
    type: "mindmap",
    accent: "from-blue-500/20 to-cyan-500/20",
    content: (
      <div className="p-5 h-full flex flex-col">
        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-blue-500" /> Concept Map
        </h4>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative" style={{ width: 200, height: 160 }}>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center text-[8px] font-bold text-primary text-center px-1 leading-tight">
              {lessonTitle.split(" ").slice(0, 2).join(" ")}
            </div>
            {keyTakeaways.map((t, i) => {
              const angle = (i * Math.PI * 2) / keyTakeaways.length - Math.PI / 2;
              const short = t.split(" ").slice(0, 3).join(" ");
              return (
                <div key={i} className="absolute" style={{
                  top: `${50 + 42 * Math.sin(angle)}%`,
                  left: `${50 + 42 * Math.cos(angle)}%`,
                  transform: "translate(-50%, -50%)",
                }}>
                  <div className="w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center text-[7px] text-center px-1 leading-tight text-foreground/70 font-medium">
                    {short}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ),
  });

  // Slide 6: Quick Reference Checklist from takeaways
  slides.push({
    id: 6,
    title: "Quick Reference",
    type: "checklist",
    accent: "from-rose-500/20 to-pink-500/20",
    content: (
      <div className="p-5 h-full flex flex-col">
        <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-rose-500" /> Quick Reference
        </h4>
        <div className="flex-1 space-y-2">
          {keyTakeaways.map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-sm border border-primary/40 bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 text-primary" />
              </div>
              <span className="text-[9px] text-foreground/80 leading-relaxed">{t}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-border/50">
          <p className="text-[8px] text-muted-foreground italic">From: {courseTitle} — {lessonTitle}</p>
        </div>
      </div>
    ),
  });

  return slides;
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

  const slides = generateSlides(courseTitle, lessonTitle, lessonDescription, keyTakeaways);
  const meta = getResourceMeta(courseTitle, lessonTitle, lessonId);
  const FIcon = fileTypeIcon[meta.fileType]?.icon || FileText;
  const fColor = fileTypeIcon[meta.fileType]?.color || "text-muted-foreground";
  const noteKey = `${courseTitle}-${lessonId}`;
  const hasNotes = !!courseNoteContent[noteKey];
  const diagrams = courseDiagrams[courseTitle] || courseDiagrams["Mastering Technical Interviews"];

  const handleDownload = useCallback(() => {
    if (!hasNotes || downloadState !== "idle") return;
    setDownloadState("loading");
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
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
      setTimeout(() => { setDownloadState("idle"); setDownloadProgress(0); }, 2000);
    }, 700);
  }, [hasNotes, downloadState, courseTitle, lessonTitle, keyTakeaways, lessonDescription, noteKey]);

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
          <p className="text-xs text-muted-foreground">Visual slide deck & downloadable materials for this lesson</p>
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
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <FIcon className={`w-5 h-5 ${fColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{meta.fileName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {meta.fileSize} • {meta.pages} pages
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {meta.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {tag}
                  </Badge>
                ))}
              </div>

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
                  <Button className="w-full gap-2" onClick={handleDownload} disabled={!hasNotes}>
                    <FileDown className="w-4 h-4" />
                    {hasNotes ? `Download ${meta.fileType.toUpperCase()}` : "Coming Soon"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Diagram preview cards — course-specific */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Included Diagrams</p>
            {diagrams.map((diag) => (
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
                  <p className="text-[10px] text-muted-foreground">{diag.description}</p>
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
