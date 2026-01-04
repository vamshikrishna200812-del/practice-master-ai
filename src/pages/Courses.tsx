import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BentoGrid } from "@/components/ui/bento-grid";
import { Skeleton } from "@/components/ui/skeleton-loaders";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  PlayCircle, 
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
  Target,
  Users,
  Lightbulb,
  Code,
  MessageSquare,
  Layers,
  Mic,
  Video,
  FileText,
  RotateCcw,
  Play,
  ChevronRight
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  duration_minutes: number;
  topics: string[];
  is_published: boolean;
}

interface Enrollment {
  id: string;
  course_id: string;
  progress: number;
  completed: boolean;
}

interface VideoLesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  hasQuiz: boolean;
  hasExercise: boolean;
  keyTakeaways: string[];
  resources: { title: string; type: string }[];
}

// Enhanced course curriculum with video content
const courseCurriculum: Record<string, VideoLesson[]> = {
  "Mastering Technical Interviews": [
    { 
      id: "1", 
      title: "Introduction to Technical Interviews", 
      description: "Understanding what companies look for in technical candidates and how to prepare mentally for the interview process.", 
      duration: 15, 
      videoUrl: "https://www.youtube.com/embed/1qw5ITr3k9E",
      hasQuiz: true,
      hasExercise: false,
      keyTakeaways: [
        "Understand the typical interview stages at top tech companies",
        "Learn what interviewers are really evaluating",
        "Build the right mindset for technical assessments"
      ],
      resources: [
        { title: "Interview Preparation Checklist", type: "pdf" },
        { title: "Company Research Template", type: "doc" }
      ]
    },
    { 
      id: "2", 
      title: "Big O Notation & Complexity Analysis", 
      description: "Master time and space complexity for algorithm optimization. Learn to analyze and compare algorithm efficiency.", 
      duration: 20,
      videoUrl: "https://www.youtube.com/embed/D6xkbGLQesk",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Understand O(1), O(n), O(log n), O(n²) complexities",
        "Analyze nested loops and recursive functions",
        "Identify optimization opportunities in code"
      ],
      resources: [
        { title: "Big O Cheat Sheet", type: "pdf" },
        { title: "Practice Problems", type: "code" }
      ]
    },
    { 
      id: "3", 
      title: "Arrays & Strings Deep Dive", 
      description: "Common patterns and techniques for array manipulation including two pointers, sliding window, and prefix sums.", 
      duration: 25,
      videoUrl: "https://www.youtube.com/embed/0IAPZzGSbME",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Master the two-pointer technique",
        "Apply sliding window for optimization",
        "Use hash maps for O(1) lookups"
      ],
      resources: [
        { title: "Array Patterns Guide", type: "pdf" },
        { title: "LeetCode Problem Set", type: "link" }
      ]
    },
    { 
      id: "4", 
      title: "Linked Lists & Two Pointers", 
      description: "Solving problems with linked list traversal techniques including fast/slow pointers and reversal.", 
      duration: 20,
      videoUrl: "https://www.youtube.com/embed/Hj_rA0dhr2I",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Detect cycles with Floyd's algorithm",
        "Reverse linked lists iteratively and recursively",
        "Find middle elements efficiently"
      ],
      resources: [
        { title: "Linked List Patterns", type: "pdf" }
      ]
    },
    { 
      id: "5", 
      title: "Trees & Graph Traversal", 
      description: "BFS, DFS, and tree-based problem solving including binary search trees and balanced trees.", 
      duration: 25,
      videoUrl: "https://www.youtube.com/embed/PMMc4VsIacU",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Implement BFS and DFS traversals",
        "Solve tree recursion problems",
        "Handle graph connectivity problems"
      ],
      resources: [
        { title: "Tree Traversal Visualizer", type: "interactive" },
        { title: "Graph Problems Collection", type: "code" }
      ]
    },
    { 
      id: "6", 
      title: "Dynamic Programming Essentials", 
      description: "Breaking down complex problems into subproblems. Learn memoization and tabulation techniques.", 
      duration: 30,
      videoUrl: "https://www.youtube.com/embed/oBt53YbR9Kk",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Identify overlapping subproblems",
        "Choose between memoization and tabulation",
        "Solve classic DP problems step by step"
      ],
      resources: [
        { title: "DP Patterns Guide", type: "pdf" },
        { title: "Top 20 DP Problems", type: "code" }
      ]
    },
    { 
      id: "7", 
      title: "Mock Interview Practice", 
      description: "Simulated technical interview with real-time feedback. Practice explaining your thought process.", 
      duration: 45,
      videoUrl: "https://www.youtube.com/embed/XKu_SEDAykw",
      hasQuiz: false,
      hasExercise: true,
      keyTakeaways: [
        "Practice thinking out loud",
        "Handle follow-up questions gracefully",
        "Manage time during the interview"
      ],
      resources: [
        { title: "Mock Interview Recording", type: "video" },
        { title: "Self-Assessment Form", type: "pdf" }
      ]
    },
  ],
  "Behavioral Interview Excellence": [
    { 
      id: "1", 
      title: "Understanding Behavioral Interviews", 
      description: "Why companies value behavioral assessments and what they reveal about candidates.", 
      duration: 10,
      videoUrl: "https://www.youtube.com/embed/PJKYqLP6MRE",
      hasQuiz: true,
      hasExercise: false,
      keyTakeaways: [
        "Understand why behavioral questions matter",
        "Learn what interviewers are evaluating",
        "Prepare your mindset for storytelling"
      ],
      resources: [
        { title: "Competency Framework", type: "pdf" }
      ]
    },
    { 
      id: "2", 
      title: "The STAR Method Framework", 
      description: "Structuring your responses for maximum impact using Situation, Task, Action, Result.", 
      duration: 15,
      videoUrl: "https://www.youtube.com/embed/k1kZ9hrU-S8",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Structure answers with STAR format",
        "Quantify your results whenever possible",
        "Keep responses concise yet impactful"
      ],
      resources: [
        { title: "STAR Story Templates", type: "pdf" },
        { title: "Sample STAR Stories", type: "doc" }
      ]
    },
    { 
      id: "3", 
      title: "Crafting Leadership Stories", 
      description: "Showcase times you led teams or initiatives, even without a leadership title.", 
      duration: 15,
      videoUrl: "https://www.youtube.com/embed/es7XtrloDIQ",
      hasQuiz: false,
      hasExercise: true,
      keyTakeaways: [
        "Demonstrate leadership without authority",
        "Highlight initiative and ownership",
        "Show impact on team outcomes"
      ],
      resources: [
        { title: "Leadership Story Mining Worksheet", type: "pdf" }
      ]
    },
    { 
      id: "4", 
      title: "Demonstrating Teamwork", 
      description: "Examples of collaboration and conflict resolution that show your interpersonal skills.", 
      duration: 15,
      videoUrl: "https://www.youtube.com/embed/4tYoVx0QoN0",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Showcase collaboration skills",
        "Handle conflict professionally",
        "Give credit to team members"
      ],
      resources: [
        { title: "Teamwork Scenarios Guide", type: "pdf" }
      ]
    },
    { 
      id: "5", 
      title: "Handling Failure Questions", 
      description: "Turn setbacks into growth opportunities and demonstrate resilience.", 
      duration: 15,
      videoUrl: "https://www.youtube.com/embed/dkrCTE0OGYQ",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Frame failures as learning experiences",
        "Show personal growth and self-awareness",
        "Demonstrate resilience and adaptability"
      ],
      resources: [
        { title: "Failure Reframing Template", type: "pdf" }
      ]
    },
    { 
      id: "6", 
      title: "Cultural Fit & Motivation", 
      description: "Aligning your values with company culture and articulating your career motivations.", 
      duration: 10,
      videoUrl: "https://www.youtube.com/embed/1mHjMNZZvFo",
      hasQuiz: true,
      hasExercise: false,
      keyTakeaways: [
        "Research company values authentically",
        "Connect your motivations to the role",
        "Ask insightful questions about culture"
      ],
      resources: [
        { title: "Company Research Template", type: "pdf" }
      ]
    },
    { 
      id: "7", 
      title: "Practice: Tell Me About Yourself", 
      description: "Perfect your elevator pitch with this guided practice session.", 
      duration: 20,
      videoUrl: "https://www.youtube.com/embed/kayOhGRcNt4",
      hasQuiz: false,
      hasExercise: true,
      keyTakeaways: [
        "Craft a compelling 2-minute pitch",
        "Tailor your story to the role",
        "End with a hook for follow-up questions"
      ],
      resources: [
        { title: "Pitch Template", type: "pdf" },
        { title: "Recording Guide", type: "doc" }
      ]
    },
  ],
  "System Design Fundamentals": [
    { 
      id: "1", 
      title: "Introduction to System Design", 
      description: "What to expect in system design interviews and how to approach open-ended problems.", 
      duration: 20,
      videoUrl: "https://www.youtube.com/embed/UzLMhqg3_Wc",
      hasQuiz: true,
      hasExercise: false,
      keyTakeaways: [
        "Understand system design interview format",
        "Learn the structured approach to problems",
        "Know what level of detail to provide"
      ],
      resources: [
        { title: "System Design Primer", type: "pdf" }
      ]
    },
    { 
      id: "2", 
      title: "Scalability Principles", 
      description: "Horizontal vs vertical scaling strategies and when to use each approach.", 
      duration: 25,
      videoUrl: "https://www.youtube.com/embed/xpDnVSmNFX0",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Distinguish horizontal vs vertical scaling",
        "Design for millions of users",
        "Handle traffic spikes gracefully"
      ],
      resources: [
        { title: "Scalability Cheat Sheet", type: "pdf" },
        { title: "Architecture Diagrams", type: "image" }
      ]
    },
    { 
      id: "3", 
      title: "Database Design & Selection", 
      description: "SQL vs NoSQL and when to use each. Data modeling best practices.", 
      duration: 30,
      videoUrl: "https://www.youtube.com/embed/ZS_kXvOeQ5Y",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Choose between SQL and NoSQL",
        "Design efficient data schemas",
        "Understand indexing strategies"
      ],
      resources: [
        { title: "Database Selection Guide", type: "pdf" }
      ]
    },
    { 
      id: "4", 
      title: "Caching Strategies", 
      description: "Redis, Memcached, and cache invalidation patterns for performance optimization.", 
      duration: 25,
      videoUrl: "https://www.youtube.com/embed/U3RkDLtS7uY",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Implement caching at multiple layers",
        "Handle cache invalidation correctly",
        "Choose appropriate cache strategies"
      ],
      resources: [
        { title: "Caching Patterns", type: "pdf" }
      ]
    },
    { 
      id: "5", 
      title: "Load Balancing & CDNs", 
      description: "Distributing traffic and content delivery for global applications.", 
      duration: 25,
      videoUrl: "https://www.youtube.com/embed/K0Ta65OqQkY",
      hasQuiz: true,
      hasExercise: false,
      keyTakeaways: [
        "Configure load balancer strategies",
        "Use CDNs for static content",
        "Handle session persistence"
      ],
      resources: [
        { title: "Load Balancing Guide", type: "pdf" }
      ]
    },
    { 
      id: "6", 
      title: "Designing URL Shortener", 
      description: "Step-by-step system design walkthrough for a URL shortening service.", 
      duration: 30,
      videoUrl: "https://www.youtube.com/embed/fMZMm_0ZhK4",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Walk through requirements gathering",
        "Design the complete system architecture",
        "Handle edge cases and scalability"
      ],
      resources: [
        { title: "URL Shortener Template", type: "pdf" }
      ]
    },
    { 
      id: "7", 
      title: "Designing Twitter/Instagram", 
      description: "Complex social media architecture with feeds, notifications, and media storage.", 
      duration: 45,
      videoUrl: "https://www.youtube.com/embed/wYk0xPP_P_8",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Design feed generation systems",
        "Handle media storage at scale",
        "Implement real-time notifications"
      ],
      resources: [
        { title: "Social Media Architecture", type: "pdf" },
        { title: "Feed Algorithm Deep Dive", type: "doc" }
      ]
    },
  ],
  "Communication Skills for Developers": [
    { 
      id: "1", 
      title: "Why Communication Matters", 
      description: "The impact of clear communication in tech careers and interview success.", 
      duration: 10,
      videoUrl: "https://www.youtube.com/embed/DIR_rxusO8Q",
      hasQuiz: true,
      hasExercise: false,
      keyTakeaways: [
        "Understand communication's role in tech",
        "Recognize common communication pitfalls",
        "Build awareness of your communication style"
      ],
      resources: [
        { title: "Communication Self-Assessment", type: "pdf" }
      ]
    },
    { 
      id: "2", 
      title: "Explaining Technical Concepts", 
      description: "Making complex ideas accessible to different audiences without losing accuracy.", 
      duration: 15,
      videoUrl: "https://www.youtube.com/embed/5mguZ0gN3SY",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Use analogies effectively",
        "Adjust complexity for your audience",
        "Check for understanding as you go"
      ],
      resources: [
        { title: "Technical Explanation Templates", type: "pdf" }
      ]
    },
    { 
      id: "3", 
      title: "Active Listening Techniques", 
      description: "Understanding questions before answering and showing genuine engagement.", 
      duration: 10,
      videoUrl: "https://www.youtube.com/embed/rzsVh8YwZEQ",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Practice pausing before responding",
        "Ask clarifying questions",
        "Confirm understanding before diving in"
      ],
      resources: [
        { title: "Active Listening Exercises", type: "pdf" }
      ]
    },
    { 
      id: "4", 
      title: "Body Language & Confidence", 
      description: "Non-verbal cues that build trust and project confidence in interviews.", 
      duration: 15,
      videoUrl: "https://www.youtube.com/embed/cFLjudWTuGQ",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Master confident posture",
        "Use appropriate eye contact",
        "Control nervous habits"
      ],
      resources: [
        { title: "Body Language Tips", type: "pdf" }
      ]
    },
    { 
      id: "5", 
      title: "Handling Difficult Questions", 
      description: "Strategies when you don't know the answer and maintaining composure under pressure.", 
      duration: 15,
      videoUrl: "https://www.youtube.com/embed/Hn7GcvL0A20",
      hasQuiz: true,
      hasExercise: true,
      keyTakeaways: [
        "Admit gaps honestly",
        "Show problem-solving approach",
        "Redirect to related strengths"
      ],
      resources: [
        { title: "Difficult Questions Guide", type: "pdf" }
      ]
    },
    { 
      id: "6", 
      title: "Virtual Interview Best Practices", 
      description: "Optimizing your remote interview setup for the best impression.", 
      duration: 10,
      videoUrl: "https://www.youtube.com/embed/HG68Ymazo18",
      hasQuiz: false,
      hasExercise: true,
      keyTakeaways: [
        "Set up professional lighting and audio",
        "Minimize distractions and interruptions",
        "Test technology before the interview"
      ],
      resources: [
        { title: "Remote Interview Checklist", type: "pdf" },
        { title: "Background Setup Guide", type: "doc" }
      ]
    },
  ],
};

