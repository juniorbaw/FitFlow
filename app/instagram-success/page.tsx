'use client'

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ORANGE = "#FF5C00";
const GREEN = "#00D26A";

export default function InstagramSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handle = async () => {
      const igUser = searchParams.get('ig_user') || searchParams.get('username');
      const instagram = searchParams.get('instagram');
      const error = searchParams.get('error');

      if (error) {
        router.replace(`/settings?tab=instagram&error=${encodeURIComponent(error)}`);
        return;
      }

      if (igUser) {
        // Sauvegarder dans Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('coaches')
            .update({ instagram_username: igUser })
            .eq('user_id', user.id);
        }
        router.replace(`/settings?tab=instagram&instagram=connected&username=${encodeURIComponent(igUser)}`);
        return;
      }

      // Fallback
      router.replace('/settings?tab=instagram');
    };

    handle();
  }, [searchParams, router, supabase]);

  return (
    <div style={{
      minHeight: "100vh", background: "#050508", color: "#fafafa",
      fontFamily: "'Inter', -apple-system, sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📸</div>
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Connexion Instagram en cours...
        </p>
        <p style={{ fontSize: 14, color: "#666" }}>Vous allez être redirigé automatiquement</p>
        <div style={{
          marginTop: 24, width: 40, height: 40,
          border: `3px solid ${ORANGE}`, borderTopColor: "transparent",
          borderRadius: "50%", animation: "spin 0.8s linear infinite",
          margin: "24px auto 0"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
