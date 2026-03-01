import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2, X, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { ResumeData } from "./types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ATSScannerProps {
  resume: ResumeData;
  open: boolean;
  onClose: () => void;
}

export default function ATSScanner({ resume, open, onClose }: ATSScannerProps) {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ found: string[]; missing: string[]; suggestions: string[] } | null>(null);

  const resumeToText = () => {
    const pi = resume.personalInfo;
    const parts = [
      pi.fullName, resume.summary,
      ...resume.experience.flatMap(e => [e.title, e.company, ...e.bullets]),
      ...resume.education.map(e => `${e.degree} ${e.field} ${e.school}`),
      ...resume.skills,
      ...resume.projects.flatMap(p => [p.name, p.description, p.technologies]),
    ];
    return parts.filter(Boolean).join(" ");
  };

  const scan = async () => {
    if (!jd.trim()) { toast.error("Paste a job description first"); return; }
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resume-ai`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
          body: JSON.stringify({ action: "scan_keywords", jobDescription: jd.trim(), resumeText: resumeToText() }),
        }
      );
      if (!res.ok) throw new Error("Failed");
      const { result } = await res.json();
      try {
        const parsed = JSON.parse(result);
        setResults({ found: parsed.found || [], missing: parsed.missing || [], suggestions: parsed.suggestions || [] });
      } catch {
        // Try extracting JSON from text
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setResults({ found: parsed.found || [], missing: parsed.missing || [], suggestions: parsed.suggestions || [] });
        } else {
          toast.error("Couldn't parse AI response");
        }
      }
    } catch {
      toast.error("ATS scan failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed right-4 top-20 bottom-4 w-80 z-50 bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">ATS Keyword Scanner</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1 p-3 space-y-3">
        <div className="space-y-3">
          <Textarea
            placeholder="Paste the job description here..."
            value={jd}
            onChange={e => setJd(e.target.value)}
            rows={5}
            className="resize-none text-xs"
          />
          <Button onClick={scan} disabled={loading} size="sm" className="w-full gap-1.5">
            {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Scanning...</> : <><Search className="w-3.5 h-3.5" /> Scan Keywords</>}
          </Button>

          {results && (
            <div className="space-y-3 mt-2">
              {results.found.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-xs font-medium text-green-700">Found Keywords</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {results.found.map(k => (
                      <Badge key={k} variant="secondary" className="text-[10px] bg-green-100 text-green-700 border-green-200">{k}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {results.missing.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-amber-700">Missing Keywords</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {results.missing.map(k => (
                      <Badge key={k} variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 border-amber-200">{k}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {results.suggestions.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium">Tips</span>
                  </div>
                  <ul className="space-y-1">
                    {results.suggestions.map((s, i) => (
                      <li key={i} className="text-[10.5px] text-muted-foreground flex gap-1">
                        <span className="text-primary">→</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
