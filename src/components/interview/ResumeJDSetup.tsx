import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Briefcase, 
  X, 
  CheckCircle2, 
  Loader2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ResumeJDSetupProps {
  onComplete: (data: { resumeText?: string; jobDescription?: string; customQuestions?: string[] }) => void;
  onSkip: () => void;
}

interface ParsedResume {
  name?: string;
  skills?: string[];
  experience?: Array<{ title: string; company: string }>;
  projects?: Array<{ name: string; technologies?: string[] }>;
}

export const ResumeJDSetup = ({ onComplete, onSkip }: ResumeJDSetupProps) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [activeTab, setActiveTab] = useState<"resume" | "jd">("resume");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setResumeFile(file);
    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to upload your resume");
        setIsUploading(false);
        return;
      }

      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Failed to upload resume");
        setIsUploading(false);
        return;
      }

      // Parse the resume
      setIsParsing(true);
      const { data: parseData, error: parseError } = await supabase.functions.invoke("parse-resume", {
        body: { type: "parse_resume", resumeUrl: fileName }
      });

      if (parseError) {
        console.error("Parse error:", parseError);
        toast.error("Failed to parse resume. Try pasting the text instead.");
      } else if (parseData?.parsedResume) {
        setParsedResume(parseData.parsedResume);
        setResumeText(parseData.rawText || "");
        toast.success("Resume parsed successfully!");
      }
    } catch (error) {
      console.error("Error processing resume:", error);
      toast.error("Something went wrong. Try pasting the text instead.");
    } finally {
      setIsUploading(false);
      setIsParsing(false);
    }
  };

  const handleResumeTextChange = (text: string) => {
    setResumeText(text);
    setParsedResume(null);
    setResumeFile(null);
  };

  const handleContinue = () => {
    if (!resumeText && !jobDescription) {
      toast.error("Please provide a resume or job description");
      return;
    }
    onComplete({ resumeText, jobDescription });
  };

  const clearResume = () => {
    setResumeFile(null);
    setResumeText("");
    setParsedResume(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full"
      >
        <Card className="p-8 border-2 border-border/50 shadow-xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-4">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Personalize Your Interview</h2>
              <p className="text-muted-foreground">
                Upload your resume and/or paste a job description for tailored questions
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setActiveTab("resume")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all",
                  activeTab === "resume"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileText className="w-4 h-4" />
                Resume
                {(resumeText || resumeFile) && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("jd")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all",
                  activeTab === "jd"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Briefcase className="w-4 h-4" />
                Job Description
                {jobDescription && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "resume" ? (
                <motion.div
                  key="resume"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {/* File Upload Area */}
                  <div
                    className={cn(
                      "relative border-2 border-dashed rounded-xl p-6 transition-all",
                      resumeFile
                        ? "border-green-500/50 bg-green-500/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading || isParsing}
                    />
                    
                    {isUploading || isParsing ? (
                      <div className="flex flex-col items-center justify-center py-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                        <p className="text-sm font-medium text-foreground">
                          {isParsing ? "Parsing your resume..." : "Uploading..."}
                        </p>
                      </div>
                    ) : resumeFile ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{resumeFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(resumeFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearResume();
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium text-foreground mb-1">
                          Drop your resume here or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF or Word document (max 10MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Parsed Resume Preview */}
                  {parsedResume && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-muted/50 border border-border"
                    >
                      <p className="text-sm font-medium text-foreground mb-2">
                        Extracted from your resume:
                      </p>
                      {parsedResume.skills && parsedResume.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {parsedResume.skills.slice(0, 10).map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {parsedResume.skills.length > 10 && (
                            <Badge variant="outline" className="text-xs">
                              +{parsedResume.skills.length - 10} more
                            </Badge>
                          )}
                        </div>
                      )}
                      {parsedResume.experience && parsedResume.experience.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {parsedResume.experience.length} work experience(s) found
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Or Paste Text */}
                  <div className="relative">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <p className="text-center text-xs text-muted-foreground py-3">
                      Or paste your resume text below
                    </p>
                  </div>

                  <Textarea
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => handleResumeTextChange(e.target.value)}
                    className="min-h-[150px] resize-none"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="jd"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-foreground">
                      <strong>Pro tip:</strong> Paste the job description you're applying for, and the AI will act as the hiring manager for that specific role.
                    </p>
                  </div>

                  <Textarea
                    placeholder="Paste the job description here...

Example:
We are looking for a Senior Software Engineer with 5+ years of experience in React and TypeScript. The ideal candidate will have experience with..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[250px] resize-none"
                  />

                  {jobDescription && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Job description added
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Summary */}
            {(resumeText || jobDescription) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Interview will be personalized based on{" "}
                  {resumeText && jobDescription
                    ? "your resume and the job description"
                    : resumeText
                    ? "your resume"
                    : "the job description"}
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onSkip}
                className="flex-1"
              >
                Skip for now
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!resumeText && !jobDescription}
                className="flex-1"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
