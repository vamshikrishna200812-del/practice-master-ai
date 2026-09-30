import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, AudioLines, Check, ChevronDown, Code2, FileText, Menu, Mic2, Play, Sparkles, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import interviewer from "@/assets/professional-interviewer.png";

const navItems = [
  { label: "Practice", href: "#practice" },
  { label: "Feedback", href: "#features" },
  { label: "Roles", href: "#tracks" },
  { label: "Pricing", href: "#start" },
  { label: "FAQ", href: "#faq" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="landing-nav" aria-label="Main navigation">
      <a className="landing-brand" href="#top" aria-label="AITRAININGZONE home">
        <span className="landing-brand-mark"><Sparkles aria-hidden="true" /></span>
        <span>AI<span className="landing-brand-light">TRAINING</span>ZONE</span>
      </a>
      <nav className={`landing-nav-links${menuOpen ? " is-open" : ""}`} aria-label="Sections">
        {navItems.map((item) => (
          <a href={item.href} key={item.label} onClick={() => setMenuOpen(false)}>{item.label}</a>
        ))}
        <Link className="landing-mobile-start" to="/auth" onClick={() => setMenuOpen(false)}>Get started <ArrowRight size={15} /></Link>
      </nav>
      <Link className="landing-nav-cta" to="/auth">Get started <ArrowUpRight size={15} /></Link>
      <Button className="landing-menu-toggle" variant="ghost" size="icon" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X /> : <Menu />}
      </Button>
    </header>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    heroRef.current.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
  };

  return (
    <section ref={heroRef} id="top" className="landing-hero" onPointerMove={onPointerMove}>
      <div className="landing-hero-grain" aria-hidden="true" />
      <div className="landing-hero-inner">
        <motion.div className="landing-hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <div className="landing-eyebrow"><span className="landing-eyebrow-dot" /> BUILT FOR YOUR NEXT BIG YES</div>
          <h1>Interviews that<br /><span>train back.</span></h1>
          <p className="landing-hero-lede">Turn nervous into confident. An AI interviewer that adapts to your role, listens to your answers and scores you in real time.</p>
          <div className="landing-hero-actions">
            <a className="landing-button landing-button-light" href="#practice">See how it works <ArrowDown size={16} /></a>
            <Link className="landing-button landing-button-glass" to="/auth">Start practicing <ArrowRight size={16} /></Link>
          </div>
          <div className="landing-trust-row">
            <div className="landing-avatar-stack" aria-hidden="true">
              <img src={interviewer} alt="" />
              <span className="landing-avatar initials-one">S</span>
              <span className="landing-avatar initials-two">A</span>
              <span className="landing-avatar initials-three">R</span>
            </div>
            <span>Trusted by <strong>4,000+</strong> students</span>
          </div>
        </motion.div>

        <motion.div className="landing-session" initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
          <div className="landing-session-top"><span className="landing-session-label"><span className="landing-live-dot" /> LIVE SESSION</span><span className="landing-session-time">00:42</span></div>
          <div className="landing-interviewer-image"><img src={interviewer} alt="AI interview coach on a video call" /><span className="landing-camera-chip"><Video size={13} /> Video on</span><span className="landing-soundwave"><AudioLines size={17} /> Listening</span></div>
          <div className="landing-session-question"><span>YOUR QUESTION</span><strong>“Tell me about yourself.”</strong></div>
          <div className="landing-session-controls"><span className="landing-mic"><Mic2 size={17} /></span><span className="landing-listening">Listening to your answer<span className="landing-wave-bars"><i /><i /><i /><i /><i /></span></span><span className="landing-recording-dot" /></div>
          <div className="landing-session-progress"><span /><span /><span /><span /></div>
          <div className="landing-feedback-chip"><span><Check size={13} /></span> Feedback ready in 2s</div>
        </motion.div>
      </div>
      <a className="landing-scroll-cue" href="#practice"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
    </section>
  );
}

const practiceModes = [
  { number: "01", title: "HR Round", detail: "Behavioral questions, STAR method coaching", tag: "PEOPLE & PRESENCE", icon: Mic2, className: "hr" },
  { number: "02", title: "Technical", detail: "DSA, core CS and ECE/IT fundamentals", tag: "THINK & SOLVE", icon: Code2, className: "technical" },
  { number: "03", title: "Mock Panel", detail: "Multi-interviewer simulation", tag: "THE REAL THING", icon: Video, className: "panel" },
];

function PracticeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const titleX = useTransform(scrollYProgress, [0, 1], ["5%", "-34%"]);
  const reduced = useReducedMotion();
  return (
    <section className="landing-practice" id="practice" ref={sectionRef}>
      <div className="landing-practice-sticky">
        <div className="landing-practice-heading"><span className="landing-kicker">01 / THE PRACTICE FLOOR</span><span className="landing-practice-side">A better kind of rehearsal<br />starts right here.</span></div>
        <motion.div className="landing-practice-marquee" style={reduced ? undefined : { x: titleX }} aria-hidden="true">Practice that works <span>Practice that works</span></motion.div>
        <div className="landing-mode-grid">
          {practiceModes.map((mode, index) => (
            <motion.article className={`landing-mode-card mode-${mode.className}`} key={mode.number} style={reduced ? undefined : { y: useTransform(scrollYProgress, [0, 0.55, 1], [index === 1 ? 16 : 40, 0, index === 1 ? -10 : -28]), rotate: useTransform(scrollYProgress, [0, 0.55, 1], [index === 1 ? 1 : index === 0 ? -3 : 3, 0, 0]) }}>
              <div className="landing-mode-top"><span>{mode.number} — {mode.tag}</span><mode.icon size={19} strokeWidth={1.7} /></div>
              <div className={`landing-mode-art art-${mode.className}`} aria-hidden="true"><div className="landing-art-ring ring-one" /><div className="landing-art-ring ring-two" /><div className="landing-art-orb"><mode.icon size={42} strokeWidth={1.25} /></div><span className="landing-art-caption">PRACTICE / REPEAT / GROW</span></div>
              <h3>{mode.title}</h3><p>{mode.detail}</p>
              <a href="#start" aria-label={`Start ${mode.title} practice`}>Enter the room <ArrowRight size={15} /></a>
            </motion.article>
          ))}
        </div>
        <a className="landing-dark-pill" href="#tracks">Explore all modes <ArrowRight size={15} /></a>
      </div>
    </section>
  );
}

function BeyondSection() {
  const starRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: starRef, offset: ["start end", "end start"] });
  const leftX = useTransform(scrollYProgress, [0, 1], ["0%", "-13%"]);
  const rightX = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const rotation = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  const reduceMotion = useReducedMotion();
  return (
    <section className="landing-beyond" id="beyond" ref={starRef}>
      <div className="landing-beyond-meta"><span className="landing-kicker">02 / THE DIFFERENCE</span><span>TRAINING THAT MEETS YOU WHERE YOU ARE</span></div>
      <motion.h2 className="landing-beyond-word beyond-first" style={reduceMotion ? undefined : { x: leftX }}>Beyond</motion.h2>
      <div className="landing-beyond-center">
        <div className="landing-beyond-copy"><p>AITRAININGZONE is an AI interview engine that listens, analyzes tone, content and confidence, and coaches you instantly.</p><p>Any role. Any company.<br /><strong>Unlimited attempts.</strong></p></div>
        <motion.div className="landing-fourpoint-star" style={reduceMotion ? undefined : { rotate: rotation }} aria-label="Four-point star" role="img"><Sparkles strokeWidth={0.75} /></motion.div>
        <span className="landing-beyond-note">YOUR OWN<br />PRACTICE SPACE</span>
      </div>
      <motion.h2 className="landing-beyond-word beyond-last" style={reduceMotion ? undefined : { x: rightX }}>every limit<span>.</span></motion.h2>
    </section>
  );
}

const tracks = [
  { title: "Campus\nPlacements", type: "EARLY CAREER", hue: "campus", num: "01" },
  { title: "Software\nEngineer", type: "ENGINEERING", hue: "software", num: "02" },
  { title: "Data & AI", type: "EMERGING TECH", hue: "data", num: "03" },
  { title: "Core ECE", type: "CORE ENGINEERING", hue: "ece", num: "04" },
  { title: "Management\n/ HR", type: "BUSINESS & PEOPLE", hue: "management", num: "05" },
];

function TracksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  useEffect(() => {
    const measure = () => setTravel(Math.max(0, (railRef.current?.scrollWidth ?? 0) - window.innerWidth + 80));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return (
    <section id="tracks" className="landing-tracks-section" ref={sectionRef}>
      <div className="landing-tracks-sticky">
        <div className="landing-tracks-heading"><div><span className="landing-kicker">03 / MADE FOR YOUR NEXT MOVE</span><h2>Selected tracks<span>.</span></h2></div><div className="landing-track-counter"><span>01</span> / 05</div></div>
        <div className="landing-track-window"><motion.div className="landing-track-rail" ref={railRef} style={{ x }}>
          {tracks.map((track) => <article className={`landing-track-card track-${track.hue}`} key={track.num}><div className="landing-track-blob" aria-hidden="true" /><span className="landing-track-index">{track.num} / TRACK</span><span className="landing-track-type">{track.type}</span><h3>{track.title.split("\n").map((part) => <span key={part}>{part}</span>)}</h3><a href="#start">View track <ArrowRight size={15} /></a></article>)}
          <article className="landing-track-card landing-track-all"><Sparkles size={29} strokeWidth={1.3} /><span className="landing-track-type">YOUR NEXT CHAPTER</span><h3>See all<br />tracks.</h3><a href="#start">Open library <ArrowRight size={15} /></a></article>
        </motion.div></div>
        <div className="landing-track-foot"><span>FIND YOUR FIT. THEN FIND YOUR FLOW.</span><span><span className="landing-track-progress"><i style={{ transform: `scaleX(${0.15 + (travel > 0 ? 0.85 : 0)})` }} /></span> SCROLL TO EXPLORE <ArrowRight size={14} /></span></div>
      </div>
    </section>
  );
}

function Counter({ value, suffix, prefix = "", label }: { value: number; suffix: string; prefix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.7 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${prefix}${Math.round(latest).toLocaleString()}${suffix}`);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!visible) return;
    if (reduced) { count.set(value); return; }
    const controls = animate(count, value, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [visible, reduced, count, value]);
  return <div className="landing-stat" ref={ref}><motion.strong>{rounded}</motion.strong><span>{label}</span></div>;
}

const features = [
  { icon: AudioLines, title: "Real-time feedback", text: "Know what landed, while it still matters." },
  { icon: Video, title: "Voice + video analysis", text: "Practice your presence, not just your answers." },
  { icon: FileText, title: "Resume-based questions", text: "Make every question feel like it’s for you." },
  { icon: Code2, title: "Progress analytics", text: "See the small wins add up to big change." },
];

function FeaturesSection() {
  return (
    <section className="landing-features" id="features">
      <div className="landing-features-inner">
        <div className="landing-stats-row"><Counter value={50} suffix="k+" label="mock interviews" /><Counter value={92} suffix="%" label="feel more confident" /><Counter value={2} prefix="<" suffix="s" label="feedback latency" /></div>
        <div className="landing-feature-heading"><span className="landing-kicker">04 / THE ADVANTAGE</span><h2>Less guessing.<br /><span>More becoming.</span></h2><p>Practice that pays attention to the details that make you, you.</p></div>
        <div className="landing-feature-grid">{features.map((feature, index) => <article className={`landing-feature-card feature-${index + 1}`} key={feature.title}><div className="landing-feature-icon"><feature.icon size={18} strokeWidth={1.6} /></div><span className="landing-feature-index">0{index + 1}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
        <div id="faq" className="landing-faq"><span className="landing-kicker">A FEW QUICK ANSWERS</span><details><summary>Can I practice for different roles? <ChevronDown size={16} /></summary><p>Yes. Explore the available tracks and choose the kind of interview you want to practice.</p></details><details><summary>Do I need to be ready before I start? <ChevronDown size={16} /></summary><p>Not at all. Use practice to build confidence at your own pace, with as many attempts as you need.</p></details><details><summary>Can I try it for free? <ChevronDown size={16} /></summary><p>Yes. Start practicing without a card.</p></details></div>
      </div>
    </section>
  );
}

function FinalCallout() {
  const reduced = useReducedMotion();
  return (
    <section className="landing-final" id="start">
      <div className="landing-final-glow" aria-hidden="true" />
      <div className="landing-final-content"><span className="landing-kicker">YOUR NEXT ANSWER STARTS HERE</span><h2>Build confidence<br /><span>beyond every limit.</span></h2><p>Start free. No card required.</p><Link className="landing-button landing-button-light" to="/auth">Get started <ArrowRight size={16} /></Link><span className="landing-final-note">No card required · Free while you evaluate</span></div>
      <motion.div className="landing-liquid-star" aria-hidden="true" animate={reduced ? undefined : { rotate: 360 }} transition={{ duration: 38, ease: "linear", repeat: Infinity }}><Sparkles strokeWidth={0.5} /></motion.div>
      <div className="landing-final-caption"><span>YOUR VOICE.</span><span>YOUR NEXT CHAPTER.</span></div>
    </section>
  );
}

function Footer() {
  const columns = [
    { title: "PRODUCT", links: [["Practice", "#practice"], ["Feedback", "#features"], ["Roles", "#tracks"], ["Pricing", "#start"]] },
    { title: "STUDIO", links: [["About", "#beyond"], ["Process", "#practice"], ["Careers", "#footer"], ["Contact", "#footer"]] },
    { title: "RESOURCES", links: [["Docs", "#faq"], ["Templates", "#tracks"], ["Status", "#footer"]] },
    { title: "LEGAL", links: [["Privacy", "#footer"], ["Terms", "#footer"]] },
  ];
  return (
    <footer className="landing-footer" id="footer">
      <div className="landing-footer-top"><a href="#top" className="landing-footer-wordmark">AITRAININGZONE<span className="landing-footer-sparkle"><Sparkles size={25} /></span></a><div className="landing-footer-tagline">Interviews that train back.</div></div>
      <div className="landing-footer-links">{columns.map((column) => <div key={column.title}><span className="landing-footer-label">{column.title}</span>{column.links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div>)}</div>
      <div className="landing-footer-bottom"><span>© {new Date().getFullYear()} AITRAININGZONE</span><span>Built with AI · No trackers <Sparkles size={13} /></span></div>
    </footer>
  );
}

export default function Home() {
  return <main className="landing-page"><Navbar /><Hero /><PracticeSection /><BeyondSection /><TracksSection /><FeaturesSection /><FinalCallout /><Footer /></main>;
}