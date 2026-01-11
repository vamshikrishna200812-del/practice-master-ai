export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          points: number
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          points?: number
          requirement_type: string
          requirement_value?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          points?: number
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      behavioral_assessments: {
        Row: {
          ai_feedback: string | null
          answer: string | null
          clarity_score: number | null
          confidence_score: number | null
          created_at: string | null
          eye_contact_score: number | null
          id: string
          posture_score: number | null
          question: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          ai_feedback?: string | null
          answer?: string | null
          clarity_score?: number | null
          confidence_score?: number | null
          created_at?: string | null
          eye_contact_score?: number | null
          id?: string
          posture_score?: number | null
          question: string
          session_id?: string | null
          user_id: string
        }
        Update: {
          ai_feedback?: string | null
          answer?: string | null
          clarity_score?: number | null
          confidence_score?: number | null
          created_at?: string | null
          eye_contact_score?: number | null
          id?: string
          posture_score?: number | null
          question?: string
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "behavioral_assessments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interview_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "behavioral_assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_id: string
          completion_date: string
          course_id: string
          course_title: string
          created_at: string
          id: string
          user_id: string
          user_name: string
        }
        Insert: {
          certificate_id: string
          completion_date?: string
          course_id: string
          course_title: string
          created_at?: string
          id?: string
          user_id: string
          user_name: string
        }
        Update: {
          certificate_id?: string
          completion_date?: string
          course_id?: string
          course_title?: string
          created_at?: string
          id?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      class_schedules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          instructor_id: string | null
          meeting_link: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["session_status"] | null
          title: string
          user_id: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          instructor_id?: string | null
          meeting_link?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["session_status"] | null
          title: string
          user_id: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          instructor_id?: string | null
          meeting_link?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["session_status"] | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_schedules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_schedules_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_schedules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          course_id: string
          enrolled_at: string | null
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          course_id: string
          enrolled_at?: string | null
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string | null
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["skill_level"]
          duration_minutes: number | null
          id: string
          instructor_id: string | null
          is_published: boolean | null
          thumbnail_url: string | null
          title: string
          topics: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty: Database["public"]["Enums"]["skill_level"]
          duration_minutes?: number | null
          id?: string
          instructor_id?: string | null
          is_published?: boolean | null
          thumbnail_url?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["skill_level"]
          duration_minutes?: number | null
          id?: string
          instructor_id?: string | null
          is_published?: boolean | null
          thumbnail_url?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_sessions: {
        Row: {
          body_language_score: number | null
          coding_score: number | null
          communication_score: number | null
          completed_at: string | null
          created_at: string | null
          feedback: Json | null
          id: string
          interview_type: Database["public"]["Enums"]["interview_type"]
          overall_score: number | null
          recording_url: string | null
          scheduled_at: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["session_status"] | null
          user_id: string
        }
        Insert: {
          body_language_score?: number | null
          coding_score?: number | null
          communication_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          feedback?: Json | null
          id?: string
          interview_type: Database["public"]["Enums"]["interview_type"]
          overall_score?: number | null
          recording_url?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["session_status"] | null
          user_id: string
        }
        Update: {
          body_language_score?: number | null
          coding_score?: number | null
          communication_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          feedback?: Json | null
          id?: string
          interview_type?: Database["public"]["Enums"]["interview_type"]
          overall_score?: number | null
          recording_url?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["session_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_sessions: {
        Row: {
          code: string | null
          created_at: string | null
          difficulty: Database["public"]["Enums"]["skill_level"]
          id: string
          language: string
          output: string | null
          passed_tests: number | null
          problem_description: string | null
          problem_title: string
          time_taken_seconds: number | null
          total_tests: number | null
          user_id: string
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          difficulty: Database["public"]["Enums"]["skill_level"]
          id?: string
          language: string
          output?: string | null
          passed_tests?: number | null
          problem_description?: string | null
          problem_title: string
          time_taken_seconds?: number | null
          total_tests?: number | null
          user_id: string
        }
        Update: {
          code?: string | null
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["skill_level"]
          id?: string
          language?: string
          output?: string | null
          passed_tests?: number | null
          problem_description?: string | null
          problem_title?: string
          time_taken_seconds?: number | null
          total_tests?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string
          id: string
          skill_level: Database["public"]["Enums"]["skill_level"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name: string
          id: string
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      question_bank: {
        Row: {
          category: string
          created_at: string
          difficulty: string
          id: string
          industry: string
          question: string
          tips: string | null
        }
        Insert: {
          category: string
          created_at?: string
          difficulty?: string
          id?: string
          industry: string
          question: string
          tips?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          difficulty?: string
          id?: string
          industry?: string
          question?: string
          tips?: string | null
        }
        Relationships: []
      }
      star_stories: {
        Row: {
          action: string | null
          created_at: string
          id: string
          result: string | null
          situation: string | null
          tags: string[] | null
          task: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action?: string | null
          created_at?: string
          id?: string
          result?: string | null
          situation?: string | null
          tags?: string[] | null
          task?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string | null
          created_at?: string
          id?: string
          result?: string | null
          situation?: string | null
          tags?: string[] | null
          task?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          body_language_score: number | null
          coding_score: number | null
          communication_score: number | null
          created_at: string | null
          id: string
          last_practice_date: string | null
          overall_score: number | null
          practice_streak: number | null
          total_interviews: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body_language_score?: number | null
          coding_score?: number | null
          communication_score?: number | null
          created_at?: string | null
          id?: string
          last_practice_date?: string | null
          overall_score?: number | null
          practice_streak?: number | null
          total_interviews?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body_language_score?: number | null
          coding_score?: number | null
          communication_score?: number | null
          created_at?: string | null
          id?: string
          last_practice_date?: string | null
          overall_score?: number | null
          practice_streak?: number | null
          total_interviews?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_active_interview: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      verify_certificate: {
        Args: { _certificate_id: string }
        Returns: {
          certificate_id: string
          completion_date: string
          course_title: string
          is_valid: boolean
          user_name: string
        }[]
      }
    }
    Enums: {
      app_role: "student" | "instructor" | "admin"
      interview_type: "coding" | "behavioral" | "system_design" | "technical"
      session_status: "scheduled" | "in_progress" | "completed" | "cancelled"
      skill_level: "beginner" | "intermediate" | "advanced" | "expert"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "instructor", "admin"],
      interview_type: ["coding", "behavioral", "system_design", "technical"],
      session_status: ["scheduled", "in_progress", "completed", "cancelled"],
      skill_level: ["beginner", "intermediate", "advanced", "expert"],
    },
  },
} as const
