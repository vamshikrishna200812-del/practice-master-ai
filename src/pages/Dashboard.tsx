import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

const Dashboard = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-hero text-white rounded-xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary-glow)/0.3),transparent_50%)]" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome to Your Training Dashboard</h1>
            <p className="text-white/90 mb-6">
              Track your progress and continue your journey to interview mastery
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/interview-bot">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Video className="mr-2 w-5 h-5" />
                  Start AI Interview
                </Button>
              </Link>
              <Link to="/practice">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  <Code className="mr-2 w-5 h-5" />
                  Practice Coding
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 bg-gradient-card hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {stat.value}
                {stat.suffix || "/100"}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              {!stat.suffix && <Progress value={stat.value} className="mt-2" />}
            </Card>
          ))}
        </div>

        {/* Overall Progress */}
        <Card className="p-6">
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
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userProgress?.total_interviews || 0}</div>
                <div className="text-sm text-muted-foreground">Total Interviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{Math.floor((userProgress?.overall_score || 0) / 10)}</div>
                <div className="text-sm text-muted-foreground">Skill Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{userProgress?.practice_streak || 0}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all">
            <Calendar className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Schedule Classes</h3>
            <p className="text-muted-foreground mb-4">
              Book one-on-one sessions with expert instructors
            </p>
            <Link to="/schedule">
              <Button className="w-full">Schedule Now</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <Target className="w-10 h-10 text-secondary mb-4" />
            <h3 className="text-xl font-bold mb-2">Learning Path</h3>
            <p className="text-muted-foreground mb-4">
              Follow your personalized AI-generated curriculum
            </p>
            <Link to="/courses">
              <Button className="w-full" variant="secondary">View Path</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <Video className="w-10 h-10 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">AI Interview Bot</h3>
            <p className="text-muted-foreground mb-4">
              Practice with our advanced AI interviewer
            </p>
            <Link to="/interview-bot">
              <Button className="w-full" variant="outline">Start Interview</Button>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;