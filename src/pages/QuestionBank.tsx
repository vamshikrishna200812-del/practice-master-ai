import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Lightbulb, Building2, Laptop, DollarSign, Stethoscope, Briefcase, Star } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  industry: string;
  category: string;
  question: string;
  difficulty: string;
  tips: string | null;
}

const industryIcons: Record<string, React.ElementType> = {
  Tech: Laptop,
  Finance: DollarSign,
  Healthcare: Stethoscope,
  Consulting: Briefcase,
  General: Star,
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  hard: "bg-red-500/20 text-red-400 border-red-500/30",
};

const QuestionBank = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("question_bank")
        .select("*")
        .order("industry", { ascending: true });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const industries = ["all", ...new Set(questions.map((q) => q.industry))];

  const filteredQuestions = questions.filter((q) => {
    const matchesIndustry = selectedIndustry === "all" || q.industry === selectedIndustry;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  const groupedQuestions = filteredQuestions.reduce((acc, q) => {
    if (!acc[q.category]) {
      acc[q.category] = [];
    }
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Question Bank</h1>
            <p className="text-muted-foreground mt-1">
              Browse commonly asked interview questions by industry
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Industry Filter Tabs */}
        <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
            {industries.map((industry) => {
              const IconComponent = industry === "all" ? Building2 : industryIcons[industry] || Building2;
              return (
                <TabsTrigger
                  key={industry}
                  value={industry}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {industry === "all" ? "All Industries" : industry}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={selectedIndustry} className="mt-6">
            {Object.keys(groupedQuestions).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No questions found matching your criteria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="text-xl">{category}</CardTitle>
                      <CardDescription>
                        {categoryQuestions.length} question{categoryQuestions.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="space-y-2">
                        {categoryQuestions.map((question) => (
                          <AccordionItem
                            key={question.id}
                            value={question.id}
                            className="border rounded-lg px-4"
                          >
                            <AccordionTrigger className="hover:no-underline py-4">
                              <div className="flex items-start gap-3 text-left">
                                <span className="flex-1">{question.question}</span>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Badge variant="outline" className="text-xs">
                                    {question.industry}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={difficultyColors[question.difficulty]}
                                  >
                                    {question.difficulty}
                                  </Badge>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                              {question.tips && (
                                <div className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                                  <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-sm mb-1">Pro Tip</p>
                                    <p className="text-sm text-muted-foreground">{question.tips}</p>
                                  </div>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{questions.length}</div>
              <p className="text-sm text-muted-foreground">Total Questions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{industries.length - 1}</div>
              <p className="text-sm text-muted-foreground">Industries</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {new Set(questions.map((q) => q.category)).size}
              </div>
              <p className="text-sm text-muted-foreground">Categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {questions.filter((q) => q.difficulty === "hard").length}
              </div>
              <p className="text-sm text-muted-foreground">Advanced Questions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuestionBank;
