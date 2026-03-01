import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Video, VideoOff, MessageSquare, Hand, LogOut,
  Send, Volume2, VolumeX, Play, ChevronRight, Sparkles,
  Clock, Users, BookOpen, Download
} from "lucide-react";
import { HumanAvatar } from "@/components/interview/HumanAvatar";

interface ChatMessage {
  id: string;
  role: "student" | "instructor" | "system";
  content: string;
  timestamp: Date;
  userName?: string;
}

interface LessonPlan {
  title: string;
  sections: { heading: string; content: string; duration: number }[];
}

const TOPIC_LESSONS: Record<string, LessonPlan> = {
  "Technical Interview Prep": {
    title: "Technical Interview Prep",
    sections: [
      { heading: "Welcome & Overview", content: "Welcome to today's class on mastering technical interviews. We'll cover the key strategies that top candidates use to stand out. Technical interviews test not just your coding ability, but your problem-solving approach, communication skills, and ability to handle pressure.", duration: 2 },
      { heading: "Understanding the Format", content: "Technical interviews typically follow a structured format. You'll start with a brief introduction, then move into coding challenges or whiteboard problems. Most companies use a 45-minute format where you're expected to solve 1-2 problems. The interviewer evaluates your problem-solving process, code quality, communication, and ability to optimize. Companies like Google, Amazon, and Meta each have their own variation, but the core skills remain the same.", duration: 3 },
      { heading: "Problem-Solving Framework", content: "When facing a coding problem, never jump straight into code. First, understand the problem completely by asking clarifying questions about input constraints, edge cases, and expected output. Then work through examples by hand. Discuss your approach before coding, mentioning time and space complexity. Write clean, modular code and test with edge cases. If you're stuck, communicate your thought process — interviewers value problem-solving approach over getting the perfect answer immediately.", duration: 4 },
      { heading: "Common Patterns & Techniques", content: "Most technical interview problems fall into recognizable patterns. The key patterns include: Two Pointers for array problems, Sliding Window for subarray questions, BFS and DFS for graph traversal, Dynamic Programming for optimization, and Binary Search for sorted data. Recognizing which pattern applies to a problem is often the hardest part. Practice categorizing problems by pattern rather than by topic. This builds the pattern-matching intuition that top candidates develop.", duration: 4 },
      { heading: "Q&A and Wrap-up", content: "That concludes our main lesson on technical interviews. Remember, interview success comes from consistent practice and deliberate self-reflection. Aim to solve 2-3 problems daily, review your mistakes, and time yourself. Let's open the floor for any questions you might have.", duration: 2 },
    ]
  },
  "System Design Workshop": {
    title: "System Design Workshop",
    sections: [
      { heading: "Welcome to System Design", content: "Welcome to the System Design Workshop. System design interviews are increasingly important at senior engineering levels. Today we'll learn a structured framework for tackling any system design question, from URL shorteners to distributed messaging systems. The key is not memorizing solutions, but understanding fundamental trade-offs.", duration: 2 },
      { heading: "The Design Framework", content: "Always follow this structured approach: First, clarify requirements — ask about functional requirements, non-functional requirements like latency and availability, and scale estimates. Second, do back-of-envelope calculations to understand the scale. Third, define your API contracts. Fourth, design your data model. Fifth, draw a high-level architecture. Finally, deep dive into the most critical components. This framework shows interviewers you think systematically.", duration: 4 },
      { heading: "Scalability Principles", content: "Scalability is about handling growth gracefully. Horizontal scaling adds more machines, while vertical scaling adds more power to existing machines. Key techniques include: load balancing to distribute traffic, database sharding to partition data, caching with Redis or Memcached to reduce database load, CDNs for static content delivery, and message queues like Kafka for asynchronous processing. Understanding when to apply each technique is crucial.", duration: 4 },
      { heading: "Database Design & Trade-offs", content: "Choosing the right database is critical. SQL databases like PostgreSQL offer ACID compliance and complex queries. NoSQL databases like MongoDB offer flexibility and horizontal scaling. Consider the CAP theorem: you can only guarantee two of Consistency, Availability, and Partition tolerance. For read-heavy workloads, use read replicas. For write-heavy workloads, consider event sourcing. Always think about indexing strategies and query patterns.", duration: 3 },
      { heading: "Practice & Q&A", content: "Let's wrap up with key takeaways. In your system design interview, communicate constantly, justify your decisions, and acknowledge trade-offs. Practice designing systems like Twitter, Uber, Netflix, and WhatsApp. The goal isn't a perfect design — it's demonstrating your ability to reason about complex systems. Now let's open the floor for questions.", duration: 2 },
    ]
  },
  "Behavioral Interview Practice": {
    title: "Behavioral Interview Practice",
    sections: [
      { heading: "Why Behavioral Interviews Matter", content: "Welcome to Behavioral Interview Practice. Many candidates underestimate behavioral interviews, but they're often the deciding factor in hiring decisions. Companies like Amazon have 14 Leadership Principles that drive every behavioral question. Google evaluates 'Googleyness' — your ability to work in ambiguity, collaborate, and drive impact. Today we'll master the art of telling compelling professional stories.", duration: 2 },
      { heading: "The STAR Method Deep Dive", content: "The STAR method is your framework for every behavioral answer. Situation: Set the scene in 2-3 sentences — describe the context, your role, and the challenge. Task: Explain your specific responsibility, not just the team's goal. Action: This is the most important part — describe YOUR specific actions, decisions, and thought process. Use 'I' not 'we'. Result: Quantify the outcome with metrics. Instead of 'it went well,' say 'reduced latency by 40%, serving 2M additional daily users.'", duration: 3 },
      { heading: "Common Question Categories", content: "Behavioral questions typically fall into these categories: Leadership and influence — 'Tell me about a time you led a project.' Conflict resolution — 'Describe a disagreement with a colleague.' Failure and learning — 'Tell me about a time you failed.' Innovation — 'Describe when you came up with a creative solution.' Teamwork — 'How do you handle working with difficult team members?' Prepare 6-8 strong stories that can be adapted across these categories.", duration: 4 },
      { heading: "Crafting Your Story Bank", content: "Build a personal story bank of 8-10 professional experiences. Each story should demonstrate multiple competencies. A great story about debugging a production outage can show leadership, technical depth, communication under pressure, and customer focus. Write each story in STAR format, practice delivering it in 2-3 minutes, and prepare follow-up details. The best candidates can pivot a story to answer different questions while keeping it authentic and specific.", duration: 3 },
      { heading: "Practice Session & Q&A", content: "Remember these golden rules: Be specific, not generic. Use metrics and data. Show self-awareness and growth. Never speak negatively about former employers or colleagues. Practice recording yourself answering questions — review for filler words, pacing, and confidence. Let's now open the floor for any questions about behavioral interviews.", duration: 2 },
    ]
  },
  "Data Structures & Algorithms": {
    title: "Data Structures & Algorithms",
    sections: [
      { heading: "Foundations of DSA", content: "Welcome to Data Structures & Algorithms. DSA is the backbone of technical interviews at top companies. Today we'll cover the essential data structures and algorithmic patterns you need to know. Understanding time and space complexity using Big-O notation is fundamental — it helps you analyze and compare solutions efficiently.", duration: 2 },
      { heading: "Essential Data Structures", content: "Master these core data structures: Arrays and Strings for sequential data with O(1) access. Hash Maps for O(1) average lookups — used in nearly 40% of interview problems. Linked Lists for dynamic memory allocation. Stacks and Queues for LIFO/FIFO processing. Trees, especially Binary Search Trees, for hierarchical data with O(log n) operations. Graphs for relationship modeling. Heaps for priority-based access. Understanding when to use each structure is more important than memorizing implementations.", duration: 4 },
      { heading: "Key Algorithm Patterns", content: "Most interview problems use these patterns: Two Pointers — for sorted array problems like container with most water. Sliding Window — for subarray/substring problems like longest substring without repeating characters. Binary Search — not just for sorted arrays, but for search spaces. BFS and DFS — for tree and graph traversal. Dynamic Programming — for optimization problems with overlapping subproblems. Backtracking — for combinatorial problems like permutations. Learn to recognize which pattern applies by analyzing problem constraints.", duration: 4 },
      { heading: "Solving Problems Efficiently", content: "Follow this approach for every problem: Read carefully and identify constraints. Start with a brute-force solution to understand the problem. Identify bottlenecks in your brute-force approach. Apply the right pattern or data structure to optimize. Always analyze time and space complexity before and after optimization. Test with edge cases: empty inputs, single elements, duplicates, and large inputs. Common optimizations include trading space for time using hash maps, or using sorting to enable binary search.", duration: 3 },
      { heading: "Practice Plan & Q&A", content: "To prepare effectively, follow the 'deliberate practice' method: solve 3-5 problems daily, categorized by pattern. After solving, study the optimal solution and understand why it works. Use spaced repetition — revisit problems you struggled with after 3 days, then 7 days. Target 150-200 problems across all patterns before your interviews. Quality over quantity — deeply understanding 100 problems beats superficially solving 500. Let's take your questions.", duration: 2 },
    ]
  },
  "Communication Skills": {
    title: "Communication Skills for Interviews",
    sections: [
      { heading: "Why Communication Matters", content: "Welcome to Communication Skills for Interviews. Studies show that communication ability is the number one differentiator between candidates with similar technical skills. In fact, Google's hiring research found that candidates who 'think aloud' score 30% higher than equally skilled but quieter candidates. Today we'll master the art of professional communication in interview settings.", duration: 2 },
      { heading: "Structuring Your Thoughts", content: "The biggest communication mistake is rambling. Use structured frameworks to organize your thoughts. For technical explanations, use the 'Problem → Approach → Solution → Result' framework. For answering open-ended questions, use 'Context → Action → Impact.' When explaining complex concepts, start with the high-level overview, then drill into details only when asked. Practice the 'one-minute rule' — if your answer exceeds one minute without pausing, you're likely losing the interviewer's attention.", duration: 3 },
      { heading: "Active Listening & Clarification", content: "Great communicators are first great listeners. In interviews, listen to the entire question before responding. Repeat key requirements back to the interviewer to confirm understanding. Ask smart clarifying questions that show depth of thinking — for example, 'Should I optimize for read performance or write performance?' This demonstrates both comprehension and expertise. Avoid the trap of assuming you know what's being asked; many candidates fail by solving the wrong problem.", duration: 3 },
      { heading: "Body Language & Presence", content: "Non-verbal communication accounts for over 50% of your message. Maintain natural eye contact — look at the interviewer when speaking, and at your work when coding. Sit upright with open body language. Use hand gestures naturally when explaining concepts. Manage nervous habits like fidgeting, excessive 'um/ah,' or touching your face. In virtual interviews, position your camera at eye level, ensure good lighting, and look at the camera (not the screen) when speaking to create eye contact.", duration: 3 },
      { heading: "Practice & Q&A", content: "To improve your communication: Record yourself answering practice questions and watch for filler words, pacing, and clarity. Practice explaining technical concepts to non-technical friends or family. Join mock interview platforms where you get real-time feedback. Remember, communication is a skill — it improves with deliberate practice. Let's take your questions now.", duration: 2 },
    ]
  },
  "Resume Review Session": {
    title: "Resume Review & Optimization",
    sections: [
      { heading: "Resume Fundamentals", content: "Welcome to the Resume Review Session. Your resume is your first impression — recruiters spend an average of 7.4 seconds on initial screening. Today we'll learn how to make every word count. A great resume is concise (1-2 pages), results-oriented, and tailored to each application. It should tell a story of progression and impact, not just list responsibilities.", duration: 2 },
      { heading: "Writing Impact Statements", content: "Transform your bullet points from responsibilities to achievements. Use the formula: Action Verb + What You Did + Quantified Result. Bad example: 'Responsible for backend development.' Good example: 'Architected microservices migration, reducing deployment time by 60% and enabling 3x faster feature releases across 12 engineering teams.' Always include numbers — percentage improvements, dollar amounts, user counts, or time savings. If you don't have exact numbers, use reasonable estimates with qualifiers like 'approximately.'", duration: 3 },
      { heading: "ATS Optimization", content: "90% of large companies use Applicant Tracking Systems (ATS) to filter resumes before a human sees them. To pass ATS screening: Use standard section headings like 'Experience,' 'Education,' 'Skills.' Avoid tables, graphics, or unusual formatting. Include keywords from the job description naturally in your bullet points. Use standard fonts and file formats (PDF is safest). Match your skills section to the technologies listed in the job posting. Many qualified candidates are rejected simply because their resume isn't ATS-friendly.", duration: 4 },
      { heading: "Tailoring for Each Role", content: "One-size-fits-all resumes don't work. For each application, analyze the job description for key requirements and priorities. Reorder your bullet points to highlight the most relevant experience first. Adjust your skills section to match the role's tech stack. If the role emphasizes leadership, move leadership examples higher. If it emphasizes technical depth, lead with your most impressive technical achievements. Keep a master resume with all experiences, and create targeted versions for each application.", duration: 3 },
      { heading: "Common Mistakes & Q&A", content: "Avoid these common mistakes: Typos and grammatical errors — have someone proofread. Vague descriptions without metrics. Including irrelevant experience from 10+ years ago. Using an objective statement instead of a professional summary. Listing every technology you've ever touched rather than focusing on strengths. Missing contact information or LinkedIn profile. Remember, your resume gets you the interview — your skills get you the job. Let's take your questions.", duration: 2 },
    ]
  },
};

