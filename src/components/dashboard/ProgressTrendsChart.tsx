import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton-loaders";
import { TrendingUp, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { format, subDays, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, eachWeekOfInterval } from "date-fns";

interface InterviewSession {
  id: string;
  communication_score: number | null;
  coding_score: number | null;
  body_language_score: number | null;
  overall_score: number | null;
  completed_at: string | null;
  created_at: string;
}

interface ChartDataPoint {
  date: string;
  label: string;
  communication: number;
  coding: number;
  bodyLanguage: number;
  overall: number;
  count: number;
}

type TimeRange = "week" | "month" | "all";

export const ProgressTrendsChart = () => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      processChartData();
    }
  }, [sessions, timeRange]);

  const fetchSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("interview_sessions")
        .select("id, communication_score, coding_score, body_language_score, overall_score, completed_at, created_at")
        .eq("user_id", user.id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: true });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = () => {
    const now = new Date();
    let dateRange: Date[];
    let groupByFormat: string;

    switch (timeRange) {
      case "week":
        dateRange = eachDayOfInterval({
          start: subDays(now, 6),
          end: now,
        });
        groupByFormat = "yyyy-MM-dd";
        break;
      case "month":
        dateRange = eachWeekOfInterval({
          start: subWeeks(now, 3),
          end: now,
        });
        groupByFormat = "yyyy-'W'ww";
        break;
      case "all":
      default:
        // Group by week for all time
        const oldestSession = sessions[0];
        const startDate = oldestSession 
          ? new Date(oldestSession.completed_at || oldestSession.created_at)
          : subWeeks(now, 4);
        dateRange = eachWeekOfInterval({
          start: startDate,
          end: now,
        });
        groupByFormat = "yyyy-'W'ww";
        break;
    }

    const dataPoints: ChartDataPoint[] = dateRange.map((date) => {
      const dateStr = format(date, groupByFormat);
      const label = timeRange === "week" 
        ? format(date, "EEE") 
        : format(date, "MMM d");

      // Filter sessions for this date/week
      const matchingSessions = sessions.filter((session) => {
        const sessionDate = new Date(session.completed_at || session.created_at);
        if (timeRange === "week") {
          return format(sessionDate, groupByFormat) === dateStr;
        } else {
          const weekStart = startOfWeek(date);
          const weekEnd = endOfWeek(date);
          return sessionDate >= weekStart && sessionDate <= weekEnd;
        }
      });

      if (matchingSessions.length === 0) {
        return {
          date: dateStr,
          label,
          communication: 0,
          coding: 0,
          bodyLanguage: 0,
          overall: 0,
          count: 0,
        };
      }

      // Calculate averages
      const avgCommunication = Math.round(
        matchingSessions.reduce((sum, s) => sum + (s.communication_score || 0), 0) / matchingSessions.length
      );
      const avgCoding = Math.round(
        matchingSessions.reduce((sum, s) => sum + (s.coding_score || 0), 0) / matchingSessions.length
      );
      const avgBodyLanguage = Math.round(
        matchingSessions.reduce((sum, s) => sum + (s.body_language_score || 0), 0) / matchingSessions.length
      );
      const avgOverall = Math.round(
        matchingSessions.reduce((sum, s) => sum + (s.overall_score || 0), 0) / matchingSessions.length
      );

      return {
        date: dateStr,
        label,
        communication: avgCommunication,
        coding: avgCoding,
        bodyLanguage: avgBodyLanguage,
        overall: avgOverall,
        count: matchingSessions.length,
      };
    });

    setChartData(dataPoints);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-9 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  const hasData = sessions.length > 0;
  const hasChartData = chartData.some(d => d.count > 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Progress Trends</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("week")}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Week
          </Button>
          <Button
            variant={timeRange === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("month")}
          >
            Month
          </Button>
          <Button
            variant={timeRange === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("all")}
          >
            All Time
          </Button>
        </div>
      </div>

      {!hasData ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No interview data yet</p>
            <p className="text-sm">Complete your first AI interview to see progress trends</p>
          </div>
        </div>
      ) : !hasChartData ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No data for this period</p>
            <p className="text-sm">Try selecting a different time range</p>
          </div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCommunication" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(210, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(210, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCoding" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(280, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(280, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBodyLanguage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(150, 100%, 40%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(150, 100%, 40%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
              <XAxis
                dataKey="label"
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="overall"
                name="Overall"
                stroke="hsl(var(--primary))"
                fill="url(#colorOverall)"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="communication"
                name="Communication"
                stroke="hsl(210, 100%, 50%)"
                fill="url(#colorCommunication)"
                strokeWidth={2}
                dot={{ fill: "hsl(210, 100%, 50%)", strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="coding"
                name="Coding"
                stroke="hsl(280, 100%, 50%)"
                fill="url(#colorCoding)"
                strokeWidth={2}
                dot={{ fill: "hsl(280, 100%, 50%)", strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="bodyLanguage"
                name="Body Language"
                stroke="hsl(150, 100%, 40%)"
                fill="url(#colorBodyLanguage)"
                strokeWidth={2}
                dot={{ fill: "hsl(150, 100%, 40%)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {hasData && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total interviews: {sessions.length}</span>
            <span>
              Avg overall score: {Math.round(sessions.reduce((sum, s) => sum + (s.overall_score || 0), 0) / sessions.length)}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
