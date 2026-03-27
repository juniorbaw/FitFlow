'use client'

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ORANGE = "#FF5C00";

function InstagramSuccessContent() {
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
          // Vérifier si le coach existe
          const { data: existing } = await supabase
            .from('coaches')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (existing) {
            // Mettre à jour
            const { error: updateError } = await supabase
              .from('coaches')
              .update({
                instagram_username: igUser,
                instagram_id: igUser,
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', user.id);
            if (updateError) {
              console.error('Update error:', updateError);
              router.replace(`/settings?tab=instagram&error=${encodeURIComponent(updateError.message)}`);
              return;
            }
          } else {
            // Créer le coach
            const { error: insertError } = await supabase
              .from('coaches')
              .insert({
                user_id: user.id,
                email: user.email || '',
                instagram_username: igUser,
                instagram_id: igUser,
              });
            if (insertError) {
              console.error('Insert error:', insertError);
              router.replace(`/settings?tab=instagram&error=${encodeURIComponent(insertError.message)}`);
              return;
            }
          }
        }
        router.replace(`/settings?tab=instagram&instagram=connected&username=${encodeURIComponent(igUser)}`);
        return;
      }

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
          width: 40, height: 40,
          border: `3px solid ${ORANGE}`, borderTopColor: "transparent",
          borderRadius: "50%", animation: "spin 0.8s linear infinite",
          margin: "24px auto 0"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

export default function InstagramSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh", background: "#050508", color: "#fafafa",
        fontFamily: "'Inter', -apple-system, sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📸</div>
          <p style={{ fontSize: 18, fontWeight: 700 }}>Connexion Instagram en cours...</p>
        </div>
      </div>
    }>
      <InstagramSuccessContent />
    </Suspense>
  );
}
