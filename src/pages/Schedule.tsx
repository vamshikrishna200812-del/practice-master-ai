import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Video, User, Plus, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import scheduleBalloonsVideo from "@/assets/schedule-balloons.mp4";
import { SuccessCelebration } from "@/components/ui/SuccessCelebration";
import { supabase } from "@/integrations/supabase/client";

const Schedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const upcomingClasses = [
    {
      title: "Technical Interview Prep",
      instructor: "Dr. Sarah Johnson",
      date: "Dec 2, 2025",
      time: "2:00 PM - 3:00 PM",
      type: "One-on-One",
      link: "/meet/abc123",
    },
    {
      title: "System Design Workshop",
      instructor: "Prof. Michael Chen",
      date: "Dec 5, 2025",
      time: "4:00 PM - 6:00 PM",
      type: "Group Session",
      link: "/meet/xyz789",
    },
  ];

  const availableInstructors = [
    { name: "Dr. Sarah Johnson", specialty: "Technical Interviews", rating: 4.9 },
    { name: "Prof. Michael Chen", specialty: "System Design", rating: 4.8 },
    { name: "Dr. Emily Rodriguez", specialty: "Behavioral Interviews", rating: 5.0 },
  ];

  const scheduleClass = async () => {
    if (!selectedDate || !selectedTime || !selectedInstructor) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsBooking(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Please sign in"); return; }

      const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
      const title = `Session with ${selectedInstructor}`;

      // Save to database
      const { data: schedule, error } = await supabase.from("class_schedules").insert({
        user_id: session.user.id,
        title,
        scheduled_at: scheduledAt,
        duration_minutes: 60,
        status: "scheduled" as const,
      }).select().single();

      if (error) throw error;

      // Create in-app notification
      await supabase.from("notifications").insert({
        user_id: session.user.id,
        title: "📅 Class Scheduled!",
        message: `"${title}" on ${selectedDate} at ${selectedTime}`,
        type: "class_booked",
        link: `/classroom?id=${schedule.id}`,
      });

      // Send booking confirmation email
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/class-notifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
          body: JSON.stringify({
            action: "booking_confirmation",
            email: session.user.email,
            classTitle: title,
            scheduledAt,
            classId: schedule.id,
          }),
        });
      } catch { /* email is best-effort */ }

      setShowCelebration(true);
      toast.success("Class scheduled! Check your email for confirmation.");
      setSelectedDate("");
      setSelectedTime("");
      setSelectedInstructor("");
    } catch (err) {
      toast.error("Failed to schedule class");
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <DashboardLayout>
      <SuccessCelebration
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title="🎉 Class Scheduled!"
        message={`Your session with ${selectedInstructor || "your instructor"} has been booked. Get ready to level up your skills!`}
      />
      
      <div className="space-y-6">
        <div className="bg-gradient-hero text-white rounded-xl p-6 relative overflow-hidden">
          {/* Hot Air Balloons Animation */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-28 h-28 opacity-90 hidden md:block">
            <video autoPlay loop muted playsInline className="w-full h-full object-contain rounded-xl">
              <source src={scheduleBalloonsVideo} type="video/mp4" />
            </video>
          </div>
          
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 relative z-10">
            <Calendar className="w-8 h-8" />
            Class Scheduling
          </h1>
          <p className="text-white/90 relative z-10">
            Book one-on-one sessions with expert instructors
          </p>
        </div>

        {/* Schedule New Class */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Plus className="w-6 h-6 text-primary" />
              Schedule New Class
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="time">Select Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="instructor">Select Instructor</Label>
              <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose instructor" />
                </SelectTrigger>
                <SelectContent>
                  {availableInstructors.map((instructor, index) => (
                    <SelectItem key={index} value={instructor.name}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={scheduleClass} className="w-full" disabled={isBooking}>
            {isBooking ? "Scheduling..." : "Schedule Class"}
          </Button>
        </Card>

        {/* Available Instructors */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Available Instructors
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {availableInstructors.map((instructor, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {instructor.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold mb-2">{instructor.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{instructor.specialty}</p>
                <div className="flex items-center gap-1 mb-4">
                  <span className="text-yellow-500">★</span>
                  <span className="font-bold">{instructor.rating}</span>
                  <span className="text-sm text-muted-foreground">/5.0</span>
                </div>
                <Button className="w-full" variant="outline">View Profile</Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            Upcoming Classes
          </h2>
          <div className="space-y-4">
            {upcomingClasses.map((classItem, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{classItem.title}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {classItem.instructor}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {classItem.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {classItem.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        {classItem.type}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button className="gap-2" onClick={() => navigate(`/classroom?id=${index}`)}>
                      <GraduationCap className="w-4 h-4" />
                      Join Classroom
                    </Button>
                    <Button variant="outline">Reschedule</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;