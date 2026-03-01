import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Award, MessageSquare, TrendingUp, Brain, CheckCircle2, AlertCircle,
  Play, Share2, Target, Home, Mic, Cpu, Zap, Heart, 
  PuzzleIcon, Crown, Star, Trophy, FileDown, Volume2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { generateReportHTML } from "@/utils/generateReportHTML";
import { SuccessCelebration } from "@/components/ui/SuccessCelebration";
import { ConfettiRain } from "@/components/ui/ConfettiRain";
import { useAchievements } from "@/hooks/useAchievements";
import { useCelebrationSound } from "@/hooks/useCelebrationSound";
import { useBrowserTTS } from "@/hooks/useBrowserTTS";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

interface InterviewResponse {
  question: string;
  answer: string;
  feedback?: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
}

interface ReportBadge {
  name: string;
  icon: string;
  description: string;
}

interface FinalReport {
  overallScore: number;
  communicationScore: number;
  confidenceScore: number;
  technicalScore: number;
  problemSolvingScore?: number;
  cultureFitScore?: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  sentiment?: { positive: number; neutral: number; hesitant: number };
  confidenceTimeline?: number[];
  betterAnswers?: string[];
  badges?: ReportBadge[];
}

interface InterviewReportProps {
  report: FinalReport;
  responses: InterviewResponse[];
  interviewType: "behavioral" | "technical" | "coding";
  onPracticeAgain: () => void;
}

const BADGE_ICONS: Record<string, React.ElementType> = {
  mic: Mic, cpu: Cpu, zap: Zap, heart: Heart, puzzle: PuzzleIcon,
  crown: Crown, star: Star, trophy: Trophy,
};

const PIE_COLORS = ["#22c55e", "#94a3b8", "#f59e0b"];

