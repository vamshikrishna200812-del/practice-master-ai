import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Brain, Code, MessageSquare, Video, Target, TrendingUp, Award,
  ArrowRight, Sparkles, CheckCircle, Users, Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.jpeg";

/* ─────────────────── Hero Section ─────────────────── */
const HeroSection = () => (
  <section className="min-h-screen relative overflow-hidden">
    <Card className="w-full min-h-screen rounded-none border-0 bg-black/[0.96] relative">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" size={400} />

      <div className="flex flex-col md:flex-row min-h-screen w-full">
        {/* Left content */}
        <div className="flex-1 p-8 md:p-16 relative z-10 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/10">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-neutral-300">AI-Powered Interview Training</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
              Masterpieces are
              <br />
              made in{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                practice mode
              </span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-xl leading-relaxed">
              Transform your interview skills with AI-powered real-time feedback.
              Master coding, communication, and confidence — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <LoadingButton size="xl" variant="hero" className="w-full sm:w-auto">
                  Start Training Free
                  <Target className="w-5 h-5" />
                </LoadingButton>
              </Link>
              <a href="#features-section">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-lg bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 transition-all duration-200"
                >
                  Explore Features
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right 3D scene */}
        <div className="flex-1 relative min-h-[400px] md:min-h-0">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  </section>
);

/* ─────────────────── Stats Bar ─────────────────── */
const stats = [
  { value: "10K+", label: "Active Learners", icon: Users },
  { value: "50K+", label: "Mock Interviews", icon: Video },
  { value: "95%", label: "Success Rate", icon: CheckCircle },
  { value: "24/7", label: "AI Availability", icon: Zap },
];

const StatsSection = () => (
  <section className="py-16 px-4 bg-muted/30 border-y border-border/50">
    <div className="container mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="text-center"
          >
            <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────── Features ─────────────────── */
const features = [
  { icon: Video, title: "AI-Powered Interview Bot", description: "Face-to-face AI interviews with real-time feedback on body language and confidence" },
  { icon: Code, title: "Live Code Assessment", description: "Real-time code evaluation with instant feedback on accuracy and efficiency" },
  { icon: MessageSquare, title: "Communication Analysis", description: "Track clarity, pace, and confidence in your responses" },
  { icon: Brain, title: "Behavioral Evaluation", description: "Scenario-based assessments to evaluate situational responses" },
  { icon: TrendingUp, title: "Progress Tracking", description: "Monitor your improvement with detailed analytics and trends" },
  { icon: Award, title: "Personalized Learning", description: "AI-generated learning paths tailored to your strengths and weaknesses" },
];

const FeaturesSection = () => (
  <section id="features-section" className="py-24 px-4 bg-background">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need to Excel</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive AI-powered tools to master every aspect of interviews
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-200 bg-card border-border/50 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────── Steps ─────────────────── */
const steps = [
  { number: "01", title: "Create Your Account", description: "Sign up in seconds and access your personalized dashboard" },
  { number: "02", title: "Choose Your Path", description: "Select from coding, behavioral, or comprehensive interview tracks" },
  { number: "03", title: "Practice with AI", description: "Engage in realistic interview simulations with instant feedback" },
  { number: "04", title: "Track & Improve", description: "Monitor progress and follow personalized learning recommendations" },
];

const StepsSection = () => (
  <section className="py-24 px-4 bg-muted/20">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Your Journey to Success</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Four simple steps to transform your interview performance
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Card className="p-6 h-full relative overflow-hidden bg-card border-border/50">
              <div className="absolute -top-4 -right-2 text-8xl font-black text-primary/10 select-none pointer-events-none">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 relative z-10">{step.title}</h3>
              <p className="text-muted-foreground relative z-10">{step.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────── CTA ─────────────────── */
const CTASection = () => (
  <section className="py-24 px-4 bg-gradient-hero relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary-glow)/0.3),transparent_70%)]" />
    <div className="container mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
          Ready to Master Your Interviews?
        </h2>
        <p className="text-xl text-primary-foreground/90 mb-10">
          Join thousands of successful candidates who transformed their interview skills with AITRAININGZONE
        </p>
        <Link to="/auth">
          <LoadingButton size="xl" variant="hero">
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </LoadingButton>
        </Link>
      </motion.div>
    </div>
  </section>
);

/* ─────────────────── Footer ─────────────────── */
const Footer = () => (
  <footer className="py-8 px-4 border-t bg-card">
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="AITRAININGZONE" className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-bold text-foreground">AITRAININGZONE</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AITRAININGZONE. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

/* ─────────────────── Page ─────────────────── */
const Home = () => (
  <div className="min-h-screen">
    <HeroSection />
    <StatsSection />
    <FeaturesSection />
    <StepsSection />
    <CTASection />
    <Footer />
  </div>
);

export default Home;
