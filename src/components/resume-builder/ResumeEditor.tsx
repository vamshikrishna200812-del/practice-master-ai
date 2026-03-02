import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User, Plus, Trash2, Sparkles, ChevronDown, ChevronUp,
  Briefcase, GraduationCap, Wrench, FolderKanban, Award, Trophy
} from "lucide-react";
import { ResumeData } from "./types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";


interface ResumeEditorProps {
  resume: ResumeData;
  updatePersonalInfo: (field: string, value: string) => void;
  updateSummary: (s: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: any) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string) => void;
  removeEducation: (id: string) => void;
  updateHardSkills: (skills: string[]) => void;
  updateSoftSkills: (skills: string[]) => void;
  addProject: () => void;
  updateProject: (id: string, field: string, value: string) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, field: string, value: string) => void;
  removeCertification: (id: string) => void;
  addAchievement: () => void;
  updateAchievement: (id: string, description: string) => void;
  removeAchievement: (id: string) => void;
  onOpenSummaryAI: () => void;
}

export default function ResumeEditor({
  resume, updatePersonalInfo, updateSummary,
  addExperience, updateExperience, removeExperience,
  addEducation, updateEducation, removeEducation,
  updateHardSkills, updateSoftSkills,
  addProject, updateProject, removeProject,
  addCertification, updateCertification, removeCertification,
  addAchievement, updateAchievement, removeAchievement,
  onOpenSummaryAI,
}: ResumeEditorProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [hardSkillInput, setHardSkillInput] = useState("");
  const [softSkillInput, setSoftSkillInput] = useState("");
  const [improvingBullet, setImprovingBullet] = useState<string | null>(null);

  const toggle = (key: string) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));

  const handleAddHardSkill = () => {
    const trimmed = hardSkillInput.trim();
    if (trimmed && !resume.hardSkills.includes(trimmed)) {
      updateHardSkills([...resume.hardSkills, trimmed]);
      setHardSkillInput("");
    }
  };

  const handleAddSoftSkill = () => {
    const trimmed = softSkillInput.trim();
    if (trimmed && !resume.softSkills.includes(trimmed)) {
      updateSoftSkills([...resume.softSkills, trimmed]);
      setSoftSkillInput("");
    }
  };

  const improveBullet = async (expId: string, bulletIndex: number, text: string) => {
    if (!text || text.length < 5) return;
    const key = `${expId}-${bulletIndex}`;
    setImprovingBullet(key);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resume-ai`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            action: "improve_bullet",
            bullet: text,
            jobTitle: resume.experience.find(e => e.id === expId)?.title || "",
          }),
        }
      );
      if (!res.ok) throw new Error("AI request failed");
      const { result } = await res.json();
      const exp = resume.experience.find(e => e.id === expId);
      if (exp) {
        const newBullets = [...exp.bullets];
        newBullets[bulletIndex] = result.trim();
        updateExperience(expId, "bullets", newBullets);
        toast.success("Bullet point improved!");
      }
    } catch {
      toast.error("Failed to improve bullet point");
    } finally {
      setImprovingBullet(null);
    }
  };

  const SectionHeader = ({ title, icon: Icon, sectionKey, count }: { title: string; icon: any; sectionKey: string; count?: number }) => (
    <button
      onClick={() => toggle(sectionKey)}
      className="flex items-center justify-between w-full p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">{title}</span>
        {count !== undefined && <Badge variant="secondary" className="text-[10px] h-5">{count}</Badge>}
      </div>
      {collapsed[sectionKey] ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
    </button>
  );

  const anim = { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 } };

  return (
    <div className="space-y-4 pb-8">
      {/* Personal Info */}
      <Card className="border-0 shadow-sm bg-card">
        <SectionHeader title="Contact Information" icon={User} sectionKey="personal" />
        <AnimatePresence>
          {!collapsed["personal"] && (
            <motion.div {...anim} className="overflow-hidden">
              <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                  <Input placeholder="John Doe" value={resume.personalInfo.fullName} onChange={e => updatePersonalInfo("fullName", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Professional Email</Label>
                  <Input placeholder="firstname.lastname@email.com" value={resume.personalInfo.email} onChange={e => updatePersonalInfo("email", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone Number</Label>
                  <Input placeholder="+91 98765 43210" value={resume.personalInfo.phone} onChange={e => updatePersonalInfo("phone", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Location</Label>
                  <Input placeholder="Mumbai, India" value={resume.personalInfo.location} onChange={e => updatePersonalInfo("location", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">LinkedIn / GitHub</Label>
                  <Input placeholder="linkedin.com/in/johndoe" value={resume.personalInfo.linkedin} onChange={e => updatePersonalInfo("linkedin", e.target.value)} className="mt-1" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Portfolio / Website</Label>
                  <Input placeholder="johndoe.dev" value={resume.personalInfo.website} onChange={e => updatePersonalInfo("website", e.target.value)} className="mt-1" />
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Professional Objective / Summary */}
      <Card className="border-0 shadow-sm bg-card">
        <SectionHeader title="Professional Objective" icon={Sparkles} sectionKey="summary" />
        <AnimatePresence>
          {!collapsed["summary"] && (
            <motion.div {...anim} className="overflow-hidden">
              <CardContent className="pt-4 space-y-2">
                <p className="text-xs text-muted-foreground">A brief 2–3 sentence statement explaining your goals and how you can add value.</p>
                <Textarea
                  placeholder="Highly motivated B.Tech graduate in Computer Science seeking an entry-level Software Developer role..."
                  value={resume.summary}
                  onChange={e => updateSummary(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <Button variant="outline" size="sm" onClick={onOpenSummaryAI} className="gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Generate with AI
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Education */}
      <Card className="border-0 shadow-sm bg-card">
        <SectionHeader title="Education" icon={GraduationCap} sectionKey="education" count={resume.education.length} />
        <AnimatePresence>
          {!collapsed["education"] && (
            <motion.div {...anim} className="overflow-hidden">
              <CardContent className="pt-4 space-y-4">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="border rounded-xl p-3 space-y-2 bg-muted/20">
                    <div className="flex justify-between">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                        <Input placeholder="University / College" value={edu.school} onChange={e => updateEducation(edu.id, "school", e.target.value)} />
                        <Input placeholder="Degree (e.g. B.Tech, B.Com)" value={edu.degree} onChange={e => updateEducation(edu.id, "degree", e.target.value)} />
                        <Input placeholder="Field of Study" value={edu.field} onChange={e => updateEducation(edu.id, "field", e.target.value)} />
                        <Input placeholder="CGPA / Percentage" value={edu.gpa} onChange={e => updateEducation(edu.id, "gpa", e.target.value)} />
                        <Input type="month" value={edu.startDate} onChange={e => updateEducation(edu.id, "startDate", e.target.value)} />
                        <Input type="month" value={edu.endDate} onChange={e => updateEducation(edu.id, "endDate", e.target.value)} />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)} className="text-destructive shrink-0 ml-2">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addEducation} className="gap-1.5 w-full">
                  <Plus className="w-3.5 h-3.5" /> Add Education
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Skills — Hard & Soft */}
      <Card className="border-0 shadow-sm bg-card">
        <SectionHeader title="Skills" icon={Wrench} sectionKey="skills" count={resume.hardSkills.length + resume.softSkills.length} />
        <AnimatePresence>
          {!collapsed["skills"] && (
            <motion.div {...anim} className="overflow-hidden">
              <CardContent className="pt-4 space-y-4">
                {/* Hard Skills */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Hard Skills <span className="font-normal">(Python, Tally, SEO, etc.)</span></Label>
                  <div className="flex gap-2">
                    <Input placeholder="Add a hard skill..." value={hardSkillInput} onChange={e => setHardSkillInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddHardSkill())} className="flex-1" />
                    <Button variant="outline" size="sm" onClick={handleAddHardSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {resume.hardSkills.map(skill => (
                      <Badge key={skill} variant="secondary" className="cursor-pointer hover:bg-destructive/20 transition-colors gap-1"
                        onClick={() => updateHardSkills(resume.hardSkills.filter(s => s !== skill))}>
                        {skill} <span className="text-muted-foreground">×</span>
                      </Badge>
                    ))}
                  </div>
                </div>
                {/* Soft Skills */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Soft Skills <span className="font-normal">(Communication, Teamwork, etc.)</span></Label>
                  <div className="flex gap-2">
                    <Input placeholder="Add a soft skill..." value={softSkillInput} onChange={e => setSoftSkillInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddSoftSkill())} className="flex-1" />
                    <Button variant="outline" size="sm" onClick={handleAddSoftSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {resume.softSkills.map(skill => (
                      <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-destructive/20 transition-colors gap-1"
                        onClick={() => updateSoftSkills(resume.softSkills.filter(s => s !== skill))}>
                        {skill} <span className="text-muted-foreground">×</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Internships & Experience */}
      <Card className="border-0 shadow-sm bg-card">
        <SectionHeader title="Internships & Experience" icon={Briefcase} sectionKey="experience" count={resume.experience.length} />
        <AnimatePresence>
          {!collapsed["experience"] && (
            <motion.div {...anim} className="overflow-hidden">
              <CardContent className="pt-4 space-y-4">
                {resume.experience.map((exp) => (
                  <div key={exp.id} className="border rounded-xl p-3 space-y-3 bg-muted/20">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                        <Input placeholder="Role / Job Title" value={exp.title} onChange={e => updateExperience(exp.id, "title", e.target.value)} />
                        <Input placeholder="Company / Organization" value={exp.company} onChange={e => updateExperience(exp.id, "company", e.target.value)} />
                        <Input type="month" placeholder="Start" value={exp.startDate} onChange={e => updateExperience(exp.id, "startDate", e.target.value)} />
                        <Input type="month" placeholder="End" value={exp.endDate} onChange={e => updateExperience(exp.id, "endDate", e.target.value)} disabled={exp.current} />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)} className="text-destructive shrink-0 ml-2">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" checked={exp.current} onChange={e => updateExperience(exp.id, "current", e.target.checked)} className="rounded" />
                      Currently working here
                    </label>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Key Contributions</Label>
                      {exp.bullets.map((bullet, bi) => (
                        <div key={bi} className="flex gap-1.5 items-start">
                          <span className="text-muted-foreground mt-2.5 text-xs">•</span>
                          <Textarea
                            value={bullet}
                            onChange={e => {
                              const newBullets = [...exp.bullets];
                              newBullets[bi] = e.target.value;
                              updateExperience(exp.id, "bullets", newBullets);
                            }}
                            rows={1}
                            className="min-h-[36px] resize-none flex-1 text-sm"
                            placeholder="Describe your contribution..."
                          />
                          <Button
                            variant="ghost" size="icon"
                            className="shrink-0 text-primary h-8 w-8"
                            disabled={improvingBullet === `${exp.id}-${bi}`}
                            onClick={() => improveBullet(exp.id, bi, bullet)}
                            title="Improve with AI"
                          >
                            {improvingBullet === `${exp.id}-${bi}` ? (
                              <span className="animate-spin w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5" />
                            )}
                          </Button>
                          {exp.bullets.length > 1 && (
                            <Button variant="ghost" size="icon" className="shrink-0 text-destructive h-8 w-8"
                              onClick={() => {
                                const newBullets = exp.bullets.filter((_, i) => i !== bi);
                                updateExperience(exp.id, "bullets", newBullets);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" className="text-xs gap-1"
                        onClick={() => updateExperience(exp.id, "bullets", [...exp.bullets, ""])}
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addExperience} className="gap-1.5 w-full">
                  <Plus className="w-3.5 h-3.5" /> Add Internship / Experience
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Projects */}
      <Card className="border-0 shadow-sm bg-card">
        <SectionHeader title="Projects" icon={FolderKanban} sectionKey="projects" count={resume.projects.length} />
        <AnimatePresence>
          {!collapsed["projects"] && (
            <motion.div {...anim} className="overflow-hidden">
              <CardContent className="pt-4 space-y-4">
                {resume.projects.map((proj) => (
                  <div key={proj.id} className="border rounded-xl p-3 space-y-2 bg-muted/20">
                    <div className="flex justify-between">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                        <Input placeholder="Project Name" value={proj.name} onChange={e => updateProject(proj.id, "name", e.target.value)} />
                        <Input placeholder="Technologies Used" value={proj.technologies} onChange={e => updateProject(proj.id, "technologies", e.target.value)} />
                        <div className="sm:col-span-2">
                          <Textarea placeholder="Your specific contribution..." value={proj.description} onChange={e => updateProject(proj.id, "description", e.target.value)} rows={2} className="resize-none" />
                        </div>
                        <Input placeholder="Link (optional)" value={proj.link} onChange={e => updateProject(proj.id, "link", e.target.value)} className="sm:col-span-2" />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeProject(proj.id)} className="text-destructive shrink-0 ml-2">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addProject} className="gap-1.5 w-full">
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Certifications */}
      <Card className="border-0 shadow-sm bg-card">
        <SectionHeader title="Certifications" icon={Award} sectionKey="certifications" count={resume.certifications.length} />
        <AnimatePresence>
          {!collapsed["certifications"] && (
            <motion.div {...anim} className="overflow-hidden">
              <CardContent className="pt-4 space-y-4">
                {resume.certifications.map((cert) => (
                  <div key={cert.id} className="border rounded-xl p-3 space-y-2 bg-muted/20">
                    <div className="flex justify-between">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                        <Input placeholder="Certification Name (e.g. Google Data Analytics)" value={cert.name} onChange={e => updateCertification(cert.id, "name", e.target.value)} />
                        <Input placeholder="Issuing Organization" value={cert.issuer} onChange={e => updateCertification(cert.id, "issuer", e.target.value)} />
                        <Input type="month" placeholder="Date" value={cert.date} onChange={e => updateCertification(cert.id, "date", e.target.value)} />
                        <Input placeholder="Credential Link (optional)" value={cert.link} onChange={e => updateCertification(cert.id, "link", e.target.value)} />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeCertification(cert.id)} className="text-destructive shrink-0 ml-2">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addCertification} className="gap-1.5 w-full">
                  <Plus className="w-3.5 h-3.5" /> Add Certification
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Achievements */}
      <Card className="border-0 shadow-sm bg-card">
        <SectionHeader title="Achievements" icon={Trophy} sectionKey="achievements" count={resume.achievements.length} />
        <AnimatePresence>
          {!collapsed["achievements"] && (
            <motion.div {...anim} className="overflow-hidden">
              <CardContent className="pt-4 space-y-3">
                {resume.achievements.map((ach) => (
                  <div key={ach.id} className="flex gap-2 items-start">
                    <span className="text-muted-foreground mt-2.5 text-xs">★</span>
                    <Input
                      placeholder="Award, scholarship, or leadership role..."
                      value={ach.description}
                      onChange={e => updateAchievement(ach.id, e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeAchievement(ach.id)} className="text-destructive shrink-0 h-8 w-8">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addAchievement} className="gap-1.5 w-full">
                  <Plus className="w-3.5 h-3.5" /> Add Achievement
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
