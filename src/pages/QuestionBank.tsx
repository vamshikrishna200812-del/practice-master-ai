import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QuestionCard from "@/components/question-bank/QuestionCard";
import QuestionBankHeader from "@/components/question-bank/QuestionBankHeader";
import QuestionNavigation from "@/components/question-bank/QuestionNavigation";
import CategoryFilters from "@/components/question-bank/CategoryFilters";
import ProgressTracker from "@/components/question-bank/ProgressTracker";
import { toast } from "sonner";

export interface Question {
  id: string;
  industry: string;
  category: string;
  question: string;
  difficulty: string;
  tips: string | null;
}

const QuestionBank = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewedSet, setViewedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("question_bank")
          .select("*")
          .order("industry", { ascending: true });
        if (error) throw error;
        setQuestions(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load questions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(questions.map((q) => q.category))],
    [questions]
  );

  const filtered = useMemo(
    () =>
      selectedCategory === "All"
        ? questions
        : questions.filter((q) => q.category === selectedCategory),
    [questions, selectedCategory]
  );

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  // Mark current question as viewed
  useEffect(() => {
    if (filtered.length > 0) {
      setViewedSet((prev) => new Set(prev).add(filtered[currentIndex]?.id));
    }
  }, [currentIndex, filtered]);

  const currentQuestion = filtered[currentIndex] ?? null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-[80vh] rounded-2xl p-4 md:p-8 space-y-6" style={{ background: "#0f172a" }}>
        <QuestionBankHeader totalQuestions={filtered.length} />

        <ProgressTracker
          viewed={filtered.filter((q) => viewedSet.has(q.id)).length}
          total={filtered.length}
        />

        <CategoryFilters
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {currentQuestion ? (
          <>
            <QuestionCard question={currentQuestion} />
            <QuestionNavigation
              current={currentIndex}
              total={filtered.length}
              onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              onNext={() => setCurrentIndex((i) => Math.min(filtered.length - 1, i + 1))}
            />
          </>
        ) : (
          <div className="text-center py-16 text-white/50">No questions in this category.</div>
        )}

        {/* Project Showcase */}
        <div
          className="mt-8 rounded-xl p-5 border border-white/10 backdrop-blur-md"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-2">
            Featured Project
          </p>
          <h3 className="text-white font-bold text-lg mb-1">AI Interview Simulator</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Engineered a dynamic learning module using React state hooks and Tailwind CSS, featuring
            a filtered question bank and interactive "reveal" logic to assist 200+ users in
            technical interview prep.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuestionBank;
