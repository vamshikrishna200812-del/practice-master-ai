import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import logo from "@/assets/logo.jpeg";
import { 
  Brain,
  Video, 
  BarChart3, 
  MessageSquare, 
  Target, 
  Award,
  Mic,
  TrendingUp,
  CheckCircle,
  Star,
  Zap,
  Users
} from "lucide-react";

const AnimatedLogo = () => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative flex items-center justify-center mb-12"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-40 h-40 rounded-full border-2 border-primary/30"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-32 h-32 rounded-full border-2 border-primary/50"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
        className="relative z-10 w-24 h-24 rounded-2xl overflow-hidden shadow-2xl"
      >
        <img src={logo} alt="AITRAININGZONE" className="w-full h-full object-cover" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute -bottom-16 text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
          AITRAININGZONE
        </h1>
        <p className="text-muted-foreground mt-2">Your Personal AI Interview Coach</p>
      </motion.div>
    </motion.div>
  );
};

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, type: "spring" }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: delay + 0.2, type: "spring" }}
        className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4"
      >
        <Icon className="w-7 h-7 text-primary" />
      </motion.div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
};

const AnimatedCaption = ({ text, delay }: { text: string; delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2"
    >
      <Zap className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium text-primary">{text}</span>
    </motion.div>
  );
};

const InterviewSimulation = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Asking question...", icon: MessageSquare },
    { label: "Recording response...", icon: Mic },
    { label: "Analyzing answer...", icon: Brain },
    { label: "Generating feedback...", icon: BarChart3 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 rounded-full bg-destructive" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-sm text-muted-foreground">AI Interview Session</span>
      </div>
      
      <div className="space-y-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.label}
            animate={{
              opacity: step >= i ? 1 : 0.3,
              x: step === i ? 10 : 0,
            }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{
                scale: step === i ? [1, 1.2, 1] : 1,
                backgroundColor: step >= i ? "hsl(var(--primary))" : "hsl(var(--muted))",
              }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-lg flex items-center justify-center"
            >
              <s.icon className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className={`text-sm ${step >= i ? "text-foreground" : "text-muted-foreground"}`}>
              {s.label}
            </span>
            {step > i && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const FeedbackMetrics = () => {
  const metrics = [
    { label: "Confidence", value: 85, color: "from-green-500 to-emerald-500" },
    { label: "Clarity", value: 92, color: "from-blue-500 to-cyan-500" },
    { label: "Communication", value: 78, color: "from-purple-500 to-violet-500" },
    { label: "Technical Accuracy", value: 88, color: "from-orange-500 to-amber-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.8, duration: 0.5 }}
      className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Performance Feedback</h3>
      </div>
      
      <div className="space-y-4">
        {metrics.map((metric, i) => (
          <div key={metric.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">{metric.label}</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 + i * 0.2 }}
                className="font-medium text-foreground"
              >
                {metric.value}%
              </motion.span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ delay: 2 + i * 0.2, duration: 1, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ProgressDashboard = () => {
  const badges = [
    { icon: Star, label: "First Interview" },
    { icon: TrendingUp, label: "Improving" },
    { icon: Award, label: "Expert Level" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.5 }}
      className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Your Progress</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.7, type: "spring" }}
          className="text-center"
        >
          <div className="text-3xl font-bold text-primary">24</div>
          <div className="text-xs text-muted-foreground">Interviews</div>
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.8, type: "spring" }}
          className="text-center"
        >
          <div className="text-3xl font-bold text-primary">87%</div>
          <div className="text-xs text-muted-foreground">Avg Score</div>
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.9, type: "spring" }}
          className="text-center"
        >
          <div className="text-3xl font-bold text-primary">12</div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </motion.div>
      </div>

      <div className="flex justify-center gap-4">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3 + i * 0.2 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <badge.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">{badge.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const testimonials = [
  {
    quote: "AITRAININGZONE completely transformed my interview skills. I went from nervous to confident in just 2 weeks!",
    name: "Priya Sharma",
    role: "Software Engineer at Google",
    avatar: "PS",
  },
  {
    quote: "The real-time feedback on my communication and body language was a game-changer. Landed my dream job!",
    name: "Rahul Mehta",
    role: "Product Manager at Microsoft",
    avatar: "RM",
  },
  {
    quote: "Best investment in my career. The AI interviewer feels incredibly realistic and the feedback is spot-on.",
    name: "Ananya Patel",
    role: "Data Scientist at Amazon",
    avatar: "AP",
  },
  {
    quote: "I practiced daily and saw my scores improve dramatically. The progress tracking kept me motivated!",
    name: "Vikram Singh",
    role: "Full Stack Developer at Flipkart",
    avatar: "VS",
  },
];

const TestimonialCard = ({ 
  testimonial, 
  index 
}: { 
  testimonial: typeof testimonials[0]; 
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}
      whileHover={{ scale: 1.03, y: -8 }}
      className="relative bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
    >
      {/* Quote icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={isInView ? { scale: 1, rotate: 0 } : {}}
        transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
        className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg"
      >
        <span className="text-primary-foreground text-2xl font-serif">"</span>
      </motion.div>

      {/* Quote text with typing animation effect */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: index * 0.15 + 0.2, duration: 0.5 }}
        className="text-foreground/90 text-sm leading-relaxed mb-6 mt-4 italic"
      >
        "{testimonial.quote}"
      </motion.p>

      {/* Rating stars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: index * 0.15 + 0.4 }}
        className="flex gap-1 mb-4"
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: index * 0.15 + 0.5 + i * 0.05, type: "spring" }}
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </motion.div>
        ))}
      </motion.div>

      {/* Author info */}
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.35, type: "spring" }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-primary-foreground font-semibold text-sm"
        >
          {testimonial.avatar}
        </motion.div>
        <div>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.15 + 0.4 }}
            className="font-semibold text-foreground text-sm"
          >
            {testimonial.name}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.15 + 0.45 }}
            className="text-xs text-muted-foreground"
          >
            {testimonial.role}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <div ref={sectionRef} className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4"
        >
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Trusted by Thousands</span>
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          What Our Users Say
        </h2>
        <p className="text-muted-foreground">
          Join thousands of professionals who transformed their interview skills
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
        ))}
      </div>
    </div>
  );
};

