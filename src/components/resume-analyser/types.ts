export interface SkillToLearn {
  skill: string;
  reason: string;
  priority: "High" | "Medium" | "Low";
  how_to_learn: string;
  estimated_time: string;
}

export interface AnalysisResult {
  overall_score: number;
  scores: {
    clarity: number;
    impact: number;
    ats_compatibility: number;
    skills_match: number;
    formatting: number;
    grammar: number;
  };
  summary: string;
  strengths: string[];
  weaknesses: string[];
  quick_fixes: string[];
  missing_keywords: string[];
  skills_to_learn: SkillToLearn[];
  corrected_resume: string;
  rewrite_changes: string[];
}
