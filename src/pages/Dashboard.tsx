import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton-loaders";
import { Skeleton } from "@/components/ui/skeleton-loaders";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ProgressTrendsChart } from "@/components/dashboard/ProgressTrendsChart";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import {
  TrendingUp,
  Video,
  Code,
  MessageSquare,
  Calendar,
  Award,
  Target,
  Flame,
} from "lucide-react";
import { Link } from "react-router-dom";
import dashboardOwlVideo from "@/assets/dashboard-owl.mp4";

interface UserProgress {
  total_interviews: number;
  coding_score: number;
  communication_score: number;
  body_language_score: number;
  overall_score: number;
  practice_streak: number;
}

const StatCardSkeleton = () => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-6">
    <div className="flex items-start justify-between mb-4">
      <Skeleton className="w-12 h-12 rounded-lg bg-white/10" />
      <Skeleton className="w-4 h-4 rounded bg-white/10" />
    </div>
    <Skeleton className="h-8 w-20 mb-2 bg-white/10" />
    <Skeleton className="h-4 w-24 mb-2 bg-white/10" />
    <Skeleton className="h-2 w-full rounded-full bg-white/10" />
  </div>
);

const OverallProgressSkeleton = () => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-6">
    <Skeleton className="h-7 w-56 mb-6 bg-white/10" />
    <Skeleton className="h-3 w-full rounded-full mb-6 bg-white/10" />
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="text-center">
          <Skeleton className="h-8 w-12 mx-auto mb-2 bg-white/10" />
          <Skeleton className="h-4 w-24 mx-auto bg-white/10" />
        </div>
      ))}
    </div>
  </div>
);

const QuickActionSkeleton = () => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-6">
    <Skeleton className="w-10 h-10 rounded-lg mb-4 bg-white/10" />
    <Skeleton className="h-6 w-32 mb-2 bg-white/10" />
    <Skeleton className="h-4 w-full mb-4 bg-white/10" />
    <Skeleton className="h-10 w-full rounded-lg bg-white/10" />
  </div>
);

/** Reusable wrapper that adds the glowing border effect to any card */
const GlowCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`relative rounded-xl ${className ?? ""}`}>
    <GlowingEffect
      spread={40}
      glow
      disabled={false}
      proximity={64}
      inactiveZone={0.01}
      borderWidth={2}
    />
    <div className="relative rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 h-full">
      {children}
    </div>
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
        description:
          "There was an issue fetching your data. Please try again.",
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
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      label: "Communication",
      value: userProgress?.communication_score || 0,
      icon: MessageSquare,
      gradient: "from-purple-500 to-pink-400",
    },
    {
      label: "Body Language",
      value: userProgress?.body_language_score || 0,
      icon: Video,
      gradient: "from-emerald-500 to-teal-400",
    },
    {
      label: "Practice Streak",
      value: userProgress?.practice_streak || 0,
      icon: Flame,
      gradient: "from-orange-500 to-amber-400",
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
    },
    {
      title: "Learning Path",
      description: "Follow your personalized AI-generated curriculum",
      icon: Target,
      link: "/courses",
      buttonText: "View Path",
    },
    {
      title: "AI Interview Bot",
      description: "Practice with our advanced AI interviewer",
      icon: Video,
      link: "/interview-bot",
      buttonText: "Start Interview",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 -mx-4 -my-6 px-4 py-6 min-h-screen bg-black text-white rounded-lg">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <GlowCard>
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent pointer-events-none" />
              {/* Owl Mascot */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-28 h-28 opacity-80 hidden md:block">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain rounded-xl"
                >
                  <source src={dashboardOwlVideo} type="video/mp4" />
                </video>
              </div>
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2 text-white">
                  Welcome to Your Training Dashboard
                </h1>
                <p className="text-white/70 mb-6">
                  Track your progress and continue your journey to interview
                  mastery
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/interview-bot">
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-white/90 transition-all duration-200"
                    >
                      <Video className="mr-2 w-5 h-5" />
                      Start AI Interview
                    </Button>
                  </Link>
                  <Link to="/practice">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <Code className="mr-2 w-5 h-5" />
                      Practice Coding
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.08,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <GlowCard>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-bold mb-1 text-white">
                    {stat.value}
                    {stat.suffix || "/100"}
                  </div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                  {!stat.suffix && (
                    <Progress value={stat.value} className="mt-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-cyan-400" />
                  )}
                </GlowCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Overall Progress */}
        {loading ? (
          <OverallProgressSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <GlowCard>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <Award className="w-6 h-6 text-amber-400" />
                Overall Interview Readiness
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-white/80">
                      Overall Score
                    </span>
                    <span className="font-bold text-cyan-400">
                      {userProgress?.overall_score || 0}/100
                    </span>
                  </div>
                  <Progress
                    value={userProgress?.overall_score || 0}
                    className="h-3 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-cyan-400"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-2xl font-bold text-blue-400">
                      {userProgress?.total_interviews || 0}
                    </div>
                    <div className="text-sm text-white/50">
                      Total Interviews
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-2xl font-bold text-purple-400">
                      {Math.floor(
                        (userProgress?.overall_score || 0) / 10
                      )}
                    </div>
                    <div className="text-sm text-white/50">Skill Level</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-2xl font-bold text-amber-400">
                      {userProgress?.practice_streak || 0}
                    </div>
                    <div className="text-sm text-white/50">Day Streak</div>
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        )}

        {/* Progress Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <GlowCard>
            <ProgressTrendsChart />
          </GlowCard>
        </motion.div>

        {/* Quick Actions */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <QuickActionSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.5 + index * 0.08,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <GlowCard>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-white/50 mb-4">
                    {action.description}
                  </p>
                  <Link to={action.link} className="block">
                    <Button className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200">
                      {action.buttonText}
                    </Button>
                  </Link>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
