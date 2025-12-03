import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Award, 
  MessageSquare, 
  TrendingUp, 
  Brain, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Download,
  Share2,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

interface FinalReport {
  overallScore: number;
  communicationScore: number;
  confidenceScore: number;
  technicalScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

interface InterviewReportProps {
  report: FinalReport;
  responses: InterviewResponse[];
  interviewType: "behavioral" | "technical" | "coding";
  onPracticeAgain: () => void;
}

export const InterviewReport = ({
  report,
  responses,
  interviewType,
  onPracticeAgain,
}: InterviewReportProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
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

  const scoreCards = [
    { 
      label: "Overall", 
      score: report.overallScore, 
      icon: Award, 
      color: "from-primary to-primary/80",
      bgColor: "bg-primary/10"
    },
    { 
      label: "Communication", 
      score: report.communicationScore, 
      icon: MessageSquare, 
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10"
    },
    { 
      label: "Confidence", 
      score: report.confidenceScore, 
      icon: TrendingUp, 
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10"
    },
    { 
      label: "Technical", 
      score: report.technicalScore, 
      icon: Brain, 
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Interview Complete!</h1>
          <p className="text-muted-foreground max-w-md mx-auto">{report.summary}</p>
        </motion.div>

        {/* Score Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {scoreCards.map((card, i) => (
            <Card key={card.label} className={cn("p-5 text-center", card.bgColor)}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center",
                  "bg-gradient-to-br", card.color
                )}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <p className={cn("text-4xl font-bold mb-1", getScoreColor(card.score))}>
                  {card.score}
                </p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </motion.div>
            </Card>
          ))}
        </motion.div>

        {/* Overall Assessment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Overall Assessment</h3>
                <p className={cn("text-sm font-medium", getScoreColor(report.overallScore))}>
                  {getScoreLabel(report.overallScore)}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Interview Performance</span>
                  <span className="font-medium text-foreground">{report.overallScore}%</span>
                </div>
                <Progress value={report.overallScore} className="h-3" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Strengths & Improvements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-foreground">Your Strengths</h3>
            </div>
            <ul className="space-y-3">
              {report.strengths.map((strength, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <span className="text-sm text-foreground">{strength}</span>
                </motion.li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-foreground">Areas to Improve</h3>
            </div>
            <ul className="space-y-3">
              {report.improvements.map((improvement, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <span className="text-sm text-foreground">{improvement}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Personalized Recommendations</h3>
            <div className="space-y-3">
              {report.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge variant="secondary" className="mt-0.5">{i + 1}</Badge>
                  <span className="text-sm text-foreground">{rec}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Response Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Your Responses</h3>
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="space-y-4">
                {responses.map((response, i) => (
                  <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <p className="font-medium text-primary text-sm">Q{i + 1}: {response.question}</p>
                      {response.feedback && (
                        <Badge 
                          variant={response.feedback.score >= 70 ? "default" : "secondary"}
                          className={response.feedback.score >= 70 ? "bg-green-600" : ""}
                        >
                          {response.feedback.score}/100
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {response.answer === "[Skipped]" ? (
                        <span className="italic">Question skipped</span>
                      ) : (
                        response.answer
                      )}
                    </p>
                    {response.feedback && (
                      <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                        {response.feedback.feedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button size="lg" onClick={onPracticeAgain}>
            <Play className="w-4 h-4 mr-2" />
            Practice Again
          </Button>
          <Button size="lg" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button size="lg" variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
