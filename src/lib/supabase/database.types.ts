export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      bathroom_entries: {
        Row: {
          bristol_type: number;
          created_at: string;
          id: string;
          notes: string | null;
          occurred_at: string;
          pain_level: number | null;
          updated_at: string;
          urgency: number | null;
          user_id: string;
        };
        Insert: {
          bristol_type: number;
          created_at?: string;
          id?: string;
          notes?: string | null;
          occurred_at: string;
          pain_level?: number | null;
          updated_at?: string;
          urgency?: number | null;
          user_id: string;
        };
        Update: {
          bristol_type?: number;
          created_at?: string;
          id?: string;
          notes?: string | null;
          occurred_at?: string;
          pain_level?: number | null;
          updated_at?: string;
          urgency?: number | null;
          user_id?: string;
        };
        Relationships: [];
      };
      food_entries: {
        Row: {
          created_at: string;
          eaten_at: string;
          id: string;
          meal_type: string;
          notes: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          eaten_at: string;
          id?: string;
          meal_type?: string;
          notes?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          eaten_at?: string;
          id?: string;
          meal_type?: string;
          notes?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      food_entry_items: {
        Row: {
          created_at: string;
          food_entry_id: string;
          food_id: string;
          id: string;
          notes: string | null;
          quantity: number | null;
          sort_order: number;
          unit: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          food_entry_id: string;
          food_id: string;
          id?: string;
          notes?: string | null;
          quantity?: number | null;
          sort_order?: number;
          unit?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          food_entry_id?: string;
          food_id?: string;
          id?: string;
          notes?: string | null;
          quantity?: number | null;
          sort_order?: number;
          unit?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "food_entry_items_entry_user_fk";
            columns: ["food_entry_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "food_entries";
            referencedColumns: ["id", "user_id"];
          },
          {
            foreignKeyName: "food_entry_items_food_user_fk";
            columns: ["food_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "foods";
            referencedColumns: ["id", "user_id"];
          },
        ];
      };
      foods: {
        Row: {
          archived_at: string | null;
          category: string | null;
          created_at: string;
          default_unit: string | null;
          id: string;
          is_favorite: boolean;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          archived_at?: string | null;
          category?: string | null;
          created_at?: string;
          default_unit?: string | null;
          id?: string;
          is_favorite?: boolean;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          archived_at?: string | null;
          category?: string | null;
          created_at?: string;
          default_unit?: string | null;
          id?: string;
          is_favorite?: boolean;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      medicine_entries: {
        Row: {
          created_at: string;
          dose: number | null;
          id: string;
          medicine_id: string;
          notes: string | null;
          reason: string | null;
          schedule_id: string | null;
          scheduled_for: string | null;
          taken_at: string;
          unit: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          dose?: number | null;
          id?: string;
          medicine_id: string;
          notes?: string | null;
          reason?: string | null;
          schedule_id?: string | null;
          scheduled_for?: string | null;
          taken_at: string;
          unit?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          dose?: number | null;
          id?: string;
          medicine_id?: string;
          notes?: string | null;
          reason?: string | null;
          schedule_id?: string | null;
          scheduled_for?: string | null;
          taken_at?: string;
          unit?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "medicine_entries_medicine_user_fk";
            columns: ["medicine_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "medicines";
            referencedColumns: ["id", "user_id"];
          },
        ];
      };
      medicine_schedule_times: {
        Row: {
          created_at: string;
          id: string;
          schedule_id: string;
          sort_order: number;
          time_of_day: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          schedule_id: string;
          sort_order?: number;
          time_of_day: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          schedule_id?: string;
          sort_order?: number;
          time_of_day?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "medicine_schedule_times_schedule_user_fk";
            columns: ["schedule_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "medicine_schedules";
            referencedColumns: ["id", "user_id"];
          },
        ];
      };
      medicine_schedules: {
        Row: {
          created_at: string;
          dose: number | null;
          end_date: string;
          id: string;
          interval_minutes: number | null;
          interval_start_time: string | null;
          medicine_id: string;
          notes: string | null;
          reason: string | null;
          schedule_type: string;
          start_date: string;
          timezone: string;
          unit: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          dose?: number | null;
          end_date: string;
          id?: string;
          interval_minutes?: number | null;
          interval_start_time?: string | null;
          medicine_id: string;
          notes?: string | null;
          reason?: string | null;
          schedule_type: string;
          start_date: string;
          timezone: string;
          unit?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          dose?: number | null;
          end_date?: string;
          id?: string;
          interval_minutes?: number | null;
          interval_start_time?: string | null;
          medicine_id?: string;
          notes?: string | null;
          reason?: string | null;
          schedule_type?: string;
          start_date?: string;
          timezone?: string;
          unit?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "medicine_schedules_medicine_user_fk";
            columns: ["medicine_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "medicines";
            referencedColumns: ["id", "user_id"];
          },
        ];
      };
      medicines: {
        Row: {
          archived_at: string | null;
          created_at: string;
          default_unit: string | null;
          id: string;
          is_favorite: boolean;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          archived_at?: string | null;
          created_at?: string;
          default_unit?: string | null;
          id?: string;
          is_favorite?: boolean;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string;
          default_unit?: string | null;
          id?: string;
          is_favorite?: boolean;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          timezone: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          timezone?: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          timezone?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      timeline_events: {
        Row: {
          created_at: string | null;
          event_subtype: string | null;
          event_type: string | null;
          id: string | null;
          notes: string | null;
          occurred_at: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
