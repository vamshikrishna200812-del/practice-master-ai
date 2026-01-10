import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Brain,
  Code,
  MessageSquare,
  Users,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  Award
} from "lucide-react";
import aiRobotVideo from "@/assets/ai-robot.mp4";

const AIInterviewBot = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<"behavioral" | "technical" | "coding">("behavioral");
  const [selectedQuestions, setSelectedQuestions] = useState(5);

  const interviewTypes = [
    {
      id: "behavioral" as const,
      title: "Behavioral Interview",
      description: "Practice STAR method responses, leadership scenarios, and soft skills",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      duration: "15-20 min"
    },
    {
      id: "technical" as const,
      title: "Technical Interview",
      description: "System design, architecture decisions, and technical concepts",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      duration: "20-30 min"
    },
    {
      id: "coding" as const,
      title: "Coding Interview",
      description: "Algorithm problems, data structures, and code optimization",
      icon: Code,
      color: "from-orange-500 to-red-500",
      duration: "25-35 min"
    }
  ];

  const questionOptions = [3, 5, 7, 10];

  const startInterview = () => {
    navigate(`/video-interview?type=${selectedType}&questions=${selectedQuestions}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-hero text-white rounded-2xl p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          
          {/* AI Robot Mascot Animation */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-40 h-40 opacity-90 hidden lg:block">
            <video autoPlay loop muted playsInline className="w-full h-full object-contain rounded-2xl">
              <source src={aiRobotVideo} type="video/mp4" />
            </video>
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Video className="w-8 h-8" />
              </div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                AI-Powered
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI Video Interview
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Practice with our intelligent AI interviewer in a realistic video call environment. 
              Get instant feedback on your answers, communication skills, and confidence.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                Real-time AI feedback
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <MessageSquare className="w-4 h-4" />
                Natural conversation
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Award className="w-4 h-4" />
                Detailed scoring
              </div>
            </div>
          </div>
        </div>

        {/* Interview Type Selection */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Choose Interview Type</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {interviewTypes.map((type) => (
              <Card
                key={type.id}
                className={`p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  selectedType === type.id 
                    ? "ring-2 ring-primary shadow-lg" 
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{type.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {type.duration}
                </div>
                {selectedType === type.id && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-sm font-medium text-primary flex items-center gap-1">
                      Selected <Target className="w-4 h-4" />
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Question Count Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Number of Questions</h2>
          <div className="flex flex-wrap gap-3">
            {questionOptions.map((count) => (
              <Button
                key={count}
                variant={selectedQuestions === count ? "default" : "outline"}
                onClick={() => setSelectedQuestions(count)}
                className="min-w-[80px]"
              >
                {count} Questions
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Estimated duration: {selectedQuestions * 3}-{selectedQuestions * 5} minutes
          </p>
        </Card>

        {/* Start Interview CTA */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-dashed border-primary/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to Start?</h2>
              <p className="text-muted-foreground">
                You've selected a <span className="font-medium text-foreground">{interviewTypes.find(t => t.id === selectedType)?.title}</span> with{" "}
                <span className="font-medium text-foreground">{selectedQuestions} questions</span>
              </p>
            </div>
            <Button 
              size="lg" 
              onClick={startInterview}
              className="gap-2 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              Start Video Interview
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Video,
              title: "Video Call Experience",
              description: "Realistic interview simulation with AI avatar"
            },
            {
              icon: MessageSquare,
              title: "Voice Recognition",
              description: "Speak naturally, AI transcribes in real-time"
            },
            {
              icon: Brain,
              title: "Adaptive Questions",
              description: "Questions adapt based on your responses"
            },
            {
              icon: Award,
              title: "Detailed Report",
              description: "Get comprehensive feedback after each session"
            }
          ].map((feature, index) => (
            <Card key={index} className="p-5">
              <feature.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-bold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIInterviewBot;
