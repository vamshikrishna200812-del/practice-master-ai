import { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Search, RotateCcw } from "lucide-react";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import ResumeEditor from "@/components/resume-builder/ResumeEditor";
import ResumePreview from "@/components/resume-builder/ResumePreview";
import TemplateSwitcher from "@/components/resume-builder/TemplateSwitcher";
import AISummaryModal from "@/components/resume-builder/AISummaryModal";
import ATSScanner from "@/components/resume-builder/ATSScanner";
import ResumeStrengthMeter from "@/components/resume-builder/ResumeStrengthMeter";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ResumeBuilder = () => {
  const {
    resume, template, setTemplate,
    updatePersonalInfo, updateSummary,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    updateHardSkills, updateSoftSkills,
    addProject, updateProject, removeProject,
    addCertification, updateCertification, removeCertification,
    addAchievement, updateAchievement, removeAchievement,
    resetResume, calculateScore,
  } = useResumeBuilder();

  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [atsOpen, setAtsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const score = calculateScore();

  const exportPDF = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, useCORS: true, backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
      pdf.save(`${resume.personalInfo.fullName || "resume"}.pdf`);
      toast.success("PDF exported!");
    } catch {
      toast.error("PDF export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">AI Resume Builder</h1>
            <p className="text-sm text-muted-foreground">Build an ATS-optimized resume with AI assistance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setAtsOpen(!atsOpen)}>
              <Search className="w-3.5 h-3.5" /> ATS Scanner
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-destructive" onClick={resetResume}>
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
            <Button size="sm" className="gap-1.5" onClick={exportPDF} disabled={exporting}>
              <Download className="w-3.5 h-3.5" /> {exporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="bg-card border rounded-xl p-3">
          <ResumeStrengthMeter score={score} />
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editor */}
          <ScrollArea className="h-[calc(100vh-240px)]">
            <ResumeEditor
              resume={resume}
              updatePersonalInfo={updatePersonalInfo}
              updateSummary={updateSummary}
              addExperience={addExperience}
              updateExperience={updateExperience}
              removeExperience={removeExperience}
              addEducation={addEducation}
              updateEducation={updateEducation}
              removeEducation={removeEducation}
              updateHardSkills={updateHardSkills}
              updateSoftSkills={updateSoftSkills}
              addProject={addProject}
              updateProject={updateProject}
              removeProject={removeProject}
              addCertification={addCertification}
              updateCertification={updateCertification}
              removeCertification={removeCertification}
              addAchievement={addAchievement}
              updateAchievement={updateAchievement}
              removeAchievement={removeAchievement}
              onOpenSummaryAI={() => setSummaryModalOpen(true)}
            />
          </ScrollArea>

          {/* Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Live Preview</span>
              <TemplateSwitcher current={template} onChange={setTemplate} />
            </div>
            <div className="border rounded-xl overflow-hidden shadow-lg bg-white">
              <div ref={previewRef}>
                <ResumePreview resume={resume} template={template} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AISummaryModal open={summaryModalOpen} onClose={() => setSummaryModalOpen(false)} onSelect={updateSummary} />
      <ATSScanner resume={resume} open={atsOpen} onClose={() => setAtsOpen(false)} />
    </DashboardLayout>
  );
};

export default ResumeBuilder;
