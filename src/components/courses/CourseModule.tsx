import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Award,
  BookOpen,
  Lightbulb,
  Lock,
  AlertCircle,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface LearningObjective {
  id: string;
  title: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface CourseModuleData {
  courseTitle: string;
  learningObjectives: LearningObjective[];
  topicExplanation: string;
  quiz: QuizQuestion[];
}

interface CourseModuleProps {
  moduleData: CourseModuleData;
  onComplete: (passed: boolean, score: number) => void;
  isCompleted: boolean;
}

export const CourseModule = ({ moduleData, onComplete, isCompleted }: CourseModuleProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<"objectives" | "content" | "quiz" | "results">("objectives");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = moduleData.quiz[currentQuestionIndex];
  const totalQuestions = moduleData.quiz.length;

  // Track which questions have been answered
  const answeredQuestions = useMemo(() => {
    return Object.keys(answers).filter(key => answers[key] !== null).length;
  }, [answers]);

  const allQuestionsAnswered = answeredQuestions === totalQuestions;

  // Calculate score
  const score = useMemo(() => {
    let correct = 0;
    moduleData.quiz.forEach(q => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    return Math.round((correct / totalQuestions) * 100);
  }, [answers, moduleData.quiz, totalQuestions]);

  const handleAnswer = (optionIndex: number) => {
    if (answers[currentQuestion.id] !== null && answers[currentQuestion.id] !== undefined) return;
    
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIndex }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions done - check completion gate
      if (allQuestionsAnswered || currentQuestionIndex === totalQuestions - 1) {
        setQuizCompleted(true);
        setCurrentStep("results");
        
        const finalScore = score;
        const passed = finalScore >= 70;
        
        onComplete(passed, finalScore);
        
        if (passed) {
          toast({
            title: "🎉 Module Completed!",
            description: `You scored ${finalScore}% and passed the assessment!`,
          });
        } else {
          toast({
            title: "Keep Learning!",
            description: `You scored ${finalScore}%. Review the material and try again.`,
            variant: "destructive",
          });
        }
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(answers[moduleData.quiz[currentQuestionIndex - 1]?.id] !== null);
    }
  };

  const handleRetakeQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setQuizCompleted(false);
    setCurrentStep("quiz");
  };

  const isCurrentAnswerCorrect = answers[currentQuestion?.id] === currentQuestion?.correctIndex;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">{moduleData.courseTitle}</h3>
            <Badge variant={currentStep === "results" && score >= 70 ? "default" : "secondary"}>
              {currentStep === "objectives" && "Learning Objectives"}
              {currentStep === "content" && "Topic Overview"}
              {currentStep === "quiz" && `Question ${currentQuestionIndex + 1}/${totalQuestions}`}
              {currentStep === "results" && (score >= 70 ? "Passed" : "Review Required")}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Progress 
              value={
                currentStep === "objectives" ? 10 :
                currentStep === "content" ? 25 :
                currentStep === "quiz" ? 25 + (75 * (answeredQuestions / totalQuestions)) :
                100
              } 
              className="h-2"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {answeredQuestions}/{totalQuestions} answered
            </span>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {/* Step 1: Learning Objectives */}
        {currentStep === "objectives" && (
          <motion.div
            key="objectives"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Learning Objectives
                </CardTitle>
                <CardDescription>
                  By the end of this module, you will be able to:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {moduleData.learningObjectives.map((objective, index) => (
                  <motion.div
                    key={objective.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{objective.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{objective.description}</p>
                    </div>
                  </motion.div>
                ))}

                <div className="flex justify-end mt-6">
                  <Button onClick={() => setCurrentStep("content")} className="gap-2">
                    Continue to Overview
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Topic Explanation */}
        {currentStep === "content" && (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Topic Overview
                </CardTitle>
                <CardDescription>
                  Review this comprehensive explanation before taking the assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div 
                    className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: moduleData.topicExplanation.replace(/\n/g, '<br/>') }}
                  />
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button variant="outline" onClick={() => setCurrentStep("objectives")} className="gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Objectives
                  </Button>
                  <Button onClick={() => setCurrentStep("quiz")} className="gap-2">
                    Start Assessment ({totalQuestions} Questions)
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Quiz */}
        {currentStep === "quiz" && currentQuestion && (
          <motion.div
            key={`quiz-${currentQuestionIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {currentQuestion.topic}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                </div>
                <CardTitle className="mt-4 text-xl">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = answers[currentQuestion.id] === index;
                  const isCorrect = index === currentQuestion.correctIndex;
                  const hasAnswered = answers[currentQuestion.id] !== null && answers[currentQuestion.id] !== undefined;

                  return (
                    <motion.button
                      key={index}
                      whileHover={!hasAnswered ? { scale: 1.01 } : {}}
                      whileTap={!hasAnswered ? { scale: 0.99 } : {}}
                      onClick={() => handleAnswer(index)}
                      disabled={hasAnswered}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        hasAnswered
                          ? isCorrect
                            ? "bg-green-500/10 border-green-500 text-foreground"
                            : isSelected
                            ? "bg-red-500/10 border-red-500 text-foreground"
                            : "bg-muted/20 border-border/50 text-muted-foreground"
                          : isSelected
                          ? "bg-primary/10 border-primary"
                          : "bg-muted/30 border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all ${
                          hasAnswered && isCorrect
                            ? "border-green-500 bg-green-500 text-white"
                            : hasAnswered && isSelected && !isCorrect
                            ? "border-red-500 bg-red-500 text-white"
                            : isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/50"
                        }`}>
                          {hasAnswered && isCorrect ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : hasAnswered && isSelected && !isCorrect ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            String.fromCharCode(65 + index)
                          )}
                        </div>
                        <span className="flex-1">{option}</span>
                      </div>
                    </motion.button>
                  );
                })}

                {/* Explanation Panel */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`p-4 rounded-lg mt-4 ${
                        isCurrentAnswerCorrect 
                          ? "bg-green-500/10 border border-green-500/30" 
                          : "bg-amber-500/10 border border-amber-500/30"
                      }`}>
                        <div className="flex items-start gap-3">
                          <Lightbulb className={`w-5 h-5 mt-0.5 ${
                            isCurrentAnswerCorrect ? "text-green-500" : "text-amber-500"
                          }`} />
                          <div>
                            <h4 className={`font-semibold ${
                              isCurrentAnswerCorrect ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                            }`}>
                              {isCurrentAnswerCorrect ? "Correct!" : "Not quite right"}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {currentQuestion.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {moduleData.quiz.map((q, idx) => (
                      <div
                        key={q.id}
                        className={`w-2 h-2 rounded-full transition-all ${
                          answers[q.id] !== null && answers[q.id] !== undefined
                            ? answers[q.id] === q.correctIndex
                              ? "bg-green-500"
                              : "bg-red-500"
                            : idx === currentQuestionIndex
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>

                  <Button 
                    onClick={handleNextQuestion}
                    disabled={answers[currentQuestion.id] === null || answers[currentQuestion.id] === undefined}
                    className="gap-2"
                  >
                    {currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next"}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Results */}
        {currentStep === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className={`border-2 ${score >= 70 ? "border-green-500/50" : "border-amber-500/50"}`}>
              <CardContent className="pt-8 pb-8 text-center">
                <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  score >= 70 ? "bg-green-500/20" : "bg-amber-500/20"
                }`}>
                  {score >= 70 ? (
                    <Award className="w-12 h-12 text-green-500" />
                  ) : (
                    <AlertCircle className="w-12 h-12 text-amber-500" />
                  )}
                </div>

                <h2 className="text-3xl font-bold mb-2">
                  {score >= 70 ? "Congratulations!" : "Keep Practicing!"}
                </h2>

                <p className="text-muted-foreground mb-6">
                  {score >= 70 
                    ? "You've successfully completed this module assessment."
                    : "You need 70% to pass. Review the material and try again."
                  }
                </p>

                <div className="flex justify-center gap-8 mb-8">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${score >= 70 ? "text-green-500" : "text-amber-500"}`}>
                      {score}%
                    </div>
                    <div className="text-sm text-muted-foreground">Your Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-muted-foreground">70%</div>
                    <div className="text-sm text-muted-foreground">Passing Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">
                      {moduleData.quiz.filter(q => answers[q.id] === q.correctIndex).length}/{totalQuestions}
                    </div>
                    <div className="text-sm text-muted-foreground">Correct Answers</div>
                  </div>
                </div>

                {/* Question Summary */}
                <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Question Summary
                  </h4>
                  <div className="space-y-2">
                    {moduleData.quiz.map((q, idx) => {
                      const wasCorrect = answers[q.id] === q.correctIndex;
                      return (
                        <div key={q.id} className="flex items-center gap-3 text-sm">
                          {wasCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-muted-foreground truncate">
                            Q{idx + 1}: {q.question.slice(0, 60)}...
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {score < 70 ? (
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep("content")}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Review Material
                    </Button>
                    <Button onClick={handleRetakeQuiz}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retake Quiz
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                      <Lock className="w-4 h-4" />
                      <span className="font-medium">Completion Gate Passed</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      You answered all {totalQuestions} questions and achieved the passing score.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseModule;
