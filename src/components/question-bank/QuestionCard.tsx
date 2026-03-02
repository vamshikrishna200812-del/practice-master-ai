import { useState } from "react";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Question } from "@/pages/QuestionBank";

const difficultyStyles: Record<string, string> = {
  easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  hard: "bg-red-500/20 text-red-400 border-red-500/30",
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
      className="rounded-2xl p-6 border border-white/10 backdrop-blur-md"
      style={{ background: "rgba(255,255,255,0.06)" }}
    >
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Badge variant="outline" className="text-xs text-white/70 border-white/20">
          {question.industry}
        </Badge>
        <Badge variant="outline" className="text-xs text-white/70 border-white/20">
          {question.category}
        </Badge>
        <Badge variant="outline" className={`text-xs ${difficultyStyles[question.difficulty] ?? ""}`}>
          {question.difficulty}
        </Badge>
      </div>

      {/* Question */}
      <h2 className="text-xl font-semibold text-white leading-snug mb-5">
        {question.question}
      </h2>

      {/* Reveal button */}
      <button
        onClick={() => setShowAnswer((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/40"
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
            <div className="mt-4 flex gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-purple-400 mb-1">Expert Tip</p>
                <p className="text-sm text-white/70 leading-relaxed">{question.tips}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionCard;
