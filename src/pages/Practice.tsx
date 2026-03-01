import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProblemList from "@/components/practice/ProblemList";
import ProblemDetail from "@/components/practice/ProblemDetail";

const Practice = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const problemSlug = searchParams.get("problem");

  const handleSelectProblem = useCallback(
    (slug: string) => setSearchParams({ problem: slug }),
    [setSearchParams]
  );

  const handleBack = useCallback(
    () => setSearchParams({}),
    [setSearchParams]
  );

  return (
    <DashboardLayout>
      {problemSlug ? (
        <ProblemDetail slug={problemSlug} onBack={handleBack} />
      ) : (
        <ProblemList onSelectProblem={handleSelectProblem} />
      )}
    </DashboardLayout>
  );
};

export default Practice;
