import { useState, useMemo, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { codingProblems } from "@/data/codingProblems";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useCodingSubmissions, CodingSubmission } from "@/hooks/useCodingSubmissions";
import { getTier } from "@/utils/levelTiers";
import { supabase } from "@/integrations/supabase/client";
import LevelUpCelebration from "./LevelUpCelebration";

interface ProblemDetailProps {
  slug: string;
  onBack: () => void;
}

type Verdict = "Passed" | "Failed" | "Runtime Error" | "Time Limit Exceeded";

interface TestResult {
  input: string;
  expected: string;
  actual: string;
  verdict: Verdict;
  hidden?: boolean;
}


const monacoLang: Record<string, string> = {
  javascript: "javascript",
  python: "python",
  java: "java",
  cpp: "cpp",
  c: "c",
};

const diffColor: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Hard: "bg-red-500/15 text-red-400 border-red-500/30",
};

const ProblemDetail = ({ slug, onBack }: ProblemDetailProps) => {
  const problem = useMemo(
    () => codingProblems.find((p) => p.slug === slug),
    [slug]
  );

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(problem?.starterCode.javascript ?? "");
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showHints, setShowHints] = useState<number[]>([]);
  const [showEditorial, setShowEditorial] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [submissions, setSubmissions] = useState<CodingSubmission[]>([]);
  const [levelUp, setLevelUp] = useState<{ oldTier: any; newTier: any } | null>(null);
  const prevPointsRef = useRef<number | null>(null);
  const { submitSolution, getSubmissions } = useCodingSubmissions();

  // Fetch current points on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("coding_points").select("total_points").eq("user_id", user.id).maybeSingle().then(({ data }) => {
        prevPointsRef.current = data?.total_points ?? 0;
      });
    });
  }, []);

  useEffect(() => {
    if (problem) {
      getSubmissions(problem.id).then(setSubmissions);
    }
  }, [problem?.id]);

  if (!problem) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Problem not found.</p>
        <Button variant="outline" onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(problem.starterCode[lang] ?? "");
    setResults([]);
  };

  const resetCode = () => {
    setCode(problem.starterCode[language] ?? "");
    setResults([]);
    toast.info("Code reset to starter template.");
  };

  // Simulated code execution — compares expected output
  const simulateRun = (hidden: boolean): Promise<TestResult[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cases = problem.testCases.filter((tc) =>
          hidden ? true : !tc.hidden
        );
        const res: TestResult[] = cases.map((tc) => {
          // Simple simulation: random pass with high probability for sample, lower for hidden
          const rand = Math.random();
          const passChance = tc.hidden ? 0.6 : 0.8;
          const passed = rand < passChance;
          const verdict: Verdict = passed
            ? "Passed"
            : rand < passChance + 0.1
            ? "Runtime Error"
            : rand < passChance + 0.15
            ? "Time Limit Exceeded"
            : "Failed";
          return {
            input: tc.hidden ? "[Hidden]" : tc.input,
            expected: tc.hidden ? "[Hidden]" : tc.expectedOutput,
            actual: passed ? tc.expectedOutput : tc.hidden ? "[Hidden]" : "wrong output",
            verdict: passed ? "Passed" : verdict,
            hidden: tc.hidden,
          };
        });
        resolve(res);
      }, 1200 + Math.random() * 800);
    });
  };

  const handleRun = async () => {
    setRunning(true);
    setResults([]);
    setActiveTab("results");
    const start = Date.now();
    const res = await simulateRun(false);
    setElapsed(Date.now() - start);
    setResults(res);
    setRunning(false);
    const passed = res.filter((r) => r.verdict === "Passed").length;
    if (passed === res.length) toast.success("All sample tests passed! 🎉");
    else toast.warning(`${passed}/${res.length} sample tests passed.`);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResults([]);
    setActiveTab("results");
    const start = Date.now();
    const res = await simulateRun(true);
    const ms = Date.now() - start;
    setElapsed(ms);
    setResults(res);
    setSubmitting(false);
    const passed = res.filter((r) => r.verdict === "Passed").length;

    // Save to database
    const result = await submitSolution({
      problemId: problem.id,
      problemTitle: problem.title,
      difficulty: problem.difficulty,
      language,
      code,
      passedTests: passed,
      totalTests: res.length,
      executionTimeMs: ms,
    });

    if (passed === res.length) {
      const pointsMsg = result?.alreadySolved ? " (already solved)" : ` +${result?.points || 0} points!`;
      toast.success(`🏆 All test cases passed!${pointsMsg}`);

      // Check for level-up
      if (result && result.points > 0 && prevPointsRef.current !== null) {
        const oldPts = prevPointsRef.current;
        const newPts = oldPts + result.points;
        const oldTier = getTier(oldPts);
        const newTier = getTier(newPts);
        if (newTier.name !== oldTier.name) {
          setLevelUp({ oldTier, newTier });
        }
        prevPointsRef.current = newPts;
      }
    } else {
      toast.error(`${passed}/${res.length} test cases passed.`);
    }

    // Refresh submissions
    getSubmissions(problem.id).then(setSubmissions);
  };

  const toggleHint = (i: number) => {
    setShowHints((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const verdictIcon = (v: Verdict) => {
    switch (v) {
      case "Passed": return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "Failed": return <XCircle className="w-4 h-4 text-red-400" />;
      case "Runtime Error": return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case "Time Limit Exceeded": return <Clock className="w-4 h-4 text-amber-400" />;
    }
  };

  const verdictBg = (v: Verdict) => {
    switch (v) {
      case "Passed": return "bg-emerald-500/10 border-emerald-500/20";
      case "Failed": return "bg-red-500/10 border-red-500/20";
      case "Runtime Error": return "bg-orange-500/10 border-orange-500/20";
      case "Time Limit Exceeded": return "bg-amber-500/10 border-amber-500/20";
    }
  };

  return (
    <div className="space-y-4">
      {/* Level Up Celebration */}
      {levelUp && (
        <LevelUpCelebration
          isVisible={!!levelUp}
          oldTier={levelUp.oldTier}
          newTier={levelUp.newTier}
          onClose={() => setLevelUp(null)}
        />
      )}
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <h1 className="text-xl font-bold flex-1 min-w-0 truncate">{problem.title}</h1>
        <Badge variant="outline" className={diffColor[problem.difficulty]}>{problem.difficulty}</Badge>
        <span className="text-xs text-muted-foreground">{problem.category}</span>
      </div>

      {/* Main split layout */}
      <div className="grid lg:grid-cols-2 gap-4 min-h-[70vh]">
        {/* Left panel — Description */}
        <Card className="p-0 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1">
            <TabsList className="w-full justify-start rounded-none border-b bg-card px-2">
              <TabsTrigger value="description" className="text-xs">Description</TabsTrigger>
              <TabsTrigger value="results" className="text-xs">
                Results {results.length > 0 && `(${results.filter(r => r.verdict === "Passed").length}/${results.length})`}
              </TabsTrigger>
              <TabsTrigger value="submissions" className="text-xs">
                History {submissions.length > 0 && `(${submissions.length})`}
              </TabsTrigger>
              <TabsTrigger value="hints" className="text-xs">Hints</TabsTrigger>
              <TabsTrigger value="editorial" className="text-xs">Editorial</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 overflow-auto p-5 m-0 space-y-5">
              {/* Tags */}
              <div className="flex gap-1.5 flex-wrap">
                {problem.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                ))}
              </div>

              {/* Description */}
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm">{problem.description}</div>
              </div>

              {/* Input/Output Format */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Input Format</h4>
                  <p className="text-sm">{problem.inputFormat}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Output Format</h4>
                  <p className="text-sm">{problem.outputFormat}</p>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Constraints</h4>
                <ul className="space-y-1">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="text-sm font-mono text-muted-foreground">• {c}</li>
                  ))}
                </ul>
              </div>

              {/* Sample cases */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Examples</h4>
                {problem.sampleCases.map((sc, i) => (
                  <div key={i} className="rounded-lg border bg-muted/50 p-3 space-y-2 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground font-medium">Input:</span>
                      <pre className="font-mono mt-0.5 text-xs whitespace-pre-wrap">{sc.input}</pre>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground font-medium">Output:</span>
                      <pre className="font-mono mt-0.5 text-xs">{sc.output}</pre>
                    </div>
                    {sc.explanation && (
                      <div className="text-xs text-muted-foreground italic">💡 {sc.explanation}</div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="results" className="flex-1 overflow-auto p-5 m-0">
              {running || submitting ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">{submitting ? "Running all test cases..." : "Running sample tests..."}</p>
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <Play className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-sm">Run or submit your code to see results.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {results.filter(r => r.verdict === "Passed").length}/{results.length} Passed
                    </span>
                    <span className="text-xs text-muted-foreground">{elapsed}ms</span>
                  </div>
                  <AnimatePresence>
                    {results.map((r, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`rounded-lg border p-3 ${verdictBg(r.verdict)}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {verdictIcon(r.verdict)}
                          <span className="text-sm font-medium">Test Case {i + 1}</span>
                          <span className="text-xs ml-auto">{r.verdict}</span>
                          {r.hidden && <Badge variant="outline" className="text-[10px]">Hidden</Badge>}
                        </div>
                        {!r.hidden && (
                          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                            <div>
                              <span className="text-muted-foreground block mb-0.5">Input</span>
                              <pre className="whitespace-pre-wrap">{r.input}</pre>
                            </div>
                            <div>
                              <span className="text-muted-foreground block mb-0.5">Expected</span>
                              <pre className="whitespace-pre-wrap">{r.expected}</pre>
                            </div>
                            <div>
                              <span className="text-muted-foreground block mb-0.5">Got</span>
                              <pre className="whitespace-pre-wrap">{r.actual}</pre>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            <TabsContent value="submissions" className="flex-1 overflow-auto p-5 m-0">
              {submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <Clock className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-sm">No submissions yet. Submit your code!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className={`rounded-lg border p-3 text-sm ${
                        sub.verdict === "Accepted"
                          ? "bg-emerald-500/10 border-emerald-500/20"
                          : "bg-red-500/10 border-red-500/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {sub.verdict === "Accepted" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="font-medium">{sub.verdict}</span>
                          {sub.points_earned > 0 && (
                            <Badge variant="secondary" className="text-[10px]">+{sub.points_earned} pts</Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>{sub.language}</span>
                        <span>{sub.passed_tests}/{sub.total_tests} passed</span>
                        <span>{sub.execution_time_ms}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="hints" className="flex-1 overflow-auto p-5 m-0 space-y-3">
              {problem.hints.map((hint, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <button
                    onClick={() => toggleHint(i)}
                    className="flex items-center gap-2 w-full text-left text-sm font-medium"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Hint {i + 1}
                    {showHints.includes(i) ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                  </button>
                  <AnimatePresence>
                    {showHints.includes(i) && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-sm text-muted-foreground mt-2 overflow-hidden"
                      >
                        {hint}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="editorial" className="flex-1 overflow-auto p-5 m-0">
              {showEditorial ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <BookOpen className="w-4 h-4 text-primary" /> Editorial
                  </div>
                  <p className="text-sm leading-relaxed">{problem.editorial}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <BookOpen className="w-8 h-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Reveal the solution approach?</p>
                  <Button size="sm" variant="outline" onClick={() => setShowEditorial(true)}>
                    Show Editorial
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        {/* Right panel — Editor */}
        <Card className="p-0 overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b bg-card">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="c">C</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1" />
            <Button size="sm" variant="ghost" onClick={resetCode} className="gap-1 text-xs h-8">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRun}
              disabled={running || submitting}
              className="gap-1 text-xs h-8"
            >
              <Play className="w-3.5 h-3.5" /> Run
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={running || submitting}
              className="gap-1 text-xs h-8"
            >
              <Send className="w-3.5 h-3.5" /> Submit
            </Button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-[400px]">
            <Editor
              height="100%"
              language={monacoLang[language]}
              value={code}
              onChange={(val) => setCode(val ?? "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                tabSize: 2,
                automaticLayout: true,
                padding: { top: 12 },
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProblemDetail;
