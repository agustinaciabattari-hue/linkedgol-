import { useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { useTranslateText } from "@workspace/api-client-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Drop this next to any block of user-generated text (a bio, an
// opportunity description, etc.) to offer an on-demand translation into
// whatever the site's current language is. Doesn't touch the original
// text or the database — purely a client-side "see translation" toggle.
export function TranslateToggle({ text }: { text: string }) {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState<string | null>(null);
  const [showingTranslation, setShowingTranslation] = useState(false);

  const translateMutation = useTranslateText({
    mutation: {
      onSuccess: (data) => {
        setTranslated(data.translatedText);
        setShowingTranslation(true);
      },
    },
  });

  if (!text || !text.trim()) return null;

  const label = language === "es" ? "Ver traducción al español" : "See English translation";
  const revertLabel = language === "es" ? "Ver original" : "See original";

  const handleClick = () => {
    if (translated) {
      setShowingTranslation((prev) => !prev);
      return;
    }
    translateMutation.mutate({ data: { text, target: language } });
  };

  return (
    <div className="mt-2">
      {showingTranslation && translated && (
        <p className="text-sm text-slate-600 italic border-l-2 border-primary/30 pl-3 mb-2">{translated}</p>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={translateMutation.isPending}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:opacity-60"
      >
        {translateMutation.isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Languages className="w-3.5 h-3.5" />
        )}
        {showingTranslation && translated ? revertLabel : label}
      </button>
    </div>
  );
}
