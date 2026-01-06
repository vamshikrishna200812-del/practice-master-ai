import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Award, Share2, X, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CourseCertificateProps {
  courseName: string;
  courseId: string;
  userName: string;
  completionDate: string;
  onClose: () => void;
}

const CourseCertificate = ({
  courseName,
  courseId,
  userName,
  completionDate,
  onClose,
}: CourseCertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [certificateId, setCertificateId] = useState("");

  const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Generate or fetch certificate ID on mount
  useEffect(() => {
    const initCertificate = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if certificate already exists
        const { data: existingCert } = await supabase
          .from("certificates")
          .select("certificate_id")
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .maybeSingle();

        if (existingCert) {
          setCertificateId(existingCert.certificate_id);
        } else {
          // Generate new certificate ID
          const newCertId = `CERT-${Date.now().toString(36).toUpperCase()}`;
          
          // Save to database
          const { error } = await supabase
            .from("certificates")
            .insert({
              certificate_id: newCertId,
              user_id: user.id,
              course_id: courseId,
              user_name: userName,
              course_title: courseName,
              completion_date: completionDate,
            });

          if (!error) {
            setCertificateId(newCertId);
          }
        }
      } catch (error) {
        console.error("Error initializing certificate:", error);
        // Fallback to local ID
        setCertificateId(`CERT-${Date.now().toString(36).toUpperCase()}`);
      }
    };

    initCertificate();
  }, [courseId, userName, courseName, completionDate]);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Create a canvas from the certificate
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certificateRef.current!, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      
      // Convert to image and download
      const link = document.createElement('a');
      link.download = `${courseName.replace(/\s+/g, '-')}-Certificate.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Certificate downloaded!",
        description: "Your certificate has been saved as an image.",
      });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast({
        title: "Download failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Certificate of Completion - ${courseName}`,
          text: `I just completed the "${courseName}" course at AITRAININGZONE! 🎓`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          `I just completed the "${courseName}" course at AITRAININGZONE! 🎓 #AITrainingZone #InterviewPrep`
        );
        toast({
          title: "Copied to clipboard!",
          description: "Share your achievement on social media.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Preview */}
        <div 
          ref={certificateRef}
          className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-lg p-8 md:p-12 shadow-2xl border-4 border-amber-500/30"
        >
          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-amber-500/50 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-amber-500/50 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-amber-500/50 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-amber-500/50 rounded-br-lg" />

          {/* Watermark Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, hsl(var(--primary)) 0, hsl(var(--primary)) 1px, transparent 0, transparent 50%)',
              backgroundSize: '20px 20px'
            }} />
          </div>

          <div className="relative text-center space-y-6">
            {/* Logo & Header */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Award className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-wider uppercase">
                  AITRAININGZONE
                </h1>
                <p className="text-muted-foreground text-sm tracking-widest">INTERVIEW TRAINING ACADEMY</p>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="py-4">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-wide">
                Certificate of Completion
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-4" />
            </div>

            {/* Main Content */}
            <div className="py-4 space-y-4">
              <p className="text-muted-foreground text-lg">This is to certify that</p>
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">
                {userName}
              </p>
              <p className="text-muted-foreground text-lg">has successfully completed the course</p>
              <p className="text-2xl md:text-3xl font-semibold text-foreground">
                "{courseName}"
              </p>
            </div>

            {/* Date & Signature */}
            <div className="pt-8 grid md:grid-cols-2 gap-8">
              <div>
                <div className="w-40 border-b-2 border-primary/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Date of Completion</p>
                <p className="font-semibold text-foreground">{formattedDate}</p>
              </div>
              <div>
                <div className="font-serif text-xl text-primary italic mb-1">AI Training Zone</div>
                <div className="w-40 border-b-2 border-primary/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Director of Education</p>
              </div>
            </div>

            {/* Certificate ID & Verify Link */}
            <div className="pt-4 space-y-2">
              <p className="text-xs text-muted-foreground">
                Certificate ID: {certificateId || "Generating..."}
              </p>
              <a 
                href={`/verify?id=${certificateId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                Verify this certificate
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Card className="mt-4 p-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? "Generating..." : "Download Certificate"}
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="w-full sm:w-auto"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Achievement
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CourseCertificate;
