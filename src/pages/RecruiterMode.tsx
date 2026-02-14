import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  UserCheck,
  Zap,
  Shield,
  Smile,
  Brain,
  ArrowRight,
  Target,
  Clock,
  Briefcase,
  Flame,
  Sparkles,
} from "lucide-react";

const companies = [
  {
    id: "google",
    name: "Google",
    style: "Structured & Analytical",
    description: "Data-driven interviews with focus on problem-solving, scalability thinking, and Googleyness culture fit",
    color: "from-blue-500 to-green-500",
    tags: ["STAR Method", "System Design", "Culture Fit"],
  },
  {
    id: "amazon",
    name: "Amazon",
    style: "Leadership Principles",
    description: "Deep behavioral dives based on 16 Leadership Principles—Customer Obsession, Ownership, Bias for Action",
    color: "from-orange-500 to-yellow-500",
    tags: ["Leadership Principles", "Bar Raiser", "Dive Deep"],
  },
  {
    id: "meta",
    name: "Meta",
    style: "Move Fast & Impact",
    description: "High-energy interviews focused on impact, speed of execution, and building at scale",
    color: "from-blue-600 to-indigo-500",
    tags: ["Impact Driven", "Scaling", "Collaboration"],
  },
  {
    id: "startup",
    name: "Fast-Paced Startup",
    style: "Scrappy & Versatile",
    description: "Rapid-fire rounds testing adaptability, ownership mentality, and wearing multiple hats",
    color: "from-rose-500 to-pink-500",
    tags: ["Adaptability", "Ownership", "Hustle"],
  },
  {
    id: "consulting",
    name: "Top Consulting Firm",
    style: "Case-Based & Structured",
    description: "Structured case interviews testing analytical frameworks, communication, and executive presence",
    color: "from-emerald-500 to-teal-500",
    tags: ["Case Study", "Frameworks", "Presentation"],
  },
  {
    id: "enterprise",
    name: "Fortune 500 Enterprise",
    style: "Process & Stakeholder",
    description: "Corporate interviews emphasizing cross-functional collaboration, process maturity, and stakeholder management",
    color: "from-slate-500 to-zinc-600",
    tags: ["Stakeholder Mgmt", "Process", "Governance"],
  },
];

const personalities = [
  {
    id: "analytical",
    name: "The Analyst",
    icon: Brain,
    description: "Probes deeply into your logic and reasoning. Expects structured, data-backed answers.",
    trait: "Methodical & detail-oriented",
    pressure: "Medium",
  },
  {
    id: "strict",
    name: "The Gatekeeper",
    icon: Shield,
    description: "No-nonsense, high-bar interviewer. Pushes back on vague answers and expects precision.",
    trait: "Demanding & direct",
    pressure: "High",
  },
  {
    id: "friendly",
    name: "The Coach",
    icon: Smile,
    description: "Warm and encouraging. Creates a comfortable space but still evaluates rigorously.",
    trait: "Supportive & empathetic",
    pressure: "Low",
  },
  {
    id: "highpressure",
    name: "The Stress Tester",
    icon: Flame,
    description: "Rapid-fire questions, interruptions, and curveballs. Tests how you perform under real pressure.",
    trait: "Intense & fast-paced",
    pressure: "Very High",
  },
];

const RecruiterMode = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(companies[0].id);
  const [selectedPersonality, setSelectedPersonality] = useState(personalities[0].id);
  const [selectedQuestions, setSelectedQuestions] = useState(5);

  const questionOptions = [3, 5, 7, 10];
  const company = companies.find((c) => c.id === selectedCompany)!;
  const personality = personalities.find((p) => p.id === selectedPersonality)!;

  const startInterview = () => {
    navigate(
      `/video-interview?type=behavioral&questions=${selectedQuestions}&recruiterMode=true&company=${selectedCompany}&personality=${selectedPersonality}`
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white rounded-2xl p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wOCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Briefcase className="w-8 h-8" />
              </div>
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm text-sm">
                🔥 Recruiter Mode
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Face the Real Recruiter
            </h1>
            <p className="text-xl text-white/90 mb-6 leading-relaxed">
              Simulate company-specific interview rounds with AI interviewers that adapt to different
              hiring styles and personalities. Get ready before the real recruiter ever meets you.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Building2 className="w-4 h-4" /> Company Styles
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <UserCheck className="w-4 h-4" /> Personality Modes
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Zap className="w-4 h-4" /> Readiness Score
              </div>
            </div>
          </div>
        </div>

        {/* Company Selection */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Choose Company Style</h2>
          <p className="text-muted-foreground mb-4">Each company has a unique interview culture. Pick one to simulate.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((c) => (
              <Card
                key={c.id}
                className={`p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  selectedCompany === c.id ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
                }`}
                onClick={() => setSelectedCompany(c.id)}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center mb-3`}>
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold">{c.name}</h3>
                <p className="text-xs font-medium text-primary mb-2">{c.style}</p>
                <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                <div className="flex flex-wrap gap-1">
                  {c.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                {selectedCompany === c.id && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="text-sm font-medium text-primary flex items-center gap-1">
                      Selected <Target className="w-4 h-4" />
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Personality Selection */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Choose Interviewer Personality</h2>
          <p className="text-muted-foreground mb-4">How tough do you want the interviewer to be?</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {personalities.map((p) => (
              <Card
                key={p.id}
                className={`p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  selectedPersonality === p.id ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
                }`}
                onClick={() => setSelectedPersonality(p.id)}
              >
                <p.icon className={`w-8 h-8 mb-3 ${selectedPersonality === p.id ? "text-primary" : "text-muted-foreground"}`} />
                <h3 className="font-bold mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{p.trait}</span>
                  <Badge variant={p.pressure === "Very High" ? "destructive" : p.pressure === "High" ? "default" : "secondary"} className="text-xs">
                    {p.pressure}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Number of Questions</h2>
          <div className="flex flex-wrap gap-3">
            {questionOptions.map((count) => (
              <Button key={count} variant={selectedQuestions === count ? "default" : "outline"} onClick={() => setSelectedQuestions(count)} className="min-w-[80px]">
                {count} Questions
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            <Clock className="w-4 h-4 inline mr-1" />
            Estimated duration: {selectedQuestions * 3}-{selectedQuestions * 5} minutes
          </p>
        </Card>

        {/* Start CTA */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-dashed border-primary/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to Face the Recruiter?</h2>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{company.name}</span> style •{" "}
                <span className="font-medium text-foreground">{personality.name}</span> personality •{" "}
                <span className="font-medium text-foreground">{selectedQuestions} questions</span>
              </p>
            </div>
            <Button size="lg" onClick={startInterview} className="gap-2 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
              <Sparkles className="w-5 h-5" />
              Start Recruiter Interview
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterMode;
