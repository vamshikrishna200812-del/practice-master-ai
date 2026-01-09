import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BentoGrid, BentoCard, BentoFeature } from "@/components/ui/bento-grid";
import { Skeleton } from "@/components/ui/skeleton-loaders";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ProgressTrendsChart } from "@/components/dashboard/ProgressTrendsChart";
import { 
  TrendingUp, 
  Video, 
  Code, 
  MessageSquare, 
  Calendar,
  Award,
  Target,
  Flame
} from "lucide-react";
import { Link } from "react-router-dom";

interface UserProgress {
  total_interviews: number;
  coding_score: number;
  communication_score: number;
  body_language_score: number;
  overall_score: number;
  practice_streak: number;
}

// Skeleton components for loading states
const StatCardSkeleton = () => (
  <div className="rounded-xl border-2 border-border/50 bg-card p-6">
    <div className="flex items-start justify-between mb-4">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <Skeleton className="w-4 h-4 rounded" />
    </div>
    <Skeleton className="h-8 w-20 mb-2" />
    <Skeleton className="h-4 w-24 mb-2" />
    <Skeleton className="h-2 w-full rounded-full" />
  </div>
);

const OverallProgressSkeleton = () => (
  <div className="rounded-xl border-2 border-border/50 bg-card p-6 lg:col-span-2">
    <div className="flex items-center gap-2 mb-6">
      <Skeleton className="w-6 h-6 rounded" />
      <Skeleton className="h-7 w-56" />
    </div>
    <Skeleton className="h-4 w-32 mb-2" />
    <Skeleton className="h-3 w-full rounded-full mb-6" />
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="text-center">
          <Skeleton className="h-8 w-12 mx-auto mb-2" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      ))}
    </div>
  </div>
);

const QuickActionSkeleton = () => (
  <div className="rounded-xl border-2 border-border/50 bg-card p-6">
    <Skeleton className="w-10 h-10 rounded-lg mb-4" />
    <Skeleton className="h-6 w-32 mb-2" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-3/4 mb-4" />
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

const Dashboard = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProgress();
  }, []);

  const fetchUserProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setUserProgress(data);
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast({
        title: "Failed to load progress",
        description: "There was an issue fetching your data. Please try again.",
        variant: "destructive",
        action: (
          <Button variant="outline" size="sm" onClick={fetchUserProgress}>
            Try Again
          </Button>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Coding Score",
      value: userProgress?.coding_score || 0,
      icon: Code,
      color: "text-primary",
    },
    {
      label: "Communication",
      value: userProgress?.communication_score || 0,
      icon: MessageSquare,
      color: "text-secondary",
    },
    {
      label: "Body Language",
      value: userProgress?.body_language_score || 0,
      icon: Video,
      color: "text-accent",
    },
    {
      label: "Practice Streak",
      value: userProgress?.practice_streak || 0,
      icon: Flame,
      color: "text-orange-500",
      suffix: " days",
    },
  ];

  const quickActions = [
    {
      title: "Schedule Classes",
      description: "Book one-on-one sessions with expert instructors",
      icon: Calendar,
      link: "/schedule",
      buttonText: "Schedule Now",
      variant: "default" as const,
    },
    {
      title: "Learning Path",
      description: "Follow your personalized AI-generated curriculum",
      icon: Target,
      link: "/courses",
      buttonText: "View Path",
      variant: "secondary" as const,
    },
    {
      title: "AI Interview Bot",
      description: "Practice with our advanced AI interviewer",
      icon: Video,
      link: "/interview-bot",
      buttonText: "Start Interview",
      variant: "outline" as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="bg-gradient-hero text-white rounded-xl p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary-glow)/0.3),transparent_50%)]" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome to Your Training Dashboard</h1>
            <p className="text-white/90 mb-6">
              Track your progress and continue your journey to interview mastery
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/interview-bot">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 transition-all duration-200 ease-in-out">
                  <Video className="mr-2 w-5 h-5" />
                  Start AI Interview
                </Button>
              </Link>
              <Link to="/practice">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary transition-all duration-200 ease-in-out">
                  <Code className="mr-2 w-5 h-5" />
                  Practice Coding
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid - Bento Layout */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <BentoGrid className="lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.08,
                  ease: [0.4, 0, 0.2, 1] 
                }}
                className="group relative rounded-xl border-2 border-border/50 bg-card p-6 transition-all duration-200 ease-in-out hover:border-primary/50 hover:shadow-lg hover:bg-card/80"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ease-in-out">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold mb-1 group-hover:text-primary transition-colors duration-200 ease-in-out">
                    {stat.value}
                    {stat.suffix || "/100"}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  {!stat.suffix && <Progress value={stat.value} className="mt-2" />}
                </div>
              </motion.div>
            ))}
          </BentoGrid>
        )}

        {/* Overall Progress - Large Bento Card */}
        {loading ? (
          <OverallProgressSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="group relative rounded-xl border-2 border-border/50 bg-card p-6 transition-all duration-200 ease-in-out hover:border-primary/50 hover:shadow-lg"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Overall Interview Readiness
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Overall Score</span>
                    <span className="font-bold text-primary">
                      {userProgress?.overall_score || 0}/100
                    </span>
                  </div>
                  <Progress value={userProgress?.overall_score || 0} className="h-3" />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 rounded-lg bg-muted/30 transition-colors duration-200 ease-in-out hover:bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{userProgress?.total_interviews || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Interviews</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30 transition-colors duration-200 ease-in-out hover:bg-muted/50">
                    <div className="text-2xl font-bold text-secondary">{Math.floor((userProgress?.overall_score || 0) / 10)}</div>
                    <div className="text-sm text-muted-foreground">Skill Level</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30 transition-colors duration-200 ease-in-out hover:bg-muted/50">
                    <div className="text-2xl font-bold text-accent">{userProgress?.practice_streak || 0}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <ProgressTrendsChart />
        </motion.div>

        {/* Quick Actions - Bento Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <QuickActionSkeleton key={i} />
            ))}
          </div>
        ) : (
          <BentoGrid>
            {quickActions.map((action, index) => (
              <BentoCard
                key={index}
                title={action.title}
                description={action.description}
                icon={<action.icon className="w-6 h-6 text-white" />}
                index={index + 4}
              >
                <Link to={action.link} className="block mt-4">
                  <Button 
                    className="w-full transition-all duration-200 ease-in-out" 
                    variant={action.variant}
                  >
                    {action.buttonText}
                  </Button>
                </Link>
              </BentoCard>
            ))}
          </BentoGrid>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
