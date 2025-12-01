import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, VideoOff, Camera, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface CameraFeedProps {
  isFullscreen?: boolean;
  onStreamReady?: (stream: MediaStream) => void;
  onStreamStop?: () => void;
}

export const CameraFeed = ({ 
  isFullscreen = false, 
  onStreamReady,
  onStreamStop 
}: CameraFeedProps) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    setPermissionDenied(false);

    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in this browser");
      }

      // Request camera permission and get stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user" // Front camera on mobile
        },
        audio: false
      });

      streamRef.current = stream;

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }

      setIsStreaming(true);
      toast.success("Camera connected successfully!");
      
      // Notify parent component
      if (onStreamReady) {
        onStreamReady(stream);
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionDenied(true);
        setError("Camera access was denied. Please allow camera access in your browser settings.");
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else if (err.name === "NotReadableError") {
        setError("Camera is already in use by another application.");
      } else {
        setError(err.message || "Failed to access camera. Please try again.");
      }
      
      toast.error("Failed to access camera");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    
    // Notify parent component
    if (onStreamStop) {
      onStreamStop();
    }
  };

  const toggleCamera = () => {
    if (isStreaming) {
      stopCamera();
      toast.info("Camera stopped");
    } else {
      startCamera();
    }
  };

  return (
    <Card className={`overflow-hidden ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : "w-full max-w-2xl mx-auto"}`}>
      <div className="relative bg-black">
        {/* Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full ${isFullscreen ? "h-screen" : "aspect-video"} object-cover`}
          style={{ transform: "scaleX(-1)" }} // Mirror effect for front camera
        />

        {/* Overlay when not streaming */}
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="text-center space-y-4 p-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 animate-pulse">
                <Camera className="w-10 h-10 text-primary" />
              </div>
              <p className="text-white text-lg font-medium">Camera is off</p>
              <p className="text-gray-400 text-sm max-w-xs">
                Click the button below to start your camera feed
              </p>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <div className={`absolute ${isFullscreen ? "bottom-8" : "bottom-4"} left-1/2 -translate-x-1/2 flex gap-3 z-10`}>
          <Button
            onClick={toggleCamera}
            size={isFullscreen ? "lg" : "default"}
            className={`${isStreaming ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"} shadow-lg`}
          >
            {isStreaming ? (
              <>
                <VideoOff className="w-4 h-4 mr-2" />
                Stop Camera
              </>
            ) : (
              <>
                <Video className="w-4 h-4 mr-2" />
                Start Camera
              </>
            )}
          </Button>
        </div>

        {/* Stream indicator */}
        {isStreaming && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span className="text-white text-xs font-medium">LIVE</span>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {error && (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {error}
              {permissionDenied && (
                <div className="mt-2 text-sm">
                  <p className="font-medium mb-1">To enable camera access:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Click the camera icon in your browser's address bar</li>
                    <li>Select "Allow" for camera permissions</li>
                    <li>Refresh the page and try again</li>
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Browser Support Info */}
      {!navigator.mediaDevices && (
        <div className="p-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              Camera access requires HTTPS or localhost. This feature may not work on unsecured connections.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
};