const DEFAULT_LESSON: LessonPlan = TOPIC_LESSONS["Technical Interview Prep"];

function getLessonForTitle(title: string): LessonPlan {
  // Try to match the class title to a topic-specific lesson
  for (const [topic, lesson] of Object.entries(TOPIC_LESSONS)) {
    if (title.toLowerCase().includes(topic.toLowerCase())) {
      return lesson;
    }
  }
  // Fuzzy match keywords
  const titleLower = title.toLowerCase();
  if (titleLower.includes("system design")) return TOPIC_LESSONS["System Design Workshop"];
  if (titleLower.includes("behavioral")) return TOPIC_LESSONS["Behavioral Interview Practice"];
  if (titleLower.includes("data structure") || titleLower.includes("algorithm") || titleLower.includes("dsa")) return TOPIC_LESSONS["Data Structures & Algorithms"];
  if (titleLower.includes("communication")) return TOPIC_LESSONS["Communication Skills"];
  if (titleLower.includes("resume")) return TOPIC_LESSONS["Resume Review Session"];
  if (titleLower.includes("technical")) return TOPIC_LESSONS["Technical Interview Prep"];
  return DEFAULT_LESSON;
}

const Classroom = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const classId = searchParams.get("id");

  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [handRaised, setHandRaised] = useState(false);
  const [classTitle, setClassTitle] = useState<string | null>(null);
  const [isLoadingClass, setIsLoadingClass] = useState(!!classId);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Lesson — loaded dynamically based on scheduled class topic
  const [lesson, setLesson] = useState<LessonPlan>(DEFAULT_LESSON);

  // Load class info from database if classId provided
  useEffect(() => {
    if (!classId) {
      setIsLoadingClass(false);
      return;
    }
    const loadClass = async () => {
      try {
        const { data, error } = await supabase
          .from("class_schedules")
          .select("title, description")
          .eq("id", classId)
          .single();
        if (error) throw error;
        if (data) {
          setClassTitle(data.title);
          const matchedLesson = getLessonForTitle(data.title);
          setLesson(matchedLesson);
        }
      } catch {
        console.error("Failed to load class info");
      } finally {
        setIsLoadingClass(false);
      }
    };
    loadClass();
  }, [classId]);
  const [displayedText, setDisplayedText] = useState("");
  const [sessionSummary, setSessionSummary] = useState<string | null>(null);

  // Avatar/TTS
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Video
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Timer
  useEffect(() => {
    if (!isSessionActive || isPaused || isSessionEnded) return;
    const interval = setInterval(() => setElapsedTime(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [isSessionActive, isPaused, isSessionEnded]);

  // Chat auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      toast.error("Camera access denied");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  // TTS
  const speakText = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (isMuted) { resolve(); return; }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => /female|zira|samantha|jenny|karen/i.test(v.name))
        || voices.find(v => v.lang.startsWith("en"));
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utteranceRef.current = utterance;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => { setIsSpeaking(false); resolve(); };
      utterance.onerror = () => { setIsSpeaking(false); resolve(); };
      window.speechSynthesis.speak(utterance);
    });
  }, [isMuted]);

  // Use browser TTS directly (D-ID API key is invalid)
  const tryDIDAvatarOrTTS = useCallback(async (text: string) => {
    await speakText(text);
  }, [speakText]);

  // Typewriter effect for displayed text
  const typeText = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      let i = 0;
      setDisplayedText("");
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 25);
    });
  }, []);

  // Start session
  const startSession = async () => {
    setIsSessionActive(true);
    await startCamera();
    setChatMessages([{
      id: "system-start",
      role: "system",
      content: `📚 Class "${lesson.title}" has started. Welcome!`,
      timestamp: new Date()
    }]);
    // Mark class as in_progress in DB
    if (classId) {
      supabase.from("class_schedules").update({ status: "in_progress" as const }).eq("id", classId).then();
    }
    teachSection(0);
  };

  // Teach a section
  const teachSection = async (index: number) => {
    if (index >= lesson.sections.length) {
      endSession();
      return;
    }
    setCurrentSectionIndex(index);
    const section = lesson.sections[index];

    setChatMessages(prev => [...prev, {
      id: `section-${index}`,
      role: "instructor",
      content: `📖 **${section.heading}**`,
      timestamp: new Date()
    }]);

    // Speak and type simultaneously
    await Promise.all([
      tryDIDAvatarOrTTS(section.content),
      typeText(section.content)
    ]);

    // Brief pause between sections
    await new Promise(r => setTimeout(r, 2000));

    // Auto-advance if not paused
    if (!isPaused) {
      teachSection(index + 1);
    }
  };

  // End session
  const endSession = async () => {
    setIsSessionEnded(true);
    setIsSpeaking(false);
    window.speechSynthesis.cancel();
    stopCamera();
    // Mark class as completed in DB
    if (classId) {
      supabase.from("class_schedules").update({ status: "completed" as const }).eq("id", classId).then();
    }

    setChatMessages(prev => [...prev, {
      id: "system-end",
      role: "system",
      content: "🎓 Class has ended! Generating summary...",
      timestamp: new Date()
    }]);

    // Generate summary via AI
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/classroom-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          action: "generate_summary",
          lessonTitle: lesson.title,
          sections: lesson.sections.map(s => s.heading),
          chatHistory: chatMessages.filter(m => m.role !== "system").map(m => m.content).join("\n"),
          duration: elapsedTime
        }),
      });

      if (res.ok) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let summary = "";
        if (reader) {
          let done = false;
          while (!done) {
            const { value, done: d } = await reader.read();
            done = d;
            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split("\n");
              for (const line of lines) {
                if (line.startsWith("data: ") && line.slice(6).trim() !== "[DONE]") {
                  try {
                    const parsed = JSON.parse(line.slice(6));
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) summary += content;
                  } catch { /* skip */ }
                }
              }
            }
          }
        }
        setSessionSummary(summary || "Class completed successfully!");
      }
    } catch {
      setSessionSummary("Class completed successfully. Great session!");
    }

    // Create notification
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from("notifications").insert({
          user_id: session.user.id,
          title: "Class Completed! 🎓",
          message: `You completed "${lesson.title}". +50 points earned!`,
          type: "class_complete",
          link: "/courses"
        });
      }
    } catch { /* ignore */ }

    toast.success("Class completed! Summary generated.");
  };

  // Handle Q&A
  const handleSendChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const question = chatInput.trim();
    setChatInput("");

    setChatMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      role: "student",
      content: question,
      timestamp: new Date(),
      userName: "You"
    }]);

    setIsChatLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/classroom-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          action: "answer_question",
          question,
          lessonContext: lesson.sections.map(s => `${s.heading}: ${s.content}`).join("\n"),
          currentTopic: lesson.sections[currentSectionIndex]?.heading || lesson.title
        }),
      });

      if (!res.ok) throw new Error("Failed");

      let answer = "";
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        const msgId = `ai-${Date.now()}`;
        setChatMessages(prev => [...prev, { id: msgId, role: "instructor", content: "", timestamp: new Date() }]);
        let done = false;
        while (!done) {
          const { value, done: d } = await reader.read();
          done = d;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ") && line.slice(6).trim() !== "[DONE]") {
                try {
                  const parsed = JSON.parse(line.slice(6));
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    answer += content;
                    setChatMessages(prev => prev.map(m =>
                      m.id === msgId ? { ...m, content: answer } : m
                    ));
                  }
                } catch { /* skip */ }
              }
            }
          }
        }
      }
    } catch {
      setChatMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: "instructor",
        content: "I apologize, I'm having trouble answering that right now. Please try again.",
        timestamp: new Date()
      }]);
    }
    setIsChatLoading(false);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = lesson.sections.length > 0
    ? ((currentSectionIndex + (isSessionEnded ? 1 : 0)) / lesson.sections.length) * 100
    : 0;

  // Pre-session lobby
  if (!isSessionActive) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white flex items-center justify-center">
        {isLoadingClass ? (
          <div className="text-white/60 text-lg">Loading class info...</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full mx-4 text-center space-y-8"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
              {classTitle && (
                <p className="text-indigo-400 text-sm mb-1">{classTitle}</p>
              )}
              <p className="text-white/60">AI-powered interactive classroom session</p>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-white/50">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> ~{lesson.sections.reduce((a, s) => a + s.duration, 0)} min</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {lesson.sections.length} sections</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Live Q&A</span>
            </div>
            <Button
              onClick={startSession}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-10 py-6 text-lg rounded-xl"
            >
              <Play className="w-5 h-5 mr-2" /> Enter Classroom
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)} className="text-white/40 hover:text-white/70">
              ← Back to Schedule
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a1a] text-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 border-b border-white/10 bg-[#0d0d20]/90 backdrop-blur flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-indigo-500/50 text-indigo-400 bg-indigo-500/10">
            {isSessionEnded ? "Ended" : isSpeaking ? "🔴 LIVE" : "Active"}
          </Badge>
          <h2 className="text-sm font-medium truncate max-w-[200px] md:max-w-none">{lesson.title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50 font-mono">{formatTime(elapsedTime)}</span>
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs text-white/40">
              {currentSectionIndex + 1}/{lesson.sections.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Theater Stage */}
        <div className="flex-1 flex flex-col relative">
          {/* Avatar Area */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 via-transparent to-purple-900/10" />

            <motion.div
              className="relative z-10"
              animate={{ scale: isSpeaking ? 1.02 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {avatarVideoUrl ? (
                <video
                  src={avatarVideoUrl}
                  autoPlay
                  onEnded={() => { setAvatarVideoUrl(null); setIsSpeaking(false); }}
                  className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl shadow-indigo-500/20"
                />
              ) : (
                <div className="w-64 h-64 md:w-80 md:h-80">
                  <HumanAvatar
                    isSpeaking={isSpeaking}
                    isLoading={isAvatarLoading}
                  />
                </div>
              )}

              {/* Speaking indicator */}
              <AnimatePresence>
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-indigo-400 rounded-full"
                        animate={{ height: [8, 20 + Math.random() * 16, 8] }}
                        transition={{ duration: 0.5 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Lesson text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <AnimatePresence mode="wait">
                {displayedText && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-2xl mx-auto bg-black/60 backdrop-blur-lg rounded-xl p-4 border border-white/10"
                  >
                    <p className="text-sm md:text-base text-white/90 leading-relaxed">{displayedText}</p>
                    <p className="text-xs text-indigo-400 mt-2 font-medium">
                      {lesson.sections[currentSectionIndex]?.heading}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Student video PIP */}
            <div className="absolute top-4 right-4 w-32 h-24 md:w-40 md:h-30 rounded-lg overflow-hidden border border-white/20 bg-black/50 shadow-xl">
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              {!isCameraOn && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <VideoOff className="w-6 h-6 text-white/40" />
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="h-16 border-t border-white/10 bg-[#0d0d20]/90 flex items-center justify-center gap-3 px-4 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full w-10 h-10 ${isMicOn ? "bg-indigo-600 hover:bg-indigo-500" : "bg-white/10 hover:bg-white/20"}`}
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full w-10 h-10 ${isCameraOn ? "bg-indigo-600 hover:bg-indigo-500" : "bg-white/10 hover:bg-white/20"}`}
              onClick={() => setIsCameraOn(!isCameraOn)}
            >
              {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full w-10 h-10 ${isMuted ? "bg-red-600/50 hover:bg-red-600/70" : "bg-white/10 hover:bg-white/20"}`}
              onClick={() => {
                setIsMuted(!isMuted);
                if (!isMuted) window.speechSynthesis.cancel();
              }}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full w-10 h-10 ${handRaised ? "bg-yellow-500 hover:bg-yellow-400" : "bg-white/10 hover:bg-white/20"}`}
              onClick={() => {
                setHandRaised(!handRaised);
                toast(handRaised ? "Hand lowered" : "✋ Hand raised! Type your question in the chat.");
              }}
            >
              <Hand className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-white/20 mx-1" />

            {!isSessionEnded && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-10 h-10 bg-white/10 hover:bg-white/20"
                onClick={() => {
                  if (currentSectionIndex < lesson.sections.length - 1) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                    teachSection(currentSectionIndex + 1);
                  }
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            <Button
              onClick={() => isSessionEnded ? navigate("/schedule") : endSession()}
              className="rounded-full bg-red-600 hover:bg-red-500 text-white px-4 h-10 text-sm"
            >
              <LogOut className="w-4 h-4 mr-1" />
              {isSessionEnded ? "Exit" : "End Class"}
            </Button>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 lg:w-96 border-l border-white/10 bg-[#0d0d20]/80 flex flex-col hidden md:flex">
          <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 shrink-0">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium">Live Chat & Q&A</span>
            <Sparkles className="w-3 h-3 text-indigo-400 ml-auto" />
          </div>

          {/* Session summary */}
          <AnimatePresence>
            {isSessionEnded && sessionSummary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="border-b border-white/10 p-4 bg-indigo-500/10"
              >
                <h3 className="text-sm font-bold text-indigo-400 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Session Summary
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">{sessionSummary}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 text-xs border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                  onClick={() => {
                    const blob = new Blob([sessionSummary], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${lesson.title}-summary.txt`;
                    a.click();
                  }}
                >
                  <Download className="w-3 h-3 mr-1" /> Download Summary
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {chatMessages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm ${
                    msg.role === "system"
                      ? "text-center text-white/40 text-xs py-2"
                      : msg.role === "student"
                      ? "text-right"
                      : ""
                  }`}
                >
                  {msg.role === "system" ? (
                    <span>{msg.content}</span>
                  ) : (
                    <div className={`inline-block max-w-[85%] ${msg.role === "student" ? "ml-auto" : ""}`}>
                      <span className={`text-xs font-medium mb-1 block ${
                        msg.role === "instructor" ? "text-indigo-400" : "text-emerald-400"
                      }`}>
                        {msg.role === "instructor" ? "AI Instructor" : msg.userName || "You"}
                      </span>
                      <div className={`rounded-lg px-3 py-2 ${
                        msg.role === "student"
                          ? "bg-indigo-600/30 border border-indigo-500/20"
                          : "bg-white/5 border border-white/10"
                      }`}>
                        <p className="text-white/85 text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              {isChatLoading && (
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <motion.div className="flex gap-1" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  </motion.div>
                  <span>AI is thinking...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="border-t border-white/10 p-3 shrink-0">
            <form onSubmit={e => { e.preventDefault(); handleSendChat(); }} className="flex gap-2">
              <Input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm"
                disabled={isSessionEnded}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!chatInput.trim() || isChatLoading || isSessionEnded}
                className="bg-indigo-600 hover:bg-indigo-500 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
