import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Trash2 } from "lucide-react";

const Notifications = () => {
  const notifications = [
    {
      title: "Interview Reminder",
      message: "Your AI interview is pending. Complete it soon!",
      time: "2 hours ago",
      read: false,
    },
    {
      title: "Class Scheduled",
      message: "Technical Interview Prep with Dr. Sarah Johnson",
      time: "5 hours ago",
      read: false,
    },
    {
      title: "Achievement Unlocked",
      message: "You've completed 10 practice sessions!",
      time: "1 day ago",
      read: true,
    },
  ];

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
          <Button variant="outline" size="sm"><CheckCheck className="w-4 h-4 mr-2" />Mark All Read</Button>
          <Button variant="outline" size="sm"><Trash2 className="w-4 h-4 mr-2" />Clear All</Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notif, index) => (
            <Card key={index} className={`p-4 ${!notif.read ? 'border-l-4 border-l-primary' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{notif.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                  <span className="text-xs text-muted-foreground">{notif.time}</span>
                </div>
                {!notif.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;