import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Sparkles,
  ArrowRight,
  Brain,
  Code,
  MessageSquare,
  Video,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";

import heroVideo from "@/assets/hero-background.mp4";
import aiRobotVideo from "@/assets/ai-robot.mp4";
import dashboardOwlVideo from "@/assets/dashboard-owl.mp4";
import courseBookVideo from "@/assets/course-book.mp4";
import demoVideo from "@/assets/demo-video.mp4";
import scheduleVideo from "@/assets/schedule-balloons.mp4";
import landingAirplaneVideo from "@/assets/landing-airplane.mp4";

const VideoCrossfade = lazy(() => import("@/components/landing/VideoCrossfade"));

/* ───────────────── Shared liquid-glass class ───────────────── */
const glass =
  "backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.35)] " +
  "[background-image:linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))]";

/* ───────────────── Hero Section ───────────────── */
const HeroSection = () => {
  const heroSources = [heroVideo, landingAirplaneVideo, demoVideo];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
        <VideoCrossfade sources={heroSources} intervalMs={7000} fadeMs={1400} />
      </Suspense>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 md:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 ${glass}`}
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span className="text-sm font-medium text-white/90">
            AI-Powered Interview Training
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-[1.05] max-w-5xl"
        >
          Masterpieces are
          <br />
          made in{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            practice mode
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed"
        >
          Transform your interview skills with AI-powered real-time feedback.
          Master coding, communication, and confidence — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/auth">
            <LoadingButton size="xl" variant="hero" className="w-full sm:w-auto">
              Start Training Free
              <Target className="w-5 h-5" />
            </LoadingButton>
          </Link>
          <a href="#capabilities">
            <Button
              size="lg"
              variant="outline"
              className={`h-14 px-10 text-lg text-white hover:text-white border-white/30 hover:bg-white/15 ${glass}`}
            >
              Explore Capabilities
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 rounded-full bg-white/70"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ───────────────── Capabilities Section ───────────────── */
const capabilities = [
  {
    icon: Video,
    title: "AI Interview Bot",
    desc: "Face-to-face mock interviews with real-time body-language feedback.",
  },
  {
    icon: Code,
    title: "Live Code Assessment",
    desc: "Instant evaluation on accuracy, complexity, and efficiency.",
  },
  {
    icon: MessageSquare,
    title: "Communication Analysis",
    desc: "Track clarity, pace, and confidence across every answer.",
  },
  {
    icon: Brain,
    title: "Behavioral Evaluation",
    desc: "Scenario-driven STAR-method assessments with AI scoring.",
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    desc: "Beautiful trends, streaks, and personalized leveling system.",
  },
  {
    icon: Award,
    title: "Personalized Paths",
    desc: "AI-tailored learning journeys built around your goals.",
  },
];

const CapabilitiesSection = () => {
  const capSources = [aiRobotVideo, dashboardOwlVideo, courseBookVideo, scheduleVideo];

  return (
    <section
      id="capabilities"
      className="relative min-h-screen w-full overflow-hidden bg-black"
    >
      <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
        <VideoCrossfade
          sources={capSources}
          intervalMs={8000}
          fadeMs={1600}
          overlayClassName="bg-gradient-to-b from-black/75 via-black/60 to-black/85"
        />
      </Suspense>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 md:px-16 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 max-w-3xl"
        >
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 ${glass}`}>
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-medium text-white/90">Capabilities</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-5 tracking-tight leading-[1.05]">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-purple-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
              excel
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/75 leading-relaxed">
            A complete AI training studio — from coding drills to communication
            coaching — fused into one liquid experience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl w-full">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6 }}
              className={`group rounded-2xl p-6 ${glass} hover:bg-white/15 transition-colors duration-300`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center mb-4 group-hover:bg-white/25 transition-colors">
                <c.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{c.title}</h3>
              <p className="text-sm text-white/75 leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-14"
        >
          <Link to="/auth">
            <LoadingButton size="xl" variant="hero">
              Begin your journey
              <ArrowRight className="w-5 h-5" />
            </LoadingButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* ───────────────── Page ───────────────── */
const Landing = () => (
  <main className="min-h-screen bg-black text-white">
    <HeroSection />
    <CapabilitiesSection />
  </main>
);

export default Landing;