const CallToAction = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 3.5, duration: 0.5 }}
      className="text-center mt-16"
    >
      <motion.h2
        animate={{ 
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] bg-clip-text text-transparent"
      >
        Start your AI-powered interview journey
      </motion.h2>
      <p className="text-xl text-muted-foreground mb-8">at AITRAININGZONE today.</p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow"
      >
        Get Started Free
      </motion.button>
    </motion.div>
  );
};

export const PromoSection = () => {
  const features = [
    { icon: Video, title: "AI Mock Interviews", description: "Practice with realistic AI-powered interview simulations" },
    { icon: MessageSquare, title: "Real-time Feedback", description: "Get instant insights on your performance" },
    { icon: Target, title: "Difficulty Levels", description: "Progress from beginner to expert questions" },
    { icon: Mic, title: "Voice & Video", description: "Full interview simulation with audio/video" },
    { icon: BarChart3, title: "Detailed Reports", description: "Personalized improvement recommendations" },
    { icon: Users, title: "Expert Coaching", description: "Learn from industry professionals" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0.1 
            }}
            animate={{ 
              y: [null, Math.random() * -200],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity,
              delay: Math.random() * 5 
            }}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Logo Animation */}
        <div className="flex justify-center pt-8 pb-24">
          <AnimatedLogo />
        </div>

        {/* Captions */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <AnimatedCaption text="Practice Anytime" delay={1.2} />
          <AnimatedCaption text="Improve Faster" delay={1.4} />
          <AnimatedCaption text="Your Personal AI Interview Coach" delay={1.6} />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.5 + i * 0.1}
            />
          ))}
        </div>

        {/* Demo Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">See It In Action</h2>
          <p className="text-muted-foreground">Experience the future of interview preparation</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <InterviewSimulation />
          <FeedbackMetrics />
        </div>

        <div className="max-w-md mx-auto mb-16">
          <ProgressDashboard />
        </div>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Call to Action */}
        <CallToAction />
      </div>
    </div>
  );
};
