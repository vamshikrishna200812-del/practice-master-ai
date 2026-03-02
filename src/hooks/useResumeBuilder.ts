import { useState, useEffect, useCallback } from "react";
import { ResumeData, TemplateStyle, EMPTY_RESUME } from "@/components/resume-builder/types";

const STORAGE_KEY = "aitrainingzone_resume_data";
const TEMPLATE_KEY = "aitrainingzone_resume_template";

export function useResumeBuilder() {
  const [resume, setResume] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migrate legacy data
        return {
          ...EMPTY_RESUME,
          ...parsed,
          hardSkills: parsed.hardSkills || [],
          softSkills: parsed.softSkills || [],
          skills: parsed.skills || [],
          certifications: parsed.certifications || [],
          achievements: parsed.achievements || [],
        };
      }
      return EMPTY_RESUME;
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

  // Experience
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

  // Education
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

  // Skills (hard/soft + legacy)
  const updateHardSkills = useCallback((hardSkills: string[]) => {
    setResume(prev => ({ ...prev, hardSkills, skills: [...hardSkills, ...prev.softSkills] }));
  }, []);

  const updateSoftSkills = useCallback((softSkills: string[]) => {
    setResume(prev => ({ ...prev, softSkills, skills: [...prev.hardSkills, ...softSkills] }));
  }, []);

  const updateSkills = useCallback((skills: string[]) => {
    setResume(prev => ({ ...prev, skills }));
  }, []);

  // Projects
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

  // Certifications
  const addCertification = useCallback(() => {
    setResume(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: crypto.randomUUID(), name: "", issuer: "", date: "", link: "" },
      ],
    }));
  }, []);

  const updateCertification = useCallback((id: string, field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, [field]: value } : c),
    }));
  }, []);

  const removeCertification = useCallback((id: string) => {
    setResume(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
  }, []);

  // Achievements
  const addAchievement = useCallback(() => {
    setResume(prev => ({
      ...prev,
      achievements: [
        ...prev.achievements,
        { id: crypto.randomUUID(), description: "" },
      ],
    }));
  }, []);

  const updateAchievement = useCallback((id: string, description: string) => {
    setResume(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => a.id === id ? { ...a, description } : a),
    }));
  }, []);

  const removeAchievement = useCallback((id: string) => {
    setResume(prev => ({ ...prev, achievements: prev.achievements.filter(a => a.id !== id) }));
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
    if (resume.summary && resume.summary.length > 30) score += 12;
    else if (resume.summary) score += 4;
    const expScore = Math.min(resume.experience.length * 6, 18);
    score += expScore;
    const bulletCount = resume.experience.reduce((sum, e) => sum + e.bullets.filter(b => b.length > 10).length, 0);
    score += Math.min(bulletCount * 2, 8);
    score += Math.min(resume.education.length * 5, 10);
    score += Math.min(resume.hardSkills.length, 5);
    score += Math.min(resume.softSkills.length, 4);
    score += Math.min(resume.projects.length * 3, 6);
    score += Math.min(resume.certifications.length * 3, 6);
    score += Math.min(resume.achievements.length * 2, 4);
    return Math.min(score, 100);
  }, [resume]);

  return {
    resume, template, setTemplate,
    updatePersonalInfo, updateSummary,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    updateSkills, updateHardSkills, updateSoftSkills,
    addProject, updateProject, removeProject,
    addCertification, updateCertification, removeCertification,
    addAchievement, updateAchievement, removeAchievement,
    resetResume, calculateScore,
  };
}
