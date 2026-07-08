import { useEffect, useRef, useState } from "react";
import { useAuthGoogle } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

// Public by design — Google client IDs are meant to be embedded in
// front-end code (unlike a client *secret*, which this is not).
const GOOGLE_CLIENT_ID = "454263917442-11s7av5aehcrmvnr8tt6dq30u6v2cmn8.apps.googleusercontent.com";

declare global {
  interface Window {
    google?: any;
  }
}

let scriptLoadPromise: Promise<void> | null = null;
function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Google Identity Services"));
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

type Props = {
  // Only needed when creating a brand-new account (registration pages).
  // Omit on the login page — an existing account is matched by email alone.
  role?: "player" | "agent" | "club";
  onAuthenticated: (data: { token: string; user: any; profile: any; newAccount?: boolean }) => void;
  text?: "signin_with" | "signup_with" | "continue_with";
};

export function GoogleLoginButton({ role, onAuthenticated, text = "continue_with" }: Props) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const { toast } = useToast();

  const googleAuth = useAuthGoogle({
    mutation: {
      onSuccess: (data) => onAuthenticated(data as any),
      onError: (err: any) => {
        toast({
          title: "No se pudo continuar con Google",
          description: err?.message || "Intentá de nuevo en unos segundos.",
          variant: "destructive",
        });
      },
    },
  });

  useEffect(() => {
    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: { credential: string }) => {
            googleAuth.mutate({ data: { credential: response.credential, role } });
          },
        });

        if (buttonRef.current) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
            width: 320,
            text,
            shape: "pill",
          });
        }
        setReady(true);
      })
      .catch(() => {
        // Silent fail — the rest of the form (email/password) still works
        // fine without Google sign-in available.
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return (
    <div className="flex justify-center">
      <div ref={buttonRef} />
      {!ready && <div className="h-11 w-full max-w-[320px] bg-slate-100 rounded-full animate-pulse" />}
    </div>
  );
}
