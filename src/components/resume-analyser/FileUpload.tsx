import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FileUploadProps {
  resumeText: string;
  onResumeTextChange: (text: string) => void;
}

declare global {
  interface Window {
    pdfjsLib: any;
    mammoth: any;
  }
}

const loadPdfJs = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve();
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
};

const loadMammoth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.mammoth) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
};

export const FileUpload = ({ resumeText, onResumeTextChange }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const extractText = useCallback(async (f: File) => {
    setExtracting(true);
    try {
      const ext = f.name.split(".").pop()?.toLowerCase();

      if (ext === "txt") {
        const text = await f.text();
        onResumeTextChange(text);
        toast.success("Text extracted from file");
      } else if (ext === "pdf") {
        await loadPdfJs();
        const buf = await f.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(" ") + "\n";
        }
        onResumeTextChange(text.trim());
        toast.success("PDF text extracted");
      } else if (ext === "docx") {
        await loadMammoth();
        const buf = await f.arrayBuffer();
        const result = await window.mammoth.extractRawText({ arrayBuffer: buf });
        onResumeTextChange(result.value);
        toast.success("DOCX text extracted");
      } else if (ext === "doc") {
        toast.error(".doc files are not supported. Please convert to .docx or .pdf");
        return;
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to extract text. Try pasting manually.");
    } finally {
      setExtracting(false);
    }
  }, [onResumeTextChange]);

  const handleFile = (f: File) => {
    const valid = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!valid.includes(f.type) && !f.name.endsWith(".txt") && !f.name.endsWith(".pdf") && !f.name.endsWith(".docx")) {
      toast.error("Please upload a PDF, DOCX, or TXT file");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }
    setFile(f);
    extractText(f);
  };

  const charCount = resumeText.length;
  const isOverLimit = charCount > 8000;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <button
          onClick={() => setActiveTab("upload")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all",
            activeTab === "upload"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Upload className="w-4 h-4" /> Upload File
        </button>
        <button
          onClick={() => setActiveTab("paste")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all",
            activeTab === "paste"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="w-4 h-4" /> Paste Text
        </button>
      </div>

      {activeTab === "upload" ? (
        <div className="space-y-3">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            className={cn(
              "relative border-2 border-dashed rounded-xl p-8 transition-all text-center cursor-pointer",
              dragOver
                ? "border-primary bg-primary/5"
                : file
                ? "border-green-500/50 bg-green-500/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            )}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {extracting ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-foreground">Extracting text…</p>
              </div>
            ) : file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-green-500" />
                <div className="text-left">
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    onResumeTextChange("");
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  Drop your resume here or click to upload
                </p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT (max 10MB)</p>
              </div>
            )}
          </div>

          {resumeText && (
            <Collapsible open={previewOpen} onOpenChange={setPreviewOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  {previewOpen ? "Hide" : "Show"} Extracted Text Preview
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 max-h-48 overflow-auto rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                  {resumeText.slice(0, 3000)}
                  {resumeText.length > 3000 && "…"}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      ) : (
        <Textarea
          placeholder="Paste your resume text here…"
          value={resumeText}
          onChange={(e) => onResumeTextChange(e.target.value)}
          className="min-h-[200px] resize-none font-mono text-xs"
        />
      )}

      {isOverLimit && (
        <div className="flex items-center gap-2 text-amber-500 text-sm">
          <AlertTriangle className="w-4 h-4" />
          Resume text exceeds 8000 characters ({charCount}). This may affect analysis quality.
        </div>
      )}
    </div>
  );
};
