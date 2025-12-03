import { Loader2, Brain, BarChart3, FileText } from "lucide-react";
import { motion } from "framer-motion";

export const InterviewProcessing = () => {
  const steps = [
    { icon: Brain, label: "Analyzing responses", done: false },
    { icon: BarChart3, label: "Calculating scores", done: false },
    { icon: FileText, label: "Generating report", done: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 max-w-md"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20"
        >
          <Loader2 className="w-12 h-12 text-primary" />
        </motion.div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Analyzing Your Performance
          </h2>
          <p className="text-muted-foreground">
            Our AI is reviewing your responses and generating a detailed feedback report...
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center"
              >
                <step.icon className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-foreground font-medium">{step.label}</span>
              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin ml-auto" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
