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
      community_stats: {
        Row: {
          created_at: string | null
          id: string
          most_common_threat: string | null
          total_analyses: number | null
          total_threats: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          most_common_threat?: string | null
          total_analyses?: number | null
          total_threats?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          most_common_threat?: string | null
          total_analyses?: number | null
          total_threats?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string | null
          feedback_text: string | null
          id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          rating: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          department: string
          email: string
          id: string
          name: string
          updated_at: string
          year: number | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          department: string
          email: string
          id: string
          name: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          department?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      threat_intel: {
        Row: {
          created_at: string
          description: string
          detection_count: number
          first_detected_at: string
          id: string
          last_seen_at: string
          platform: string | null
          primary_domain: string | null
          severity: string
          status: string | null
          threat_category: string
          threat_title: string | null
          threat_type: string
        }
        Insert: {
          created_at?: string
          description: string
          detection_count?: number
          first_detected_at?: string
          id?: string
          last_seen_at?: string
          platform?: string | null
          primary_domain?: string | null
          severity?: string
          status?: string | null
          threat_category: string
          threat_title?: string | null
          threat_type: string
        }
        Update: {
          created_at?: string
          description?: string
          detection_count?: number
          first_detected_at?: string
          id?: string
          last_seen_at?: string
          platform?: string | null
          primary_domain?: string | null
          severity?: string
          status?: string | null
          threat_category?: string
          threat_title?: string | null
          threat_type?: string
        }
        Relationships: []
      }
      user_analyses: {
        Row: {
          analysis_data: Json | null
          content_preview: string | null
          content_type: string
          created_at: string
          id: string
          risk_level: string
          user_id: string
        }
        Insert: {
          analysis_data?: Json | null
          content_preview?: string | null
          content_type: string
          created_at?: string
          id?: string
          risk_level: string
          user_id: string
        }
        Update: {
          analysis_data?: Json | null
          content_preview?: string | null
          content_type?: string
          created_at?: string
          id?: string
          risk_level?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      upsert_threat_intel: {
        Args: {
          p_description: string
          p_primary_domain: string
          p_severity: string
          p_threat_category: string
          p_threat_type: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "student" | "professor" | "admin"
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
      app_role: ["student", "professor", "admin"],
    },
  },
} as const
