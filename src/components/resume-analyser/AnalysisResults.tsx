import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Download, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Zap, Tag, GraduationCap, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AnalysisResult } from "./types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }),
};

const ScoreRing = ({ score }: { score: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = animatedScore >= 75 ? "hsl(var(--chart-2))" : animatedScore >= 50 ? "hsl(45 93% 47%)" : "hsl(0 84% 60%)";

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground" style={{ color }}>{animatedScore}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
};

const ProgressBar = ({ label, value }: { label: string; value: number }) => {
  const [animated, setAnimated] = useState(0);
  const color = animated >= 75 ? "bg-green-500" : animated >= 50 ? "bg-amber-500" : "bg-red-500";

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 300);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{animated}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)} style={{ width: `${animated}%` }} />
      </div>
    </div>
  );
};

export const AnalysisResults = ({ result, onReset }: AnalysisResultsProps) => {
  const [changesOpen, setChangesOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const copyResume = () => {
    navigator.clipboard.writeText(result.corrected_resume);
    toast.success("Resume copied to clipboard");
  };

  const downloadResume = () => {
    const blob = new Blob([result.corrected_resume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "corrected-resume.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Resume downloaded");
  };

  const sortedSkills = [...result.skills_to_learn].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return (order[a.priority] ?? 2) - (order[b.priority] ?? 2);
  });

  const priorityColor: Record<string, string> = {
    High: "bg-red-500/10 text-red-500 border-red-500/20",
    Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Low: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return (
    <div ref={resultsRef} className="space-y-6">
      {/* Overall Score */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-4">Overall Resume Score</h3>
          <ScoreRing score={result.overall_score} />
        </Card>
      </motion.div>

      {/* Sub Scores */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Scores</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <ProgressBar label="Clarity" value={result.scores.clarity} />
            <ProgressBar label="Impact" value={result.scores.impact} />
            <ProgressBar label="ATS Compatibility" value={result.scores.ats_compatibility} />
            <ProgressBar label="Skills Match" value={result.scores.skills_match} />
            <ProgressBar label="Formatting" value={result.scores.formatting} />
            <ProgressBar label="Grammar" value={result.scores.grammar} />
          </div>
        </Card>
      </motion.div>

      {/* Summary */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-6 border-primary/30 bg-primary/5">
          <h3 className="text-lg font-semibold text-foreground mb-2">Summary</h3>
          <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
        </Card>
      </motion.div>

      {/* Strengths / Weaknesses / Quick Fixes */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5 border-green-500/20 bg-green-500/5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h4 className="font-semibold text-foreground">Strengths</h4>
            </div>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-green-500 shrink-0">•</span> {s}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5 border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h4 className="font-semibold text-foreground">Weaknesses</h4>
            </div>
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-amber-500 shrink-0">•</span> {w}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5 border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold text-foreground">Quick Fixes</h4>
            </div>
            <ol className="space-y-2">
              {result.quick_fixes.map((f, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-blue-500 shrink-0 font-medium">{i + 1}.</span> {f}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </motion.div>

      {/* Missing Keywords */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Add These Keywords for ATS Match</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missing_keywords.map((kw, i) => (
              <Badge key={i} variant="secondary" className="text-sm">{kw}</Badge>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Skills to Learn */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Skills You Should Learn to Get Hired Faster</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {sortedSkills.map((skill, i) => (
              <Card key={i} className="p-4 border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{skill.skill}</h4>
                  <Badge variant="outline" className={cn("text-xs", priorityColor[skill.priority])}>
                    {skill.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{skill.reason}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><span className="font-medium text-foreground">Learn:</span> {skill.how_to_learn}</p>
                  <p><span className="font-medium text-foreground">Time:</span> {skill.estimated_time}</p>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Corrected Resume */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Corrected Resume</h3>
          <div className="max-h-96 overflow-auto rounded-lg border bg-muted/30 p-4 text-sm text-foreground whitespace-pre-wrap font-mono mb-4">
            {result.corrected_resume}
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={copyResume} variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" /> Copy to Clipboard
            </Button>
            <Button onClick={downloadResume} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> Download as .txt
            </Button>
          </div>
          <Collapsible open={changesOpen} onOpenChange={setChangesOpen} className="mt-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full">
                {changesOpen ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                What Changed?
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="mt-3 space-y-2">
                {result.rewrite_changes.map((c, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary shrink-0">•</span> {c}
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </motion.div>

      {/* Reset */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="text-center pb-8">
        <Button onClick={onReset} variant="outline" size="lg">
          <RotateCcw className="w-4 h-4 mr-2" /> Analyse Another Resume
        </Button>
      </motion.div>
    </div>
  );
};
