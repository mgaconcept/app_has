import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export default function RequireAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  console.log("RequireAuth render", { loading, hasSession: !!session });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
      console.log("RequireAuth getSession", { hasSession: !!data.session });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      console.log("RequireAuth onAuthStateChange", { event: _event, hasSession: !!newSession });
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Carregando...</div>;

  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}

