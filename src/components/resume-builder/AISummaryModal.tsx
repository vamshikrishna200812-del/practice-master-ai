import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface AISummaryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (summary: string) => void;
}

export default function AISummaryModal({ open, onClose, onSelect }: AISummaryModalProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  const generate = async () => {
    if (!jobTitle.trim()) { toast.error("Enter a target job title"); return; }
    setLoading(true);
    setOptions([]);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resume-ai`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
          body: JSON.stringify({ action: "generate_summary", jobTitle: jobTitle.trim(), skills: skills.trim() }),
        }
      );
      if (!res.ok) throw new Error("Failed");
      const { result } = await res.json();
      // Try to parse as JSON array
      try {
        const arr = JSON.parse(result);
        if (Array.isArray(arr)) { setOptions(arr.map(String)); return; }
      } catch {}
      // Fallback: split by numbered list
      const splits = result.split(/\d+[\.\)]\s+/).filter((s: string) => s.trim().length > 20);
      setOptions(splits.length >= 2 ? splits.slice(0, 3) : [result]);
    } catch {
      toast.error("Failed to generate summaries");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> AI Summary Generator</DialogTitle>
          <DialogDescription>Enter your target role and skills to generate tailored summaries.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Target Job Title</Label>
            <Input placeholder="e.g. Senior Frontend Engineer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Top 3 Skills</Label>
            <Input placeholder="e.g. React, TypeScript, System Design" value={skills} onChange={e => setSkills(e.target.value)} className="mt-1" />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Summaries</>}
          </Button>

          {options.length > 0 && (
            <div className="space-y-2 mt-2">
              <Label className="text-xs text-muted-foreground">Choose a summary:</Label>
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => { onSelect(opt.trim()); onClose(); toast.success("Summary applied!"); }}
                  className="w-full text-left p-3 border rounded-xl text-sm hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  {opt.trim()}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
