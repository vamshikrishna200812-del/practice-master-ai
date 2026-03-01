import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Proactive Session Watcher
 * - Listens to Supabase auth state changes (sign out, token refresh failures)
 * - Monitors network connectivity and warns before the UI crashes
 * - Handles token expiry gracefully by redirecting to /auth
 */
export function useSessionWatcher() {
  const navigate = useNavigate();
  const toastShownRef = useRef(false);

  useEffect(() => {
    // ── Auth State Listener ──
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/auth", { replace: true });
        }

        if (event === "TOKEN_REFRESHED" && !session) {
          // Token refresh failed — session expired
          if (!toastShownRef.current) {
            toastShownRef.current = true;
            toast.error("Your session has expired. Please sign in again.", {
              duration: 6000,
              action: {
                label: "Sign In",
                onClick: () => navigate("/auth", { replace: true }),
              },
            });
            setTimeout(() => {
              toastShownRef.current = false;
              navigate("/auth", { replace: true });
            }, 3000);
          }
        }
      }
    );

    // ── Network Connectivity Watcher ──
    const handleOffline = () => {
      toast.warning("You're offline. Some features may be unavailable.", { duration: 5000 });
    };

    const handleOnline = () => {
      toast.success("Connection restored.", { duration: 2000 });
      // Attempt silent session refresh
      supabase.auth.refreshSession().catch(() => {
        // If refresh fails after reconnect, redirect
        navigate("/auth", { replace: true });
      });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // ── Periodic Session Health Check (every 5 min) ──
    const healthInterval = setInterval(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return; // Not logged in, nothing to watch

        // Check if token expires within 60s
        const expiresAt = session.expires_at;
        if (expiresAt) {
          const nowSec = Math.floor(Date.now() / 1000);
          if (expiresAt - nowSec < 60) {
            // Proactively refresh
            await supabase.auth.refreshSession();
          }
        }
      } catch {
        // Silently handle — next interval will retry
      }
    }, 5 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      clearInterval(healthInterval);
    };
  }, [navigate]);
}
