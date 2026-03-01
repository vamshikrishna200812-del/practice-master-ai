import { useState, useEffect, useCallback } from "react";
import { ResumeData, TemplateStyle, EMPTY_RESUME } from "@/components/resume-builder/types";

const STORAGE_KEY = "aitrainingzone_resume_data";
const TEMPLATE_KEY = "aitrainingzone_resume_template";

export function useResumeBuilder() {
  const [resume, setResume] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : EMPTY_RESUME;
    } catch {
      return EMPTY_RESUME;
    }
  });

  const [template, setTemplate] = useState<TemplateStyle>(() => {
    return (localStorage.getItem(TEMPLATE_KEY) as TemplateStyle) || "modern";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
  }, [resume]);

  useEffect(() => {
    localStorage.setItem(TEMPLATE_KEY, template);
  }, [template]);

  const updatePersonalInfo = useCallback((field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setResume(prev => ({ ...prev, summary }));
  }, []);

  const addExperience = useCallback(() => {
    setResume(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: crypto.randomUUID(), company: "", title: "", startDate: "", endDate: "", current: false, bullets: [""] },
      ],
    }));
  }, []);

  const updateExperience = useCallback((id: string, field: string, value: any) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setResume(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  }, []);

  const addEducation = useCallback(() => {
    setResume(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id: crypto.randomUUID(), school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" },
      ],
    }));
  }, []);

  const updateEducation = useCallback((id: string, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setResume(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  }, []);

  const updateSkills = useCallback((skills: string[]) => {
    setResume(prev => ({ ...prev, skills }));
  }, []);

  const addProject = useCallback(() => {
    setResume(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: crypto.randomUUID(), name: "", description: "", technologies: "", link: "" },
      ],
    }));
  }, []);

  const updateProject = useCallback((id: string, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setResume(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  }, []);

  const resetResume = useCallback(() => {
    setResume(EMPTY_RESUME);
    setTemplate("modern");
  }, []);

  // Resume strength score
  const calculateScore = useCallback((): number => {
    let score = 0;
    const pi = resume.personalInfo;
    if (pi.fullName) score += 8;
    if (pi.email) score += 7;
    if (pi.phone) score += 5;
    if (pi.location) score += 5;
    if (pi.linkedin) score += 5;
    if (resume.summary && resume.summary.length > 30) score += 15;
    else if (resume.summary) score += 5;
    // Experience
    const expScore = Math.min(resume.experience.length * 8, 24);
    score += expScore;
    const bulletCount = resume.experience.reduce((sum, e) => sum + e.bullets.filter(b => b.length > 10).length, 0);
    score += Math.min(bulletCount * 3, 12);
    // Education
    score += Math.min(resume.education.length * 6, 12);
    // Skills
    score += Math.min(resume.skills.length, 7);
    return Math.min(score, 100);
  }, [resume]);

  return {
    resume, template, setTemplate,
    updatePersonalInfo, updateSummary,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    updateSkills,
    addProject, updateProject, removeProject,
    resetResume, calculateScore,
  };
}
