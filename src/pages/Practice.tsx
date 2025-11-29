import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Code, Play, CheckCircle, XCircle, Trophy, Timer } from "lucide-react";
import { toast } from "sonner";

const Practice = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(`// Write your solution here\nfunction reverseString(str) {\n  // Your code here\n}\n\nconsole.log(reverseString("hello"));`);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; test: string }>>([]);

  const problems = [
    {
      title: "Reverse a String",
      difficulty: "Easy",
      description: "Write a function that reverses a string. The input string is given as an array of characters.",
      examples: [
        { input: '"hello"', output: '"olleh"' },
        { input: '"world"', output: '"dlrow"' },
      ],
    },
  ];

  const runCode = () => {
    setIsRunning(true);
    setOutput("");
    
    setTimeout(() => {
      try {
        // This is a simplified simulation
        const results = [
          { passed: true, test: "Test 1: Basic string" },
          { passed: true, test: "Test 2: Empty string" },
          { passed: false, test: "Test 3: Special characters" },
          { passed: true, test: "Test 4: Long string" },
        ];
        
        setTestResults(results);
        setOutput("Code execution completed\nTotal tests: 4\nPassed: 3\nFailed: 1");
        
        const passed = results.filter(r => r.passed).length;
        if (passed === results.length) {
          toast.success("All tests passed! 🎉");
        } else {
          toast.warning(`${passed}/${results.length} tests passed`);
        }
      } catch (error: any) {
        setOutput(`Error: ${error.message}`);
        toast.error("Code execution failed");
      } finally {
        setIsRunning(false);
      }
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-hero text-white rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Code className="w-8 h-8" />
            Code Practice & Examination
          </h1>
          <p className="text-white/90">
            Sharpen your coding skills with real-time feedback and test cases
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Problem Description */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Current Problem
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{problems[0].title}</h3>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-600 rounded">
                    {problems[0].difficulty}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {problems[0].description}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Examples:</h4>
                {problems[0].examples.map((example, index) => (
                  <div key={index} className="bg-muted p-3 rounded mb-2 text-sm">
                    <div><strong>Input:</strong> {example.input}</div>
                    <div><strong>Output:</strong> {example.output}</div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  Time Spent
                </h4>
                <div className="text-2xl font-bold text-primary">05:23</div>
              </div>
            </div>
          </Card>

          {/* Code Editor */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Code Editor</h2>
              <div className="flex items-center gap-2">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={runCode} disabled={isRunning} className="gap-2">
                  <Play className="w-4 h-4" />
                  {isRunning ? "Running..." : "Run Code"}
                </Button>
              </div>
            </div>

            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm min-h-[300px] mb-4"
              placeholder="Write your code here..."
            />

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-2 mb-4">
                <h3 className="font-bold">Test Results:</h3>
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded ${
                      result.passed ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {result.passed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm">{result.test}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Output Console */}
            <div>
              <h3 className="font-bold mb-2">Output:</h3>
              <div className="bg-muted p-4 rounded min-h-[100px] font-mono text-sm">
                {output || "Run your code to see output..."}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Practice;