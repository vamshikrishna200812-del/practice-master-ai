export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface Achievement {
  id: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  hardSkills: string[];
  softSkills: string[];
  skills: string[]; // legacy compat
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
}

export type TemplateStyle = "modern" | "professional" | "creative" | "minimal";

export const EMPTY_RESUME: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
  },
  summary: "",
  experience: [],
  education: [],
  hardSkills: [],
  softSkills: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
};
