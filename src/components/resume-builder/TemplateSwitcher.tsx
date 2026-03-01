import { TemplateStyle } from "./types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const templates: { id: TemplateStyle; label: string; desc: string }[] = [
  { id: "modern", label: "Modern", desc: "Indigo accents" },
  { id: "professional", label: "Professional", desc: "Classic serif" },
  { id: "creative", label: "Creative", desc: "Gradient flair" },
  { id: "minimal", label: "Minimal", desc: "Clean & light" },
];

interface TemplateSwitcherProps {
  current: TemplateStyle;
  onChange: (t: TemplateStyle) => void;
}

export default function TemplateSwitcher({ current, onChange }: TemplateSwitcherProps) {
  return (
    <div className="flex gap-1.5">
      {templates.map(t => (
        <Button
          key={t.id}
          variant={current === t.id ? "default" : "outline"}
          size="sm"
          className={cn("text-xs h-7 px-2.5", current === t.id && "shadow-sm")}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
}
