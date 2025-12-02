import DashboardLayout from "@/components/layout/DashboardLayout";
import { AIVideoInterview } from "@/components/interview/AIVideoInterview";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Code, MessageSquare } from "lucide-react";

const VideoInterview = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-hero text-white rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Brain className="w-8 h-8" />
            AI Video Interview
          </h1>
          <p className="text-white/90">
            Practice with our AI interviewer featuring real-time video, speech recognition, 
            and instant feedback on your performance.
          </p>
        </div>

        <Tabs defaultValue="behavioral" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="behavioral" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Behavioral
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="coding" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Coding
            </TabsTrigger>
          </TabsList>

          <TabsContent value="behavioral">
            <AIVideoInterview 
              interviewType="behavioral" 
              totalQuestions={5}
              onComplete={(report) => console.log("Interview complete:", report)}
            />
          </TabsContent>

          <TabsContent value="technical">
            <AIVideoInterview 
              interviewType="technical" 
              totalQuestions={5}
              onComplete={(report) => console.log("Interview complete:", report)}
            />
          </TabsContent>

          <TabsContent value="coding">
            <AIVideoInterview 
              interviewType="coding" 
              totalQuestions={5}
              onComplete={(report) => console.log("Interview complete:", report)}
            />
          </TabsContent>
        </Tabs>

        <Card className="p-6 bg-muted/50">
          <h3 className="font-bold mb-3">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-primary">1</span>
              </div>
              <p className="text-muted-foreground">Enable your camera and microphone</p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-primary">2</span>
              </div>
              <p className="text-muted-foreground">AI interviewer asks you questions</p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-primary">3</span>
              </div>
              <p className="text-muted-foreground">Speak your answers naturally</p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-primary">4</span>
              </div>
              <p className="text-muted-foreground">Get instant AI feedback and report</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VideoInterview;
