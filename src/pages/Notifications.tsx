import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

const Notifications = () => {
  const { notifications, markAsRead, markAllRead, clearAll } = useNotifications();
  const navigate = useNavigate();

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-hero text-white rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Bell className="w-8 h-8" />
            Notifications
          </h1>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4 mr-2" />Mark All Read
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            <Trash2 className="w-4 h-4 mr-2" />Clear All
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              No notifications yet. They'll appear here when you schedule classes or complete activities.
            </Card>
          ) : (
            notifications.map((notif) => (
              <Card
                key={notif.id}
                className={cn(
                  "p-4 cursor-pointer hover:shadow-md transition-all",
                  !notif.read && "border-l-4 border-l-primary"
                )}
                onClick={() => {
                  markAsRead(notif.id);
                  if (notif.link) navigate(notif.link);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{notif.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                    <span className="text-xs text-muted-foreground">{formatTime(notif.created_at)}</span>
                  </div>
                  {!notif.read && <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1"></div>}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
