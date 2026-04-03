import { useState } from "react";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Question } from "@/pages/QuestionBank";

const difficultyStyles: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700 border-emerald-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  hard: "bg-red-100 text-red-700 border-red-200",
};

interface Props {
  question: Question;
}

const QuestionCard = ({ question }: Props) => {
  const [showAnswer, setShowAnswer] = useState(false);

  // Reset answer when question changes
  const [prevId, setPrevId] = useState(question.id);
  if (question.id !== prevId) {
    setPrevId(question.id);
    setShowAnswer(false);
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-6 border border-border bg-card shadow-sm"
    >
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Badge variant="outline" className="text-xs text-muted-foreground border-border">
          {question.industry}
        </Badge>
        <Badge variant="outline" className="text-xs text-muted-foreground border-border">
          {question.category}
        </Badge>
        <Badge variant="outline" className={`text-xs ${difficultyStyles[question.difficulty] ?? ""}`}>
          {question.difficulty}
        </Badge>
      </div>

      {/* Question */}
      <h2 className="text-xl font-semibold text-foreground leading-snug mb-5">
        {question.question}
      </h2>

      {/* Reveal button */}
      <button
        onClick={() => setShowAnswer((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200"
      >
        {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {showAnswer ? "Hide Expert Response" : "Show Expert Response"}
      </button>

      {/* Answer area */}
      <AnimatePresence>
        {showAnswer && question.tips && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex gap-3 p-4 rounded-xl bg-muted/50 border border-border">
              <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-purple-600 mb-1">Expert Tip</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{question.tips}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionCard;
