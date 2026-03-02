import { ResumeData, TemplateStyle } from "./types";
import { cn } from "@/lib/utils";

interface ResumePreviewProps {
  resume: ResumeData;
  template: TemplateStyle;
}

const formatDate = (d: string) => {
  if (!d) return "";
  const [y, m] = d.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m) - 1] || ""} ${y}`;
};

export default function ResumePreview({ resume, template }: ResumePreviewProps) {
  const pi = resume.personalInfo;
  const hasContact = pi.email || pi.phone || pi.location || pi.linkedin || pi.website;

  const styles: Record<TemplateStyle, { wrapper: string; name: string; contactBar: string; sectionTitle: string; body: string; bulletColor: string }> = {
    modern: {
      wrapper: "font-sans",
      name: "text-2xl font-bold text-slate-800 tracking-tight",
      contactBar: "text-[10px] text-slate-500 flex flex-wrap gap-x-3 gap-y-0.5",
      sectionTitle: "text-[11px] font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-200 pb-0.5 mb-1.5",
      body: "text-[10.5px] text-slate-700 leading-[1.5]",
      bulletColor: "text-indigo-400",
    },
    professional: {
      wrapper: "font-serif",
      name: "text-2xl font-bold text-gray-900 tracking-tight",
      contactBar: "text-[10px] text-gray-600 flex flex-wrap gap-x-3 gap-y-0.5",
      sectionTitle: "text-[11px] font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-800 pb-0.5 mb-1.5",
      body: "text-[10.5px] text-gray-700 leading-[1.5]",
      bulletColor: "text-gray-500",
    },
    creative: {
      wrapper: "font-sans",
      name: "text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent",
      contactBar: "text-[10px] text-violet-400 flex flex-wrap gap-x-3 gap-y-0.5",
      sectionTitle: "text-[11px] font-bold text-violet-500 uppercase tracking-widest border-b border-violet-200 pb-0.5 mb-1.5",
      body: "text-[10.5px] text-slate-600 leading-[1.5]",
      bulletColor: "text-fuchsia-400",
    },
    minimal: {
      wrapper: "font-sans",
      name: "text-xl font-medium text-slate-900",
      contactBar: "text-[10px] text-slate-400 flex flex-wrap gap-x-3 gap-y-0.5",
      sectionTitle: "text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1.5",
      body: "text-[10.5px] text-slate-600 leading-[1.5]",
      bulletColor: "text-slate-300",
    },
  };

  const s = styles[template];

  return (
    <div className={cn("bg-white text-slate-800 p-8 w-full aspect-[8.5/11] overflow-hidden", s.wrapper)}
      style={{ fontSize: "10.5px", lineHeight: 1.5 }}>
      {/* Header */}
      <div className="mb-3">
        {pi.fullName && <h1 className={s.name}>{pi.fullName}</h1>}
        {hasContact && (
          <div className={cn(s.contactBar, "mt-1")}>
            {pi.email && <span>{pi.email}</span>}
            {pi.phone && <span>{pi.phone}</span>}
            {pi.location && <span>{pi.location}</span>}
            {pi.linkedin && <span>{pi.linkedin}</span>}
            {pi.website && <span>{pi.website}</span>}
          </div>
        )}
      </div>

      {/* Professional Objective */}
      {resume.summary && (
        <div className="mb-3">
          <h2 className={s.sectionTitle}>Professional Objective</h2>
          <p className={s.body}>{resume.summary}</p>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-3">
          <h2 className={s.sectionTitle}>Education</h2>
          {resume.education.map(edu => (
            <div key={edu.id} className="mb-1.5">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[11px]">
                  {edu.degree}{edu.field && ` in ${edu.field}`}{edu.school && ` — ${edu.school}`}
                </span>
                <span className="text-[9px] text-slate-400 shrink-0 ml-2">
                  {formatDate(edu.startDate)}{edu.startDate && " – "}{formatDate(edu.endDate)}
                </span>
              </div>
              {edu.gpa && <p className={cn(s.body, "text-[9.5px]")}>CGPA/Percentage: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(resume.hardSkills.length > 0 || resume.softSkills.length > 0) && (
        <div className="mb-3">
          <h2 className={s.sectionTitle}>Skills</h2>
          {resume.hardSkills.length > 0 && (
            <p className={s.body}><span className="font-semibold">Technical:</span> {resume.hardSkills.join(" • ")}</p>
          )}
          {resume.softSkills.length > 0 && (
            <p className={cn(s.body, "mt-0.5")}><span className="font-semibold">Soft Skills:</span> {resume.softSkills.join(" • ")}</p>
          )}
        </div>
      )}

      {/* Experience / Internships */}
      {resume.experience.length > 0 && (
        <div className="mb-3">
          <h2 className={s.sectionTitle}>Internships & Experience</h2>
          {resume.experience.map(exp => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[11px]">{exp.title}{exp.company && ` — ${exp.company}`}</span>
                <span className="text-[9px] text-slate-400 shrink-0 ml-2">
                  {formatDate(exp.startDate)}{exp.startDate && " – "}{exp.current ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <ul className="mt-0.5 space-y-0.5">
                {exp.bullets.filter(b => b).map((b, i) => (
                  <li key={i} className={cn(s.body, "flex gap-1.5")}>
                    <span className={s.bulletColor}>•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <div className="mb-3">
          <h2 className={s.sectionTitle}>Projects</h2>
          {resume.projects.map(p => (
            <div key={p.id} className="mb-1.5">
              <span className="font-semibold text-[11px]">{p.name}</span>
              {p.technologies && <span className="text-[9px] text-slate-400 ml-1.5">({p.technologies})</span>}
              {p.description && <p className={s.body}>{p.description}</p>}
              {p.link && <p className="text-[9px] text-indigo-500">{p.link}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="mb-3">
          <h2 className={s.sectionTitle}>Certifications</h2>
          {resume.certifications.map(cert => (
            <div key={cert.id} className="mb-1">
              <span className="font-semibold text-[11px]">{cert.name}</span>
              {cert.issuer && <span className="text-[9.5px] text-slate-500"> — {cert.issuer}</span>}
              {cert.date && <span className="text-[9px] text-slate-400 ml-1.5">{formatDate(cert.date)}</span>}
              {cert.link && <p className="text-[9px] text-indigo-500">{cert.link}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {resume.achievements.length > 0 && (
        <div className="mb-3">
          <h2 className={s.sectionTitle}>Achievements</h2>
          <ul className="space-y-0.5">
            {resume.achievements.filter(a => a.description).map(a => (
              <li key={a.id} className={cn(s.body, "flex gap-1.5")}>
                <span className={s.bulletColor}>★</span>
                <span>{a.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty state */}
      {!pi.fullName && !resume.summary && resume.experience.length === 0 && resume.education.length === 0 && (
        <div className="flex items-center justify-center h-full text-slate-300 text-sm">
          Start typing to see your resume preview
        </div>
      )}
    </div>
  );
}
