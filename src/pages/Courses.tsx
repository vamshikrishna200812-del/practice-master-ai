import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Award, TrendingUp, PlayCircle } from "lucide-react";

const Courses = () => {
  const courses = [
    {
      title: "Mastering Technical Interviews",
      difficulty: "Intermediate",
      duration: 120,
      progress: 35,
      topics: ["Data Structures", "Algorithms", "Problem Solving"],
      enrolled: true,
    },
    {
      title: "Behavioral Interview Excellence",
      difficulty: "Beginner",
      duration: 90,
      progress: 0,
      topics: ["STAR Method", "Leadership", "Teamwork"],
      enrolled: false,
    },
    {
      title: "System Design Fundamentals",
      difficulty: "Advanced",
      duration: 180,
      progress: 0,
      topics: ["Scalability", "Architecture", "Design Patterns"],
      enrolled: false,
    },
    {
      title: "Communication Skills for Developers",
      difficulty: "Beginner",
      duration: 60,
      progress: 65,
      topics: ["Presentation", "Clarity", "Confidence"],
      enrolled: true,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-hero text-white rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            Learning Courses
          </h1>
          <p className="text-white/90">
            Personalized AI-generated learning paths tailored to your goals
          </p>
        </div>

        {/* Your Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Your Learning Journey
            </h2>
            <Badge variant="secondary">2 Active Courses</Badge>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">35%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">240</div>
              <div className="text-sm text-muted-foreground">Minutes Learned</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">12</div>
              <div className="text-sm text-muted-foreground">Lessons Completed</div>
            </div>
          </div>
        </Card>

        {/* Recommended Learning Path */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            Recommended for You
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={course.difficulty === "Beginner" ? "secondary" : course.difficulty === "Intermediate" ? "default" : "destructive"}>
                        {course.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {course.duration} min
                      </div>
                    </div>
                  </div>
                  {course.enrolled && <PlayCircle className="w-8 h-8 text-primary" />}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {course.topics.map((topic, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-muted rounded">
                      {topic}
                    </span>
                  ))}
                </div>

                {course.enrolled ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <Button className="w-full mt-2">Continue Learning</Button>
                  </div>
                ) : (
                  <Button className="w-full" variant="outline">Enroll Now</Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Courses;