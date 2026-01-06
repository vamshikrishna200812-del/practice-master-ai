import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { 
  Award, 
  Search, 
  CheckCircle2, 
  XCircle, 
  User, 
  BookOpen, 
  Calendar,
  Shield,
  Loader2
} from "lucide-react";

interface CertificateResult {
  id: string;
  certificate_id: string;
  user_name: string;
  course_title: string;
  completion_date: string;
  created_at: string;
}

const CertificateVerify = () => {
  const [searchParams] = useSearchParams();
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertificateResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  // Auto-verify if ID is provided in URL
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setCertificateId(idFromUrl.toUpperCase());
      // Auto-trigger verification
      verifyWithId(idFromUrl.toUpperCase());
    }
  }, [searchParams]);

  const verifyWithId = async (id: string) => {
    if (!id.trim()) return;
    
    setLoading(true);
    setNotFound(false);
    setResult(null);
    setHasSearched(true);

    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("certificate_id", id.trim().toUpperCase())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setResult(data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    if (!certificateId.trim()) {
      toast({
        title: "Enter Certificate ID",
        description: "Please enter a valid certificate ID to verify.",
        variant: "destructive",
      });
      return;
    }
    verifyWithId(certificateId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Award className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AITRAININGZONE</h1>
              <p className="text-xs text-muted-foreground">Certificate Verification</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Shield className="w-3 h-3" />
            Secure Verification
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Verify Certificate Authenticity
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Enter the certificate ID to verify if a completion certificate from AITRAININGZONE is authentic and valid.
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Certificate Lookup
                </CardTitle>
                <CardDescription>
                  The certificate ID can be found at the bottom of the certificate document.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter Certificate ID (e.g., CERT-ABC123XYZ)"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    className="flex-1 font-mono"
                  />
                  <Button onClick={handleVerify} disabled={loading} className="min-w-[120px]">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          {hasSearched && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {result ? (
                <Card className="border-2 border-green-500/50 bg-green-500/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <Badge className="bg-green-500 hover:bg-green-600 mb-2">
                            Verified Authentic
                          </Badge>
                          <h3 className="text-xl font-bold text-foreground">
                            Certificate is Valid
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            This certificate was issued by AITRAININGZONE and is authentic.
                          </p>
                        </div>

                        <div className="grid gap-4 pt-4 border-t border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Certificate Holder</p>
                              <p className="font-semibold text-foreground">{result.user_name}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-secondary-foreground" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Course Completed</p>
                              <p className="font-semibold text-foreground">{result.course_title}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-accent-foreground" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Completion Date</p>
                              <p className="font-semibold text-foreground">
                                {formatDate(result.completion_date)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <Award className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Certificate ID</p>
                              <p className="font-mono text-sm text-foreground">{result.certificate_id}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : notFound ? (
                <Card className="border-2 border-destructive/50 bg-destructive/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-8 h-8 text-destructive" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="destructive" className="mb-2">
                          Not Found
                        </Badge>
                        <h3 className="text-xl font-bold text-foreground">
                          Certificate Not Verified
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          We couldn't find a certificate with ID "{certificateId}" in our records. 
                          Please check the ID and try again, or contact support if you believe this is an error.
                        </p>
                        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <strong>Tips:</strong>
                          </p>
                          <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
                            <li>Ensure the certificate ID is entered exactly as shown on the certificate</li>
                            <li>Certificate IDs are case-insensitive but must be complete</li>
                            <li>The format is usually CERT-XXXXXXXXX</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </motion.div>
          )}

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  About Certificate Verification
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    AITRAININGZONE issues digital certificates to students who successfully complete 
                    our interview training courses. Each certificate contains a unique ID that can 
                    be verified through this page.
                  </p>
                  <p>
                    For hiring managers and recruiters: This verification system ensures that 
                    candidates' claimed certifications are authentic and accurately represent 
                    their completed training.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AITRAININGZONE. All rights reserved.</p>
          <p className="mt-1">
            Questions about verification? Contact support@aitrainingzone.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CertificateVerify;