// Quiz data for lessons
const lessonQuizzes: Record<string, { question: string; options: string[]; correct: number }[]> = {
  "Mastering Technical Interviews-1": [
    {
      question: "What is the primary purpose of a technical interview?",
      options: [
        "To test memorization of algorithms",
        "To evaluate problem-solving skills and thinking process",
        "To check how fast you can code",
        "To see if you know specific languages"
      ],
      correct: 1
    },
    {
      question: "How should you approach a problem you've never seen before?",
      options: [
        "Panic and ask for hints immediately",
        "Start coding right away",
        "Break it down, ask clarifying questions, think through examples",
        "Give up and move to the next question"
      ],
      correct: 2
    }
  ],
  "Mastering Technical Interviews-2": [
    {
      question: "What is the time complexity of accessing an element in a hash table?",
      options: ["O(n)", "O(log n)", "O(1) average", "O(n²)"],
      correct: 2
    },
    {
      question: "Which has better time complexity: O(n log n) or O(n²)?",
      options: ["O(n²)", "O(n log n)", "They are the same", "Depends on n"],
      correct: 1
    }
  ],
  "Behavioral Interview Excellence-1": [
    {
      question: "Why do companies use behavioral interviews?",
      options: [
        "To test technical skills only",
        "To predict future behavior based on past experiences",
        "To see if you can memorize stories",
        "To make interviews longer"
      ],
      correct: 1
    }
  ],
  "Behavioral Interview Excellence-2": [
    {
      question: "What does STAR stand for?",
      options: [
        "Story, Task, Action, Review",
        "Situation, Task, Action, Result",
        "Start, Think, Act, Reflect",
        "Scenario, Target, Approach, Response"
      ],
      correct: 1
    },
    {
      question: "How long should a STAR response typically be?",
      options: ["30 seconds", "1-2 minutes", "5+ minutes", "As long as possible"],
      correct: 1
    }
  ]
};

