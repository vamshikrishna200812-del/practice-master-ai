import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { HelpCircle, MessageSquare, BookOpen, Mail } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Help = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-gradient-hero text-white rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <HelpCircle className="w-8 h-8" />
            Help & Support
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground">Chat with our support team</p>
          </Card>
          <Card className="p-6 text-center">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold mb-2">Documentation</h3>
            <p className="text-sm text-muted-foreground">Browse our guides</p>
          </Card>
          <Card className="p-6 text-center">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground">support@aitrainingzone.com</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I start an AI interview?</AccordionTrigger>
              <AccordionContent>Go to Dashboard and click "Start AI Interview" or navigate to the Interview Bot page from the menu.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How are my scores calculated?</AccordionTrigger>
              <AccordionContent>Scores are based on coding accuracy, communication clarity, and body language confidence using AI analysis.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I schedule classes with instructors?</AccordionTrigger>
              <AccordionContent>Yes! Go to the Schedule page to book one-on-one sessions with expert instructors.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Help;