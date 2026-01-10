import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { BentoGrid, BentoCard, BentoFeature } from "@/components/ui/bento-grid";
import { Brain, Code, MessageSquare, Video, Zap, Target, TrendingUp, Award, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBackground from "@/assets/hero-background.mp4";
import landingAirplane from "@/assets/landing-airplane.mp4";

/**
 * Home Page - Professional Architect Implementation
 * Features: Bento Box layout, consistent transitions (0.2s ease-in-out),
 * proper visual hierarchy, and micro-interactions
 */

const Home = () => {
  // Feature data for Bento Grid
  const features = [{
    icon: <Video className="w-6 h-6 text-primary-foreground" />,
    title: "AI-Powered Interview Bot",
    description: "Face-to-face AI interviews with real-time feedback on body language and confidence",
    span: "feature" // 2-column span
  }, {
    icon: <Code className="w-6 h-6 text-primary-foreground" />,
    title: "Live Code Assessment",
    description: "Real-time code evaluation with instant feedback on accuracy and efficiency"
  }, {
    icon: <MessageSquare className="w-6 h-6 text-primary-foreground" />,
    title: "Communication Analysis",
    description: "Track clarity, pace, and confidence in your responses"
  }, {
    icon: <Brain className="w-6 h-6 text-primary-foreground" />,
    title: "Behavioral Evaluation",
    description: "Scenario-based assessments to evaluate situational responses"
  }, {
    icon: <TrendingUp className="w-6 h-6 text-primary-foreground" />,
    title: "Progress Tracking",
    description: "Monitor your improvement with detailed analytics and trends",
    span: "feature"
  }, {
    icon: <Award className="w-6 h-6 text-primary-foreground" />,
    title: "Personalized Learning",
    description: "AI-generated learning paths tailored to your strengths and weaknesses"
  }];

  // Steps data
  const steps = [{
    number: "01",
    title: "Create Your Account",
    description: "Sign up in seconds and access your personalized dashboard"
  }, {
    number: "02",
    title: "Choose Your Path",
    description: "Select from coding, behavioral, or comprehensive interview tracks"
  }, {
    number: "03",
    title: "Practice with AI",
    description: "Engage in realistic interview simulations with instant feedback"
  }, {
    number: "04",
    title: "Track & Improve",
    description: "Monitor progress and follow personalized learning recommendations"
  }];
  return <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center py-24 px-4">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src={heroBackground} type="video/mp4" />
          </video>
          
          {/* Paper Airplane Animation - Top Right */}
          <div className="absolute top-8 right-8 w-64 h-36 z-10 opacity-80 pointer-events-none">
            <video autoPlay loop muted playsInline className="w-full h-full object-contain">
              <source src={landingAirplane} type="video/mp4" />
            </video>
          </div>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>
        
        <div className="container mx-auto relative z-10 text-white">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }} className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.3,
            delay: 0.1
          }} className="inline-flex items-center gap-2 bg-background/95 backdrop-blur-sm rounded-full px-4 py-2 mb-8 shadow-lg border border-border/20">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-destructive">AI-Powered Interview Training</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
              Masterpieces are made
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">in practice mode</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Transform your interview skills with AI-powered real-time feedback.
              Master coding, communication, and confidence.
            </p>

            {/* CTA Buttons */}
            <motion.div initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3,
            delay: 0.2
          }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <LoadingButton size="xl" variant="hero" className="w-full sm:w-auto">
                  Start Training Free
                  <Target className="w-5 h-5" />
                </LoadingButton>
              </Link>
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-black transition-all duration-200 ease-in-out">
                  Watch Demo
                  <Video className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.3,
            delay: 0.4
          }} className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/80">
              {["No credit card required", "Cancel anytime", "Join 10,000+ users"].map((item, i) => <div key={i} className="flex items-center gap-2 text-sm backdrop-blur-sm bg-white/5 rounded-full px-4 py-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{item}</span>
                </div>)}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Journey Steps Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Journey to Success
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to transform your interview performance
            </p>
          </motion.div>

          <BentoGrid className="lg:grid-cols-4">
            {steps.map((step, index) => <BentoCard key={index} title={step.title} description={step.description} index={index} className="relative overflow-hidden">
                {/* Step number watermark */}
                <div className="absolute -top-4 -right-2 text-8xl font-black text-primary/10 select-none pointer-events-none">
                  {step.number}
                </div>
              </BentoCard>)}
          </BentoGrid>
        </div>
      </section>

      {/* Features Bento Grid Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive AI-powered tools to master every aspect of interviews
            </p>
          </motion.div>

          <BentoGrid>
            {features.map((feature, index) => feature.span === "feature" ? <BentoFeature key={index} title={feature.title} description={feature.description} icon={feature.icon} index={index} /> : <BentoCard key={index} title={feature.title} description={feature.description} icon={feature.icon} index={index} />)}
          </BentoGrid>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary-glow)/0.3),transparent_70%)]" />
        
        <div className="container mx-auto relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }} className="text-center max-w-3xl mx-auto">
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

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-card">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <span className="font-bold">AITRAININGZONE</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AITRAININGZONE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Home;