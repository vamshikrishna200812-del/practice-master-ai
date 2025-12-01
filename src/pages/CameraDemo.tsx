import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { CameraFeed } from "@/components/camera/CameraFeed";
import { Camera, Smartphone, Monitor } from "lucide-react";
import { toast } from "sonner";

const CameraDemo = () => {
  const handleStreamReady = (stream: MediaStream) => {
    console.log("Camera stream ready:", stream);
    toast.success("Camera stream is ready!");
  };

  const handleStreamStop = () => {
    console.log("Camera stream stopped");
    toast.info("Camera stream stopped");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-gradient-hero text-white rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Camera className="w-8 h-8" />
            Live Camera Feed Demo
          </h1>
          <p className="text-white/90">
            Test real-time camera access with permission handling and smooth playback
          </p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Camera Feed</h2>
          <CameraFeed 
            onStreamReady={handleStreamReady}
            onStreamStop={handleStreamStop}
          />
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Mobile Support</h3>
                <p className="text-sm text-muted-foreground">
                  Works seamlessly on iOS and Android devices. Uses front-facing camera by default for selfie mode.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Monitor className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Desktop Support</h3>
                <p className="text-sm text-muted-foreground">
                  Full HD 720p video feed on desktop browsers with minimal latency and smooth playback.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-muted/50">
          <h3 className="font-bold mb-3">Features</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Automatic permission request with clear error handling</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Mirrored video feed for natural selfie experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Live indicator showing when camera is active</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Start/Stop controls with instant feedback</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Fallback messages for denied permissions or unsupported browsers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Automatic cleanup on component unmount</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6 border-primary/20">
          <h3 className="font-bold mb-3 text-primary">Browser Compatibility</h3>
          <p className="text-sm text-muted-foreground mb-3">
            This camera feed works on all modern browsers that support WebRTC:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="p-3 bg-background rounded-lg text-center">
              <div className="font-medium">Chrome</div>
              <div className="text-xs text-muted-foreground">v53+</div>
            </div>
            <div className="p-3 bg-background rounded-lg text-center">
              <div className="font-medium">Firefox</div>
              <div className="text-xs text-muted-foreground">v36+</div>
            </div>
            <div className="p-3 bg-background rounded-lg text-center">
              <div className="font-medium">Safari</div>
              <div className="text-xs text-muted-foreground">v11+</div>
            </div>
            <div className="p-3 bg-background rounded-lg text-center">
              <div className="font-medium">Edge</div>
              <div className="text-xs text-muted-foreground">v79+</div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CameraDemo;
