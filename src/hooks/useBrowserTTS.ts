import { useState, useCallback, useRef, useEffect } from "react";

interface UseBrowserTTSOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

interface UseBrowserTTSResult {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
}

export const useBrowserTTS = (options: UseBrowserTTSOptions = {}): UseBrowserTTSResult => {
  const { voice, rate = 1, pitch = 1, volume = 1, onStart, onEnd } = options;
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    
    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Find Indian English voice first, fallback to other English voices
    const selectedVoice = voices.find(v => 
      voice ? v.name.includes(voice) : v.lang === "en-IN"
    ) || voices.find(v => 
      v.lang.startsWith("en-IN") || v.name.toLowerCase().includes("india")
    ) || voices.find(v => 
      v.lang.startsWith("en-GB")
    ) || voices.find(v => 
      v.lang.startsWith("en")
    ) || voices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log("Using TTS voice:", selectedVoice.name, selectedVoice.lang);
    }

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error("TTS error:", event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices, voice, rate, pitch, volume, onStart, onEnd]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
  };
};
