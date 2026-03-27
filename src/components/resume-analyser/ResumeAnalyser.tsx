import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "./FileUpload";
import { AnalysisResults } from "./AnalysisResults";
import { AnalysisResult } from "./types";
import { motion } from "framer-motion";

const SYSTEM_PROMPT = `You are a world-class resume coach and hiring expert with 20+ years of experience. Analyse the resume and return ONLY a valid JSON object, nothing else, no markdown, no code fences.

{
  "overall_score": <0-100>,
  "scores": {
    "clarity": <0-100>,
    "impact": <0-100>,
    "ats_compatibility": <0-100>,
    "skills_match": <0-100>,
    "formatting": <0-100>,
    "grammar": <0-100>
  },
  "summary": "<honest 3-sentence verdict>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "quick_fixes": ["<fix 1>", "<fix 2>", "<fix 3>", "<fix 4>", "<fix 5>"],
  "missing_keywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
  "skills_to_learn": [
    {
      "skill": "<skill name>",
      "reason": "<why this skill helps for the target role>",
      "priority": "High" or "Medium" or "Low",
      "how_to_learn": "<best resource — Coursera, YouTube, docs, etc>",
      "estimated_time": "<e.g. 2 weeks, 1 month>"
    }
  ],
  "corrected_resume": "<complete rewritten polished resume as plain text>",
  "rewrite_changes": ["<what changed and why 1>", "<change 2>", "<change 3>", "<change 4>", "<change 5>"]
}

Rules:
- Return ONLY JSON. Nothing else.
- corrected_resume must be the full complete resume, not a summary.
- skills_to_learn must have minimum 5 to 8 skills.
- Be specific and honest, no generic advice.
- If job title and industry are provided, tailor everything for that role.
- If experience is Fresher, adjust expectations accordingly.`;

const ShimmerLoader = () => (
  <div className="space-y-4 py-8">
    <div className="text-center mb-6">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-sm font-medium text-foreground">Analysing your resume with AI…</p>
      <p className="text-xs text-muted-foreground mt-1">This may take 15-30 seconds</p>
    </div>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-24 rounded-lg bg-muted/60 animate-pulse" />
    ))}
  </div>
);

export const ResumeAnalyser = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyse = async () => {
    if (!resumeText.trim()) {
      toast.error("Please provide your resume text");
      return;
    }
    if (!apiKey.trim()) {
      toast.error("Please enter your Anthropic API key");
      return;
    }

    let userPrompt = `Resume:\n\n${resumeText}`;
    if (jobTitle) userPrompt += `\n\nTarget Job Title: ${jobTitle}`;
    if (industry) userPrompt += `\nIndustry: ${industry}`;
    if (experience) userPrompt += `\nExperience Level: ${experience}`;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        if (response.status === 401) {
          toast.error("Invalid API key. Please check your Anthropic API key.");
        } else if (response.status === 429) {
          toast.error("Rate limited. Please wait and try again.");
        } else {
          toast.error(err?.error?.message || `API error: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      const text = data.content?.[0]?.text || "";

      // Try to extract JSON from the response
      let json: AnalysisResult;
      try {
        json = JSON.parse(text);
      } catch {
        // Try extracting JSON from code fences
        const match = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
        if (match) {
          json = JSON.parse(match[1] || match[0]);
        } else {
          throw new Error("Could not parse AI response");
        }
      }

      setResult(json);
      toast.success("Resume analysis complete!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to analyse resume");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setResumeText("");
    setJobTitle("");
    setIndustry("");
    setExperience("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (result) {
    return <AnalysisResults result={result} onReset={handleReset} />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-3">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">AI Resume Analyser & Corrector</h2>
            <p className="text-sm text-muted-foreground mt-1">Upload your resume, get AI-powered analysis and a corrected version</p>
          </div>

          <FileUpload resumeText={resumeText} onResumeTextChange={setResumeText} />

          <div className="grid gap-4 sm:grid-cols-3 mt-6">
            <div>
              <Label className="text-xs text-muted-foreground">Target Job Title</Label>
              <Input
                placeholder="e.g. Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Industry</Label>
              <Input
                placeholder="e.g. Tech, Finance"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Experience</Label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fresher">Fresher</SelectItem>
                  <SelectItem value="1-3 years">1-3 years</SelectItem>
                  <SelectItem value="3-5 years">3-5 years</SelectItem>
                  <SelectItem value="5+ years">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-xs text-muted-foreground">Anthropic API Key (session only, never stored)</Label>
            <div className="relative mt-1">
              <Input
                type={showKey ? "text" : "password"}
                placeholder="sk-ant-…"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            onClick={handleAnalyse}
            disabled={loading || !resumeText.trim() || !apiKey.trim()}
            className="w-full mt-6 h-12 text-base"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Analyse & Improve My Resume
          </Button>
        </Card>
      </motion.div>

      {loading && <ShimmerLoader />}
    </div>
  );
};
