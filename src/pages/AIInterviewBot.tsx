import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mic, 
  MicOff, 
  Send,
  Brain,
  Code,
  MessageSquare,
  Eye,
  Award,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { CameraFeed } from "@/components/camera/CameraFeed";

const AIInterviewBot = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [scores, setScores] = useState({
    bodyLanguage: 0,
    communication: 0,
    codingAccuracy: 0,
  });

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm your AI interviewer. I'll be conducting a comprehensive interview to assess your skills. Let's start with a simple question: Can you tell me about yourself and your experience?"
      }
    ]);
  }, []);

  const handleStreamReady = (stream: MediaStream) => {
    setIsCameraActive(true);
    toast.success("Camera ready for interview");
  };

  const handleStreamStop = () => {
    setIsCameraActive(false);
    setIsRecording(false);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success("Recording started - Answer the question");
      // Simulate score updates
      setTimeout(() => {
        setScores({
          bodyLanguage: Math.floor(Math.random() * 30) + 70,
          communication: Math.floor(Math.random() * 30) + 70,
          codingAccuracy: Math.floor(Math.random() * 30) + 70,
        });
      }, 2000);
    } else {
      toast.success("Recording stopped");
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great answer! Now, let's move to a coding question: Can you implement a function to reverse a linked list?",
        "Interesting approach. Can you explain your thought process for handling edge cases?",
        "Excellent! Let's discuss a behavioral scenario: Tell me about a time you faced a difficult technical challenge.",
        "Good communication! How would you optimize this solution for better performance?",
      ];
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: responses[Math.floor(Math.random() * responses.length)]
      }]);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-hero text-white rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Brain className="w-8 h-8" />
            AI Interview Bot - Face-to-Face Practice
          </h1>
          <p className="text-white/90">
            Practice with our advanced AI interviewer that evaluates your coding, communication, and body language in real-time
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video & Chat Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Camera Feed Component */}
            <CameraFeed 
              onStreamReady={handleStreamReady}
              onStreamStop={handleStreamStop}
            />

            {/* Recording Control */}
            {isCameraActive && (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-muted"}`} />
                    <span className="font-medium">
                      {isRecording ? "Recording your response..." : "Ready to record"}
                    </span>
                  </div>
                  <Button
                    variant={isRecording ? "destructive" : "default"}
                    onClick={toggleRecording}
                    className="gap-2"
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </Button>
                </div>
              </Card>
            )}

            {/* Chat Interface */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Interview Conversation</h2>
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your answer or speak using the microphone..."
                  className="min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button onClick={sendMessage} size="lg">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Real-time Scores */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Real-time Scores
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Body Language</span>
                  </div>
                  <Progress value={scores.bodyLanguage} className="h-2 mb-1" />
                  <div className="text-sm text-muted-foreground">{scores.bodyLanguage}/100</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium">Communication</span>
                  </div>
                  <Progress value={scores.communication} className="h-2 mb-1" />
                  <div className="text-sm text-muted-foreground">{scores.communication}/100</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">Coding Accuracy</span>
                  </div>
                  <Progress value={scores.codingAccuracy} className="h-2 mb-1" />
                  <div className="text-sm text-muted-foreground">{scores.codingAccuracy}/100</div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Overall Score</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {Math.floor((scores.bodyLanguage + scores.communication + scores.codingAccuracy) / 3)}/100
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-3">Tips for Success</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Maintain eye contact with the camera</li>
                <li>• Sit upright with good posture</li>
                <li>• Speak clearly and at a moderate pace</li>
                <li>• Think aloud during coding problems</li>
                <li>• Ask clarifying questions when needed</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIInterviewBot;