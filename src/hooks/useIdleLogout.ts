import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const WARN_AFTER_MS = 25 * 60 * 1000;   // 25 minutes idle → warn
const LOGOUT_AFTER_MS = 30 * 60 * 1000; // 30 minutes idle → forced logout
const ACTIVITY_EVENTS = ["mousedown", "keydown", "touchstart", "scroll"];

export interface IdleState {
  warning: boolean;
  secondsUntilLogout: number;
  dismiss: () => void;
  stayActive: () => void;
}

/**
 * Auto-logout after 30 min of inactivity, warning at 25 min.
 * Returns warning state so a UI modal can be rendered.
 */
export function useIdleLogout(enabled: boolean): IdleState {
  const navigate = useNavigate();
  const lastActivityRef = useRef<number>(Date.now());
  const tickRef = useRef<number | null>(null);
  const [warning, setWarning] = useState(false);
  const [secondsUntilLogout, setSecondsUntilLogout] = useState(
    Math.floor((LOGOUT_AFTER_MS - WARN_AFTER_MS) / 1000)
  );

  const markActive = () => {
    lastActivityRef.current = Date.now();
    if (warning) setWarning(false);
  };

  useEffect(() => {
    if (!enabled) return;

    ACTIVITY_EVENTS.forEach((ev) =>
      window.addEventListener(ev, markActive, { passive: true })
    );

    const tick = window.setInterval(async () => {
      const idle = Date.now() - lastActivityRef.current;
      if (idle >= LOGOUT_AFTER_MS) {
        await supabase.auth.signOut();
        navigate("/auth", { replace: true });
      } else if (idle >= WARN_AFTER_MS) {
        setWarning(true);
        setSecondsUntilLogout(Math.max(0, Math.ceil((LOGOUT_AFTER_MS - idle) / 1000)));
      }
    }, 1000);
    tickRef.current = tick;

    return () => {
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, markActive));
      if (tickRef.current) clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return {
    warning,
    secondsUntilLogout,
    dismiss: () => setWarning(false),
    stayActive: markActive,
  };
}