const courseIcons: Record<string, React.ReactNode> = {
  "Mastering Technical Interviews": <Code className="w-6 h-6 text-white" />,
  "Behavioral Interview Excellence": <MessageSquare className="w-6 h-6 text-white" />,
  "System Design Fundamentals": <Layers className="w-6 h-6 text-white" />,
  "Communication Skills for Developers": <Mic className="w-6 h-6 text-white" />,
};

// Skeleton components
const CourseCardSkeleton = () => (
  <div className="rounded-xl border-2 border-border/50 bg-card p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="w-8 h-8 rounded" />
    </div>
    <div className="flex flex-wrap gap-2 mb-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-6 w-20 rounded" />
      ))}
    </div>
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

const ProgressSkeleton = () => (
  <div className="rounded-xl border-2 border-border/50 bg-card p-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-5 w-28 rounded-full" />
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="text-center">
          <Skeleton className="h-10 w-16 mx-auto mb-2" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      ))}
    </div>
  </div>
);

// Video Lesson Player Component
const VideoLessonPlayer = ({
  lesson,
  courseTitle,
  onComplete,
  isCompleted
}: {
  lesson: VideoLesson;
  courseTitle: string;
  onComplete: () => void;
  isCompleted: boolean;
}) => {
  const [activeTab, setActiveTab] = useState("video");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [notes, setNotes] = useState("");
  
  const quizKey = `${courseTitle}-${lesson.id}`;
  const quiz = lessonQuizzes[quizKey] || [];

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const correctCount = quiz.filter((q, i) => quizAnswers[i] === q.correct).length;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Video</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
          {lesson.hasQuiz && (
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Quiz</span>
            </TabsTrigger>
          )}
          {lesson.hasExercise && (
            <TabsTrigger value="exercise" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Exercise</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="video" className="mt-4 space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-lg">
            <iframe
              src={`${lesson.videoUrl}?autoplay=0&rel=0`}
              title={lesson.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-foreground mb-2">About this lesson</h4>
              <p className="text-muted-foreground text-sm">{lesson.description}</p>
            </CardContent>
          </Card>

          {lesson.resources.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Resources
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {lesson.resources.map((resource, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3 bg-muted/50 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium truncate">{resource.title}</span>
                    </div>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {resource.type.toUpperCase()}
                    </Badge>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Key Takeaways
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {lesson.keyTakeaways.map((takeaway, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{takeaway}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-border pt-4">
                <h4 className="font-medium text-foreground mb-3">Your Notes</h4>
                <textarea 
                  className="w-full h-32 p-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="Add your personal notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Button size="sm" className="mt-2">Save Notes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {lesson.hasQuiz && (
          <TabsContent value="quiz" className="mt-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Knowledge Check
                </CardTitle>
                <CardDescription>
                  Test your understanding of the concepts covered in this lesson
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {quiz.length > 0 ? (
                  <>
                    {quiz.map((q, qIndex) => (
                      <div key={qIndex} className="space-y-3">
                        <p className="font-medium text-foreground">
                          {qIndex + 1}. {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((option, oIndex) => (
                            <motion.button
                              key={oIndex}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                              className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${
                                quizSubmitted
                                  ? oIndex === q.correct
                                    ? "bg-green-500/20 border-green-500"
                                    : quizAnswers[qIndex] === oIndex
                                    ? "bg-red-500/20 border-red-500"
                                    : "bg-muted/30 border-border"
                                  : quizAnswers[qIndex] === oIndex
                                  ? "bg-primary/20 border-primary"
                                  : "bg-muted/30 border-border hover:border-primary/50"
                              }`}
                              disabled={quizSubmitted}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                                  quizSubmitted && oIndex === q.correct
                                    ? "border-green-500 text-green-500"
                                    : quizAnswers[qIndex] === oIndex
                                    ? "border-primary text-primary"
                                    : "border-muted-foreground text-muted-foreground"
                                }`}>
                                  {String.fromCharCode(65 + oIndex)}
                                </div>
                                <span className="text-sm">{option}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {!quizSubmitted ? (
                      <Button 
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length < quiz.length}
                        className="w-full"
                      >
                        Submit Answers
                      </Button>
                    ) : (
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          {correctCount === quiz.length ? (
                            <>
                              <Award className="w-5 h-5 text-green-500" />
                              <span className="font-medium text-green-500">Perfect Score!</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-5 h-5 text-muted-foreground" />
                              <span className="font-medium">
                                {correctCount} / {quiz.length} Correct
                              </span>
                            </>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setQuizAnswers({});
                            setQuizSubmitted(false);
                          }}
                        >
                          Try Again
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Quiz content coming soon!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {lesson.hasExercise && (
          <TabsContent value="exercise" className="mt-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Practical Exercise
                </CardTitle>
                <CardDescription>
                  Apply what you've learned with this hands-on exercise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Exercise: Apply Your Learning</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Based on the concepts from this lesson, complete the following exercise to reinforce your understanding.
                    </p>
                    <div className="bg-background p-4 rounded-lg border border-border font-mono text-sm">
                      <pre className="text-muted-foreground whitespace-pre-wrap">
{`// Practice Exercise
// Apply the concepts from "${lesson.title}"

// Your task:
// 1. Review the key takeaways
// 2. Write down 3 specific examples from your experience
// 3. Practice explaining each concept out loud

// Notes:
`}
                      </pre>
                    </div>
                  </div>
                  
                  <textarea 
                    className="w-full h-40 p-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                    placeholder="Write your exercise response here..."
                  />
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button className="flex-1" onClick={onComplete}>
                      Submit & Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<VideoLesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        supabase.from("courses").select("*").eq("is_published", true),
        supabase.from("course_enrollments").select("*"),
      ]);

      if (coursesRes.error) throw coursesRes.error;
      setCourses(coursesRes.data || []);
      setEnrollments(enrollmentsRes.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Failed to load courses",
        description: "Please try again later.",
        variant: "destructive",
        action: (
          <Button variant="outline" size="sm" onClick={fetchData}>
            Try Again
          </Button>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be logged in to enroll in courses.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("course_enrollments").insert({
        user_id: user.id,
        course_id: courseId,
        progress: 0,
      });

      if (error) throw error;

      toast({
        title: "Enrolled successfully!",
        description: "Start learning now to boost your interview skills.",
      });

      const { data } = await supabase.from("course_enrollments").select("*");
      setEnrollments(data || []);
    } catch (error) {
      console.error("Error enrolling:", error);
      toast({
        title: "Enrollment failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getEnrollment = (courseId: string) => {
    return enrollments.find((e) => e.course_id === courseId);
  };

  const handleLessonComplete = async (lessonId: string, courseTitle: string) => {
    const key = `${courseTitle}-${lessonId}`;
    const newProgress = { ...lessonProgress, [key]: true };
    setLessonProgress(newProgress);

    const lessons = courseCurriculum[courseTitle] || [];
    const completedCount = lessons.filter((l) => newProgress[`${courseTitle}-${l.id}`]).length;
    const progressPercent = Math.round((completedCount / lessons.length) * 100);

    const enrollment = enrollments.find((e) => {
      const course = courses.find((c) => c.id === e.course_id);
      return course?.title === courseTitle;
    });

    if (enrollment) {
      await supabase
        .from("course_enrollments")
        .update({ 
          progress: progressPercent,
          completed: progressPercent === 100,
          completed_at: progressPercent === 100 ? new Date().toISOString() : null
        })
        .eq("id", enrollment.id);

      const { data } = await supabase.from("course_enrollments").select("*");
      setEnrollments(data || []);
    }

    toast({
      title: "Lesson completed!",
      description: progressPercent === 100 
        ? "Congratulations! You've completed this course!" 
        : `Course progress: ${progressPercent}%`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "secondary";
      case "intermediate": return "default";
      case "advanced": return "destructive";
      default: return "outline";
    }
  };

  const enrolledCourses = courses.filter((c) => getEnrollment(c.id));
  const totalProgress = enrolledCourses.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrolledCourses.length)
    : 0;
  const totalMinutes = enrolledCourses.reduce((sum, c) => sum + (c.duration_minutes || 0), 0);
  const completedLessons = Object.values(lessonProgress).filter(Boolean).length;

  // Course Detail View with Video Lessons
  if (selectedCourse) {
    const lessons = courseCurriculum[selectedCourse.title] || [];
    const enrollment = getEnrollment(selectedCourse.id);
    
    return (
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="space-y-6"
        >
          {/* Back Button & Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                if (selectedLesson) {
                  setSelectedLesson(null);
                } else {
                  setSelectedCourse(null);
                }
              }}
              className="transition-all duration-200 ease-in-out hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{selectedLesson ? selectedLesson.title : selectedCourse.title}</h1>
              <p className="text-muted-foreground">{selectedLesson ? `Lesson ${lessons.findIndex(l => l.id === selectedLesson.id) + 1} of ${lessons.length}` : selectedCourse.description}</p>
            </div>
            {selectedLesson && (
              <Button 
                variant={lessonProgress[`${selectedCourse.title}-${selectedLesson.id}`] ? "secondary" : "default"}
                onClick={() => handleLessonComplete(selectedLesson.id, selectedCourse.title)}
                disabled={lessonProgress[`${selectedCourse.title}-${selectedLesson.id}`]}
              >
                {lessonProgress[`${selectedCourse.title}-${selectedLesson.id}`] ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark Complete
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Selected Lesson View */}
          {selectedLesson ? (
            <VideoLessonPlayer
              lesson={selectedLesson}
              courseTitle={selectedCourse.title}
              onComplete={() => handleLessonComplete(selectedLesson.id, selectedCourse.title)}
              isCompleted={!!lessonProgress[`${selectedCourse.title}-${selectedLesson.id}`]}
            />
          ) : (
            <>
              {/* Course Progress */}
              {enrollment && (
                <Card className="p-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">Your Progress</h3>
                        <p className="text-sm text-muted-foreground">
                          {lessons.filter((l) => lessonProgress[`${selectedCourse.title}-${l.id}`]).length} of {lessons.length} lessons completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{enrollment.progress}%</div>
                      {enrollment.completed && (
                        <Badge variant="default" className="mt-1">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress value={enrollment.progress} className="h-2" />
                </Card>
              )}

              {/* Lessons List */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Course Curriculum
                </h2>
                {lessons.map((lesson, index) => {
                  const isCompleted = lessonProgress[`${selectedCourse.title}-${lesson.id}`];
                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <Card 
                        className={`p-4 transition-all duration-200 ease-in-out hover:shadow-md cursor-pointer group ${
                          isCompleted ? "border-green-500/50 bg-green-500/5" : "hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedLesson(lesson)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isCompleted 
                              ? "bg-green-500 text-white" 
                              : "bg-muted group-hover:bg-primary group-hover:text-white"
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Video className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold group-hover:text-primary transition-colors duration-200">
                              {lesson.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-1">{lesson.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {lesson.duration} min
                              </div>
                              {lesson.hasQuiz && (
                                <Badge variant="outline" className="text-xs px-1.5 py-0">Quiz</Badge>
                              )}
                              {lesson.hasExercise && (
                                <Badge variant="outline" className="text-xs px-1.5 py-0">Exercise</Badge>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="bg-gradient-hero text-white rounded-xl p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary-glow)/0.3),transparent_50%)]" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              Interview Training Courses
            </h1>
            <p className="text-white/90 max-w-2xl">
              Master every aspect of the interview process with our comprehensive video courses designed by industry experts.
            </p>
          </div>
        </motion.div>

        {/* Your Progress */}
        {loading ? (
          <ProgressSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <Card className="p-6 border-2 border-border/50 hover:border-primary/30 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Your Learning Journey
                </h2>
                <Badge variant="secondary">{enrolledCourses.length} Active Courses</Badge>
              </div>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-lg bg-muted/30 transition-colors duration-200 hover:bg-muted/50">
                  <div className="text-4xl font-bold text-primary mb-2">{totalProgress}%</div>
                  <div className="text-sm text-muted-foreground">Overall Progress</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30 transition-colors duration-200 hover:bg-muted/50">
                  <div className="text-4xl font-bold text-secondary mb-2">{totalMinutes}</div>
                  <div className="text-sm text-muted-foreground">Minutes of Content</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30 transition-colors duration-200 hover:bg-muted/50">
                  <div className="text-4xl font-bold text-accent mb-2">{completedLessons}</div>
                  <div className="text-sm text-muted-foreground">Lessons Completed</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30 transition-colors duration-200 hover:bg-muted/50">
                  <div className="text-4xl font-bold text-green-500 mb-2">
                    {enrollments.filter((e) => e.completed).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Courses Completed</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Courses Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            Available Courses
          </h2>
          
          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <BentoGrid className="lg:grid-cols-2">
              {courses.map((course, index) => {
                const enrollment = getEnrollment(course.id);
                const isEnrolled = !!enrollment;
                const lessons = courseCurriculum[course.title] || [];
                
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.08,
                      ease: [0.4, 0, 0.2, 1] 
                    }}
                    className="group relative rounded-xl border-2 border-border/50 bg-card p-6 transition-all duration-200 ease-in-out hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              {courseIcons[course.title] || <BookOpen className="w-5 h-5 text-white" />}
                            </div>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-200">
                              {course.title}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <Badge variant={getDifficultyColor(course.difficulty) as any}>
                              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {course.duration_minutes} min
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Video className="w-4 h-4" />
                              {lessons.length} video lessons
                            </div>
                          </div>
                        </div>
                        {isEnrolled && (
                          <div className="text-right">
                            <PlayCircle className="w-8 h-8 text-primary" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.topics?.slice(0, 4).map((topic, i) => (
                          <span 
                            key={i} 
                            className="text-xs px-2 py-1 bg-muted rounded transition-colors duration-200 hover:bg-primary/10"
                          >
                            {topic}
                          </span>
                        ))}
                        {course.topics && course.topics.length > 4 && (
                          <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                            +{course.topics.length - 4} more
                          </span>
                        )}
                      </div>

                      {isEnrolled ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{enrollment.progress}%</span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                          <Button 
                            className="w-full mt-2 transition-all duration-200"
                            onClick={() => setSelectedCourse(course)}
                          >
                            {enrollment.completed ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Review Course
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Continue Learning
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          className="w-full transition-all duration-200" 
                          variant="outline"
                          onClick={() => handleEnroll(course.id)}
                        >
                          <GraduationCap className="w-4 h-4 mr-2" />
                          Enroll Now — Free
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </BentoGrid>
          )}
        </div>

        {/* Learning Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <Card className="p-6 border-2 border-border/50 bg-gradient-to-r from-accent/5 to-transparent">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Pro Tips for Interview Success
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Practice Daily</h4>
                  <p className="text-xs text-muted-foreground">Consistency beats intensity. 30 minutes daily is more effective than weekend cramming.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Mock Interviews</h4>
                  <p className="text-xs text-muted-foreground">Use our AI interviewer to simulate real interview conditions and get feedback.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Track Progress</h4>
                  <p className="text-xs text-muted-foreground">Review your dashboard regularly to identify areas that need more attention.</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Courses;