export const InterviewReport = ({
  report,
  responses,
  interviewType,
  onPracticeAgain,
}: InterviewReportProps) => {
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(true);
  const [showAchievementConfetti, setShowAchievementConfetti] = useState(false);
  const { checkAndAwardAchievements } = useAchievements();
  const { playSound } = useCelebrationSound();
  const { speak, isSpeaking, stop: stopSpeaking } = useBrowserTTS({ rate: 0.95 });
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  useEffect(() => {
    const checkAchievements = async () => {
      const earned = await checkAndAwardAchievements({
        highScore: report.overallScore,
        perfectScore: report.overallScore === 100,
        bodyLanguageScore: report.confidenceScore,
        communicationScore: report.communicationScore,
      });
      if (earned.length > 0) {
        setShowAchievementConfetti(true);
        playSound("achievement");
      }
    };
    checkAchievements();
  }, [report, checkAndAwardAchievements, playSound]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  const handleSpeak = (text: string, index: number) => {
    if (speakingIndex === index && isSpeaking) {
      stopSpeaking();
      setSpeakingIndex(null);
    } else {
      stopSpeaking();
      setSpeakingIndex(index);
      speak(text);
    }
  };

  // Radar chart data (5 dimensions)
  const radarData = [
    { skill: "Technical", score: report.technicalScore, fullMark: 100 },
    { skill: "Communication", score: report.communicationScore, fullMark: 100 },
    { skill: "Confidence", score: report.confidenceScore, fullMark: 100 },
    { skill: "Problem Solving", score: report.problemSolvingScore ?? Math.round((report.technicalScore + report.overallScore) / 2), fullMark: 100 },
    { skill: "Culture Fit", score: report.cultureFitScore ?? Math.round((report.communicationScore + report.confidenceScore) / 2), fullMark: 100 },
  ];

  // Sentiment pie
  const sentiment = report.sentiment ?? { positive: 55, neutral: 30, hesitant: 15 };
  const sentimentData = [
    { name: "Positive", value: sentiment.positive },
    { name: "Neutral", value: sentiment.neutral },
    { name: "Hesitant", value: sentiment.hesitant },
  ];

  // Timeline
  const timeline = report.confidenceTimeline ?? responses.map((r) => r.feedback?.score ?? 50);
  const timelineData = timeline.map((val, i) => ({ question: `Q${i + 1}`, confidence: val }));

  // Question scores
  const questionScores = responses.map((r, i) => ({
    question: `Q${i + 1}`,
    score: r.feedback?.score || 0,
  }));

  // Badges
  const badges = report.badges ?? [];

  // PDF download
  const handleDownload = async () => {
    toast.info("Generating PDF...");
    try {
      const htmlContent = generateReportHTML(report, responses, interviewType);
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.left = "-9999px";
      iframe.style.width = "1100px";
      iframe.style.height = "1600px";
      iframe.style.border = "none";
      document.body.appendChild(iframe);
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error("Could not access iframe");
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      await new Promise((r) => setTimeout(r, 800));
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(iframeDoc.body, { scale: 2, useCORS: true, backgroundColor: "#ffffff", width: 1100, windowWidth: 1100 });
      document.body.removeChild(iframe);
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: [pdfWidth, pdfHeight] });
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`interview-report-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF report downloaded!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const handleShare = async () => {
    const shareText = `I just completed an AI Interview! 🎯\n\nOverall Score: ${report.overallScore}/100\nCommunication: ${report.communicationScore}/100\nConfidence: ${report.confidenceScore}/100\nTechnical: ${report.technicalScore}/100`;
    if (navigator.share) {
      try { await navigator.share({ title: "My AI Interview Results", text: shareText }); } catch {}
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Results copied to clipboard!");
    }
  };

  return (
    <>
      <ConfettiRain isActive={showAchievementConfetti} onComplete={() => setShowAchievementConfetti(false)} />
      <SuccessCelebration
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title="🎉 Interview Complete!"
        message={`Great job! You scored ${report.overallScore}/100. Keep practicing to improve your skills!`}
        actionLabel="View Full Report"
        onAction={() => setShowCelebration(false)}
      />

      <div className="min-h-screen bg-gray-50 py-8 px-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ── Header ── */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
            <p className="text-gray-500 max-w-lg mx-auto">{report.summary}</p>
          </motion.div>

          {/* ── Circular Score Card ── */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Card className="p-8 text-center bg-white shadow-sm border-gray-200">
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={report.overallScore >= 80 ? "#22c55e" : report.overallScore >= 60 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(report.overallScore / 100) * 263.9} 263.9`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn("text-4xl font-bold", getScoreColor(report.overallScore))}>{report.overallScore}</span>
                  <span className="text-xs text-gray-400">/100</span>
                </div>
              </div>
              <p className={cn("text-lg font-semibold", getScoreColor(report.overallScore))}>{getScoreLabel(report.overallScore)}</p>
              <p className="text-sm text-gray-400 mt-1">Overall Interview Score</p>

              {/* Sub-scores */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                {[
                  { label: "Technical", score: report.technicalScore, icon: Brain },
                  { label: "Communication", score: report.communicationScore, icon: MessageSquare },
                  { label: "Confidence", score: report.confidenceScore, icon: TrendingUp },
                  { label: "Problem Solving", score: report.problemSolvingScore ?? 0, icon: Target },
                  { label: "Culture Fit", score: report.cultureFitScore ?? 0, icon: Heart },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <s.icon className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                    <p className={cn("text-xl font-bold", getScoreColor(s.score))}>{s.score}</p>
                    <p className="text-[11px] text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* ── Charts Row: Radar + Sentiment Pie + Timeline ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid md:grid-cols-3 gap-6">
            {/* Radar Chart */}
            <Card className="p-5 bg-white shadow-sm border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Performance Radar</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: "#6b7280", fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 9 }} />
                    <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Sentiment Pie */}
            <Card className="p-5 bg-white shadow-sm border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Tone Analysis</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                      {sentimentData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {sentimentData.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    {s.name}
                  </div>
                ))}
              </div>
            </Card>

            {/* Confidence Timeline */}
            <Card className="p-5 bg-white shadow-sm border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Confidence Timeline</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="question" tick={{ fill: "#6b7280", fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 9 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: 12 }} />
                    <Line type="monotone" dataKey="confidence" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: "#8b5cf6" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* ── Strengths & Weaknesses ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white shadow-sm border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">What You Nailed</h3>
              </div>
              <ul className="space-y-3">
                {report.strengths.map((s, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">{s}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 bg-white shadow-sm border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-gray-900">Areas to Improve</h3>
              </div>
              <ul className="space-y-3">
                {report.improvements.map((s, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <span className="text-sm text-gray-700">{s}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>

          {/* ── Question Review with "Better Way to Say It" ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 bg-white shadow-sm border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Sample Question Review</h3>
              <ScrollArea className="max-h-[500px] pr-2">
                <div className="space-y-5">
                  {responses.map((response, i) => {
                    const betterAnswer = report.betterAnswers?.[i];
                    return (
                      <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                        {/* Question */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <p className="font-medium text-gray-900 text-sm">Q{i + 1}: {response.question}</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSpeak(betterAnswer || response.answer, i)}
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                speakingIndex === i && isSpeaking
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                              )}
                              title="Listen to better answer"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            {response.feedback && (
                              <Badge variant={response.feedback.score >= 70 ? "default" : "secondary"} className={cn("text-xs", response.feedback.score >= 70 ? "bg-green-600 hover:bg-green-700" : "")}>
                                {response.feedback.score}/100
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* User's answer */}
                        <div className="mb-3">
                          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">Your Answer</p>
                          <p className="text-sm text-gray-600">
                            {response.answer === "[Skipped]" ? <span className="italic text-gray-400">Skipped</span> : response.answer}
                          </p>
                        </div>

                        {/* Better way */}
                        {betterAnswer && (
                          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                            <p className="text-[11px] uppercase tracking-wider text-blue-500 font-medium mb-1">💡 Better Way to Say It</p>
                            <p className="text-sm text-blue-800 leading-relaxed">{betterAnswer}</p>
                          </div>
                        )}

                        {/* Feedback */}
                        {response.feedback && (
                          <p className="text-xs text-gray-400 mt-2 bg-white p-2 rounded border border-gray-100">
                            {response.feedback.feedback}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </Card>
          </motion.div>

          {/* ── Question Performance Bar Chart ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card className="p-6 bg-white shadow-sm border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Question-by-Question Performance</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={questionScores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="question" tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: 12 }} />
                    <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* ── Badges Earned ── */}
          {badges.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="p-6 bg-white shadow-sm border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold text-gray-900">Badges Earned</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {badges.map((badge, i) => {
                    const Icon = BADGE_ICONS[badge.icon] || Award;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                        className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-2 shadow-md">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{badge.name}</p>
                        <p className="text-[11px] text-gray-500 mt-1">{badge.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ── Recommendations ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <Card className="p-6 bg-white shadow-sm border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
              <div className="space-y-3">
                {report.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <Badge variant="secondary" className="mt-0.5 bg-blue-100 text-blue-700 border-0">{i + 1}</Badge>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* ── Actions ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-wrap justify-center gap-3 pb-8">
            <Button size="lg" onClick={onPracticeAgain} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md">
              <Play className="w-4 h-4 mr-2" />
              Practice Again
            </Button>
            <Button size="lg" variant="outline" onClick={handleDownload} className="rounded-xl border-gray-300">
              <FileDown className="w-4 h-4 mr-2" />
              Download Full Report (PDF)
            </Button>
            <Button size="lg" variant="outline" onClick={handleShare} className="rounded-xl border-gray-300">
              <Share2 className="w-4 h-4 mr-2" />
              Share Results
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate("/ai-interview-bot")} className="rounded-xl">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
};
