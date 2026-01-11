import { useCallback, useRef } from "react";

type SoundType = "celebration" | "achievement" | "confetti" | "success";

// Generate celebration sounds using Web Audio API
const createSoundContext = () => {
  if (typeof window === "undefined") return null;
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

export const useCelebrationSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = createSoundContext();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType = "celebration") => {
    const context = getAudioContext();
    if (!context) return;

    // Resume context if suspended (browser autoplay policy)
    if (context.state === "suspended") {
      context.resume();
    }

    const now = context.currentTime;

    switch (type) {
      case "celebration": {
        // Triumphant fanfare - rising arpeggio
        const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        frequencies.forEach((freq, i) => {
          const osc = context.createOscillator();
          const gain = context.createGain();
          
          osc.type = "sine";
          osc.frequency.value = freq;
          
          gain.gain.setValueAtTime(0, now + i * 0.1);
          gain.gain.linearRampToValueAtTime(0.3, now + i * 0.1 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
          
          osc.connect(gain);
          gain.connect(context.destination);
          
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.5);
        });

        // Add shimmer effect
        const shimmer = context.createOscillator();
        const shimmerGain = context.createGain();
        shimmer.type = "sine";
        shimmer.frequency.value = 2093; // C7
        shimmerGain.gain.setValueAtTime(0, now + 0.4);
        shimmerGain.gain.linearRampToValueAtTime(0.15, now + 0.45);
        shimmerGain.gain.exponentialRampToValueAtTime(0.01, now + 1);
        shimmer.connect(shimmerGain);
        shimmerGain.connect(context.destination);
        shimmer.start(now + 0.4);
        shimmer.stop(now + 1);
        break;
      }

      case "achievement": {
        // Badge unlock sound - two-note chime
        const notes = [880, 1174.66]; // A5, D6
        notes.forEach((freq, i) => {
          const osc = context.createOscillator();
          const gain = context.createGain();
          
          osc.type = "sine";
          osc.frequency.value = freq;
          
          gain.gain.setValueAtTime(0, now + i * 0.15);
          gain.gain.linearRampToValueAtTime(0.25, now + i * 0.15 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.6);
          
          osc.connect(gain);
          gain.connect(context.destination);
          
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.7);
        });
        break;
      }

      case "confetti": {
        // Sparkle pop sound
        const osc = context.createOscillator();
        const gain = context.createGain();
        const filter = context.createBiquadFilter();
        
        osc.type = "square";
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        
        filter.type = "lowpass";
        filter.frequency.value = 3000;
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(context.destination);
        
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }

      case "success": {
        // Simple success ding
        const osc = context.createOscillator();
        const gain = context.createGain();
        
        osc.type = "sine";
        osc.frequency.value = 987.77; // B5
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        osc.connect(gain);
        gain.connect(context.destination);
        
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      }
    }
  }, [getAudioContext]);

  return { playSound };
};

export default useCelebrationSound;
