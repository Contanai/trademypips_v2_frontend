import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserContextType {
  user: User | null;
  userId: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  signOutOthers: () => Promise<string | null>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  userId: null,
  loading: true,
  logout: async () => {},
  signOutOthers: async () => null,
});

export const useUser = () => {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const syncProfile = async (sessionUser: User) => {
    try {
      const { error } = await supabase.from("profiles").upsert(
        {
          id: sessionUser.id,
          full_name: sessionUser.user_metadata?.full_name || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
      if (error) {
        console.warn("Profile sync skipped:", error.message);
      }
    } catch {
      // Keep auth flow resilient even if profile table/policies are not ready.
    }
  };

  const logout = async () => {
    await supabase.auth.signOut({ scope: "local" });
  };

  const signOutOthers = async () => {
    const { error } = await supabase.auth.signOut({ scope: "others" });
    return error?.message ?? null;
  };

  useEffect(() => {
    // Get session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      const sessionUser = session?.user || null;
      setUser(sessionUser);
      setUserId(sessionUser?.id || null);
      setLoading(false);
      if (sessionUser) {
        void syncProfile(sessionUser);
      }
    });
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user || null;
      setUser(sessionUser);
      setUserId(sessionUser?.id || null);
      setLoading(false);
      if (sessionUser) {
        void syncProfile(sessionUser);
      }
    });
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, userId, loading, logout, signOutOthers }}>
      {children}
    </UserContext.Provider>
  );
}
