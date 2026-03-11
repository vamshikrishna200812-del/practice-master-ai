import { useEffect, useRef, useState } from "react";

const randomColors = (count: number) =>
  Array.from({ length: count }, () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")
  );

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

const TubesBackground = ({ children, className, enableClickInteraction = true }: TubesBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tubesRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (!canvasRef.current) return;
      try {
        const cdnUrl = "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";
        const mod = await (Function(`return import("${cdnUrl}")`)() as Promise<any>);
        if (!mounted) return;
        const TubesCursor = mod.default;
        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#f967fb", "#53bc28", "#6958d5"],
            lights: {
              intensity: 200,
              colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"],
            },
          },
        });
        tubesRef.current = app;
        setLoaded(true);
      } catch (e) {
        console.error("TubesCursor load error:", e);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  const handleClick = () => {
    if (!tubesRef.current) return;
    tubesRef.current.tubes.setColors(randomColors(3));
    tubesRef.current.tubes.setLightsColors(randomColors(4));
  };

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`} onClick={handleClick}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default TubesBackground;
