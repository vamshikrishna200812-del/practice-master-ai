import { ReactNode, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  BookOpen, 
  Code, 
  Settings, 
  Bell, 
  HelpCircle,
  LogOut,
  
  Calendar,
  FileQuestion,
  ClipboardList,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getTier } from "@/utils/levelTiers";
import logo from "@/assets/logo.jpeg";

interface UserProfile {
  full_name: string;
  avatar_url: string | null;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userPoints, setUserPoints] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .single();
      if (data) setProfile(data);
      // Fetch points
      const { data: pts } = await supabase
        .from('coding_points')
        .select('total_points')
        .eq('user_id', userId)
        .maybeSingle();
      setUserPoints(pts?.total_points ?? 0);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/ai-assistant", icon: Sparkles, label: "AI Assistant" },
    { path: "/courses", icon: BookOpen, label: "Courses" },
    { path: "/practice", icon: Code, label: "Practice" },
    { path: "/question-bank", icon: FileQuestion, label: "Questions" },
    { path: "/cheat-sheet", icon: ClipboardList, label: "Cheat Sheet" },
    { path: "/schedule", icon: Calendar, label: "Schedule" },
    { path: "/leaderboard", icon: Trophy, label: "Hall of Fame" },
    { path: "/notifications", icon: Bell, label: "Notifications" },
    { path: "/settings", icon: Settings, label: "Settings" },
    { path: "/help", icon: HelpCircle, label: "Help" },
  ];

  if (!user) return null;

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <ScrollArea className="flex-1 py-4">
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              onClick={onItemClick}
            >
              <Button 
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start gap-3 h-11 transition-all duration-200",
                  sidebarCollapsed && "justify-center px-2",
                  isActive && "bg-primary/10 text-primary border-l-2 border-primary rounded-l-none"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>
    </ScrollArea>
  );

  const UserProfileSection = ({ collapsed = false, onClick }: { collapsed?: boolean; onClick?: () => void }) => {
    const initials = profile?.full_name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

    return (
      <Link 
        to="/settings" 
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 p-3 border-b hover:bg-muted/50 transition-colors cursor-pointer",
          collapsed && "justify-center"
        )}
      >
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm truncate">
              {profile?.full_name || 'User'}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email || ''}
            </span>
            {userPoints !== null && (() => {
              const tier = getTier(userPoints);
              const TierIcon = tier.icon;
              return (
                <span className={`text-[10px] flex items-center gap-1 mt-0.5 ${tier.textClass}`}>
                  <TierIcon className="w-3 h-3" />
                  {tier.name} • {userPoints} pts
                </span>
              );
            })()}
          </div>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex flex-col border-r bg-card/50 backdrop-blur transition-all duration-300 sticky top-0 h-screen",
          sidebarCollapsed ? "w-16" : "w-60"
        )}
      >
        {/* Sidebar Header */}
        <div className={cn(
          "flex items-center h-16 border-b px-4",
          sidebarCollapsed ? "justify-center" : "justify-between"
        )}>
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="AITRAININGZONE" className="w-8 h-8 rounded-lg object-cover shrink-0" />
            {!sidebarCollapsed && (
              <span className="font-bold text-lg whitespace-nowrap">AITRAININGZONE</span>
            )}
          </Link>
        </div>

        {/* User Profile Section */}
        <UserProfileSection collapsed={sidebarCollapsed} />

        {/* Scrollable Navigation */}
        <SidebarContent />

        {/* Sign Out & Collapse Button */}
        <div className="border-t p-3 space-y-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut} 
            className={cn(
              "w-full justify-start gap-3 h-11 text-destructive hover:text-destructive hover:bg-destructive/10",
              sidebarCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "w-full justify-start gap-3 h-9 text-muted-foreground",
              sidebarCollapsed && "justify-center px-2"
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-14 items-center justify-between px-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="AITRAININGZONE" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-bold text-lg">AITRAININGZONE</span>
            </Link>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between h-14 border-b px-4">
                    <span className="font-bold">Menu</span>
                  </div>

                  {/* User Profile Section */}
                  <UserProfileSection onClick={() => setMobileMenuOpen(false)} />

                  {/* Scrollable Navigation */}
                  <ScrollArea className="flex-1 py-4">
                    <nav className="flex flex-col gap-1 px-3">
                      {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link 
                            key={item.path} 
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Button 
                              variant={isActive ? "secondary" : "ghost"}
                              size="sm"
                              className={cn(
                                "w-full justify-start gap-3 h-12",
                                isActive && "bg-primary/10 text-primary border-l-2 border-primary rounded-l-none"
                              )}
                            >
                              <item.icon className="w-5 h-5" />
                              <span>{item.label}</span>
                            </Button>
                          </Link>
                        );
                      })}
                    </nav>
                  </ScrollArea>

                  {/* Sign Out */}
                  <div className="border-t p-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }} 
                      className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
