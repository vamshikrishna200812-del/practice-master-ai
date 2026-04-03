import { Brain } from "lucide-react";

interface Props {
  totalQuestions: number;
}

const QuestionBankHeader = ({ totalQuestions }: Props) => (
  <div className="flex items-center gap-3">
    <div className="p-2.5 rounded-xl bg-purple-100 border border-purple-200">
      <Brain className="w-6 h-6 text-purple-600" />
    </div>
    <div>
      <h1 className="text-2xl font-bold text-foreground tracking-tight">Question Bank</h1>
      <p className="text-muted-foreground text-sm">
        {totalQuestions} question{totalQuestions !== 1 ? "s" : ""} — browse by category
      </p>
    </div>
  </div>
);

export default QuestionBankHeader;
