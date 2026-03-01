import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link: string | null;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUserId(session.user.id);
    });
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) {
      setNotifications(data as Notification[]);
      setUnreadCount(data.filter(n => !n.read).length);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time subscription
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications(prev => [newNotif, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast(newNotif.title, { description: newNotif.message, action: newNotif.link ? { label: "View", onClick: () => window.location.href = newNotif.link! } : undefined });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    if (!userId) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearAll = async () => {
    if (!userId) return;
    await supabase.from("notifications").delete().eq("user_id", userId);
    setNotifications([]);
    setUnreadCount(0);
  };

  // Client-side class reminder timer
  useEffect(() => {
    if (!userId) return;
    const checkUpcoming = async () => {
      const now = new Date();
      const soon = new Date(now.getTime() + 16 * 60 * 1000); // 16 min from now
      const { data } = await supabase
        .from("class_schedules")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "scheduled")
        .gte("scheduled_at", now.toISOString())
        .lte("scheduled_at", soon.toISOString());

      if (data?.length) {
        data.forEach(cls => {
          const diff = new Date(cls.scheduled_at).getTime() - now.getTime();
          const mins = Math.round(diff / 60000);
          if (mins <= 15 && mins > 0) {
            toast(`⏰ "${cls.title}" starts in ${mins} minutes!`, {
              description: "Click to join the classroom",
              action: { label: "Join Now", onClick: () => window.location.href = `/classroom?id=${cls.id}` },
              duration: 15000,
            });
          }
        });
      }
    };

    checkUpcoming();
    const interval = setInterval(checkUpcoming, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  return { notifications, unreadCount, markAsRead, markAllRead, clearAll, refetch: fetchNotifications };
};
