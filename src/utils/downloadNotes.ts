/**
 * Utility to generate and download course notes as text files
 */

export const downloadAsTextFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadAsMarkdown = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".md") ? filename : `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateLessonNotes = (
  courseTitle: string,
  lessonTitle: string,
  keyTakeaways: string[],
  description: string,
  noteContent: string
): string => {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `# ${courseTitle}
## ${lessonTitle}

📅 Downloaded: ${date}
🎓 Platform: AITRAININGZONE

---

### About This Lesson
${description}

---

### Key Takeaways
${keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join("\n")}

---

### Detailed Notes

${noteContent}

---

### Quick Reference Card

${keyTakeaways.map((t) => `✅ ${t}`).join("\n")}

---

*These notes were generated from AITRAININGZONE course materials.*
*For the full learning experience, watch the video lessons and complete the assessments.*
`;
};
