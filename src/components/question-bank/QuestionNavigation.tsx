import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

const QuestionNavigation = ({ current, total, onPrev, onNext }: Props) => (
  <div className="flex items-center justify-between">
    <button
      onClick={onPrev}
      disabled={current === 0}
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-muted text-muted-foreground border border-border hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <ChevronLeft className="w-4 h-4" />
      Previous
    </button>

    <span className="text-sm text-muted-foreground tabular-nums">
      {current + 1} / {total}
    </span>

    <button
      onClick={onNext}
      disabled={current >= total - 1}
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-muted text-muted-foreground border border-border hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
    >
      Next
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);

export default QuestionNavigation;
