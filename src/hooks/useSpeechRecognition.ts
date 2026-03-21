import { useState, useRef, useCallback, useEffect } from "react";

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
  onSilenceTimeout?: (transcript: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
  silenceTimeoutMs?: number;
}

interface SpeechRecognitionResult {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}): SpeechRecognitionResult => {
  const { onResult, onEnd, onSilenceTimeout, continuous = true, interimResults = true, silenceTimeoutMs = 3000 } = options;
  
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef("");
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(0);
  const silenceCallbackRef = useRef(onSilenceTimeout);

  // Keep callback ref up to date
  useEffect(() => {
    silenceCallbackRef.current = onSilenceTimeout;
  }, [onSilenceTimeout]);

  // Check browser support
  const isSupported = typeof window !== "undefined" && 
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const startSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      const currentTranscript = finalTranscriptRef.current.trim();
      if (currentTranscript && silenceCallbackRef.current) {
        silenceCallbackRef.current(currentTranscript);
      }
    }, silenceTimeoutMs);
  }, [silenceTimeoutMs, clearSilenceTimer]);

  const initRecognition = useCallback(() => {
    if (!isSupported) return null;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("Speech recognition started");
      setIsListening(true);
      setError(null);
      lastActivityRef.current = Date.now();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
          finalTranscriptRef.current = finalTranscript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const fullTranscript = (finalTranscript + interimTranscript).trim();
      setTranscript(fullTranscript);
      lastActivityRef.current = Date.now();
      
      if (onResult && fullTranscript) {
        onResult(fullTranscript);
      }

      // Reset silence timer on every speech activity
      startSilenceTimer();
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      
      if (event.error === "not-allowed") {
        setError("Microphone access denied. Please allow microphone access.");
      } else if (event.error === "no-speech") {
        // Don't show error for no-speech, just restart or trigger silence
        startSilenceTimer();
        return;
      } else if (event.error === "network") {
        setError("Network error. Please check your connection.");
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
      
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);
      clearSilenceTimer();
      if (onEnd) {
        onEnd();
      }
    };

    return recognition;
  }, [isSupported, continuous, interimResults, onResult, onEnd, startSilenceTimer, clearSilenceTimer]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Create new recognition instance
    const recognition = initRecognition();
    if (recognition) {
      recognitionRef.current = recognition;
      try {
        recognition.start();
        // Start initial silence timer
        startSilenceTimer();
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
        setError("Failed to start speech recognition");
      }
    }
  }, [isSupported, initRecognition, startSilenceTimer]);

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, [clearSilenceTimer]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    finalTranscriptRef.current = "";
    clearSilenceTimer();
  }, [clearSilenceTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [clearSilenceTimer]);

  return {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};
