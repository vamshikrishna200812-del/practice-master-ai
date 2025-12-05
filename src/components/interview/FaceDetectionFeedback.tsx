import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, AlertTriangle, Eye, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaceDetectionFeedbackProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
}

interface FeedbackState {
  isFaceDetected: boolean;
  isProperlyFramed: boolean;
  isCentered: boolean;
  isGoodLighting: boolean;
  message: string;
  type: "success" | "warning" | "error";
}

export const FaceDetectionFeedback = ({ videoRef, isActive }: FaceDetectionFeedbackProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({
    isFaceDetected: false,
    isProperlyFramed: false,
    isCentered: false,
    isGoodLighting: false,
    message: "Position your face in the frame",
    type: "warning",
  });

  const analyzeBrightness = useCallback((imageData: ImageData): number => {
    let totalBrightness = 0;
    const data = imageData.data;
    const pixelCount = data.length / 4;
    
    for (let i = 0; i < data.length; i += 4) {
      // Calculate perceived brightness
      const brightness = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      totalBrightness += brightness;
    }
    
    return totalBrightness / pixelCount;
  }, []);

  const detectFaceRegion = useCallback((imageData: ImageData, width: number, height: number) => {
    const data = imageData.data;
    
    // Simple skin tone detection
    let skinPixels = 0;
    let minX = width, maxX = 0, minY = height, maxY = 0;
    let centerX = 0, centerY = 0;
    
    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Skin tone detection (works for various skin tones)
        const isSkinTone = (
          r > 60 && r < 255 &&
          g > 40 && g < 230 &&
          b > 20 && b < 200 &&
          r > g && r > b &&
          Math.abs(r - g) > 10 &&
          (r - g) > (g - b)
        );
        
        if (isSkinTone) {
          skinPixels++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          centerX += x;
          centerY += y;
        }
      }
    }
    
    if (skinPixels < 100) {
      return null;
    }
    
    centerX /= skinPixels;
    centerY /= skinPixels;
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      centerX,
      centerY,
      coverage: skinPixels / ((width * height) / 16), // Adjusted for sampling
    };
  }, []);

  useEffect(() => {
    if (!isActive || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    
    const analyze = () => {
      if (!video.videoWidth || !video.videoHeight) {
        animationId = requestAnimationFrame(analyze);
        return;
      }

      canvas.width = video.videoWidth / 4; // Downsample for performance
      canvas.height = video.videoHeight / 4;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const brightness = analyzeBrightness(imageData);
      const faceRegion = detectFaceRegion(imageData, canvas.width, canvas.height);
      
      const isGoodLighting = brightness > 50 && brightness < 200;
      const isFaceDetected = !!faceRegion && faceRegion.coverage > 0.05;
      
      let isProperlyFramed = false;
      let isCentered = false;
      
      if (faceRegion) {
        // Check if face is centered (within middle 50% of frame)
        const frameCenterX = canvas.width / 2;
        const frameCenterY = canvas.height / 2;
        const toleranceX = canvas.width * 0.25;
        const toleranceY = canvas.height * 0.25;
        
        isCentered = 
          Math.abs(faceRegion.centerX - frameCenterX) < toleranceX &&
          Math.abs(faceRegion.centerY - frameCenterY) < toleranceY;
        
        // Check if face size is appropriate (not too close or far)
        const faceSize = faceRegion.width * faceRegion.height;
        const frameSize = canvas.width * canvas.height;
        const faceRatio = faceSize / frameSize;
        
        isProperlyFramed = faceRatio > 0.08 && faceRatio < 0.5;
      }
      
      // Determine overall feedback
      let message = "";
      let type: "success" | "warning" | "error" = "warning";
      
      if (!isFaceDetected) {
        message = "Position your face in the frame";
        type = "error";
      } else if (!isGoodLighting) {
        message = brightness < 50 ? "Need more lighting" : "Too much light";
        type = "warning";
      } else if (!isCentered) {
        message = "Center your face in the frame";
        type = "warning";
      } else if (!isProperlyFramed) {
        message = faceRegion && faceRegion.coverage > 0.3 ? "Move back a bit" : "Move closer";
        type = "warning";
      } else {
        message = "Perfect positioning!";
        type = "success";
      }
      
      setFeedback({
        isFaceDetected,
        isProperlyFramed,
        isCentered,
        isGoodLighting,
        message,
        type,
      });
      
      animationId = requestAnimationFrame(analyze);
    };
    
    analyze();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, videoRef, analyzeBrightness, detectFaceRegion]);

  if (!isActive) return null;

  const Icon = feedback.type === "success" 
    ? CheckCircle2 
    : feedback.type === "error" 
      ? AlertCircle 
      : AlertTriangle;

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Feedback Badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={feedback.message}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={cn(
            "absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm shadow-lg",
            feedback.type === "success" && "bg-green-500/90 text-white",
            feedback.type === "warning" && "bg-amber-500/90 text-white",
            feedback.type === "error" && "bg-red-500/90 text-white"
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          {feedback.message}
        </motion.div>
      </AnimatePresence>

      {/* Frame Guide Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner guides */}
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Oval guide for face positioning */}
          <ellipse
            cx="50"
            cy="45"
            rx="25"
            ry="35"
            fill="none"
            stroke={
              feedback.type === "success" 
                ? "rgba(34, 197, 94, 0.6)" 
                : feedback.type === "warning"
                  ? "rgba(245, 158, 11, 0.4)"
                  : "rgba(239, 68, 68, 0.4)"
            }
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        </svg>
      </div>

      {/* Status Indicators */}
      <div className="absolute bottom-2 right-2 flex flex-col gap-1">
        <motion.div
          className={cn(
            "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm",
            feedback.isFaceDetected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <User className="w-2.5 h-2.5" />
          Face
        </motion.div>
        <motion.div
          className={cn(
            "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm",
            feedback.isGoodLighting ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
          )}
        >
          <Eye className="w-2.5 h-2.5" />
          Light
        </motion.div>
      </div>
    </>
  );
};
