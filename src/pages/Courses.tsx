import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { Skeleton } from "@/components/ui/skeleton-loaders";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Mic
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

interface CourseLesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
}

// Course curriculum data
const courseCurriculum: Record<string, CourseLesson[]> = {
  "Mastering Technical Interviews": [
    { id: "1", title: "Introduction to Technical Interviews", description: "Understanding what companies look for in technical candidates", duration: 15, completed: false },
    { id: "2", title: "Big O Notation & Complexity Analysis", description: "Master time and space complexity for algorithm optimization", duration: 20, completed: false },
    { id: "3", title: "Arrays & Strings Deep Dive", description: "Common patterns and techniques for array manipulation", duration: 25, completed: false },
    { id: "4", title: "Linked Lists & Two Pointers", description: "Solving problems with linked list traversal techniques", duration: 20, completed: false },
    { id: "5", title: "Trees & Graph Traversal", description: "BFS, DFS, and tree-based problem solving", duration: 25, completed: false },
    { id: "6", title: "Dynamic Programming Essentials", description: "Breaking down complex problems into subproblems", duration: 30, completed: false },
    { id: "7", title: "Mock Interview Practice", description: "Simulated technical interview with feedback", duration: 45, completed: false },
  ],
  "Behavioral Interview Excellence": [
    { id: "1", title: "Understanding Behavioral Interviews", description: "Why companies value behavioral assessments", duration: 10, completed: false },
    { id: "2", title: "The STAR Method Framework", description: "Structuring your responses for maximum impact", duration: 15, completed: false },
    { id: "3", title: "Crafting Leadership Stories", description: "Showcase times you led teams or initiatives", duration: 15, completed: false },
    { id: "4", title: "Demonstrating Teamwork", description: "Examples of collaboration and conflict resolution", duration: 15, completed: false },
    { id: "5", title: "Handling Failure Questions", description: "Turn setbacks into growth opportunities", duration: 15, completed: false },
    { id: "6", title: "Cultural Fit & Motivation", description: "Aligning your values with company culture", duration: 10, completed: false },
    { id: "7", title: "Practice Session: Tell Me About Yourself", description: "Perfect your elevator pitch", duration: 20, completed: false },
  ],
  "System Design Fundamentals": [
    { id: "1", title: "Introduction to System Design", description: "What to expect in system design interviews", duration: 20, completed: false },
    { id: "2", title: "Scalability Principles", description: "Horizontal vs vertical scaling strategies", duration: 25, completed: false },
    { id: "3", title: "Database Design & Selection", description: "SQL vs NoSQL and when to use each", duration: 30, completed: false },
    { id: "4", title: "Caching Strategies", description: "Redis, Memcached, and cache invalidation", duration: 25, completed: false },
    { id: "5", title: "Load Balancing & CDNs", description: "Distributing traffic and content delivery", duration: 25, completed: false },
    { id: "6", title: "Designing URL Shortener", description: "Step-by-step system design walkthrough", duration: 30, completed: false },
    { id: "7", title: "Designing Twitter/Instagram", description: "Complex social media architecture", duration: 45, completed: false },
  ],
  "Communication Skills for Developers": [
    { id: "1", title: "Why Communication Matters", description: "The impact of clear communication in tech", duration: 10, completed: false },
    { id: "2", title: "Explaining Technical Concepts", description: "Making complex ideas accessible", duration: 15, completed: false },
    { id: "3", title: "Active Listening Techniques", description: "Understanding questions before answering", duration: 10, completed: false },
    { id: "4", title: "Body Language & Confidence", description: "Non-verbal cues that build trust", duration: 15, completed: false },
    { id: "5", title: "Handling Difficult Questions", description: "Strategies when you don't know the answer", duration: 15, completed: false },
    { id: "6", title: "Virtual Interview Best Practices", description: "Optimizing your remote interview setup", duration: 10, completed: false },
  ],
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

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
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

      // Refresh enrollments
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

    // Calculate course progress
    const lessons = courseCurriculum[courseTitle] || [];
    const completedCount = lessons.filter((l) => newProgress[`${courseTitle}-${l.id}`]).length;
    const progressPercent = Math.round((completedCount / lessons.length) * 100);

    // Update enrollment progress
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

      // Refresh enrollments
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

  // Course Detail View
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
              onClick={() => setSelectedCourse(null)}
              className="transition-all duration-200 ease-in-out hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{selectedCourse.title}</h1>
              <p className="text-muted-foreground">{selectedCourse.description}</p>
            </div>
          </div>

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
                    onClick={() => !isCompleted && handleLessonComplete(lesson.id, selectedCourse.title)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isCompleted 
                          ? "bg-green-500 text-white" 
                          : "bg-muted group-hover:bg-primary group-hover:text-white"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span className="font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold group-hover:text-primary transition-colors duration-200">
                          {lesson.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {lesson.duration} min
                      </div>
                      {!isCompleted && (
                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
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
              Master every aspect of the interview process with our comprehensive courses designed by industry experts.
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
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant={getDifficultyColor(course.difficulty) as any}>
                              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {course.duration_minutes} min
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <BookOpen className="w-4 h-4" />
                              {(courseCurriculum[course.title] || []).length} lessons
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
