import { Router, type IRouter } from "express";
import { authLimiter } from "../middlewares/rateLimit";

const router: IRouter = Router();

// POST /translate — translates user-generated text (bios, descriptions) on
// demand for the language toggle. Uses MyMemory's free translation API by
// default (no signup needed, ~5000 words/day per IP). For higher volume,
// swap this for Google Cloud Translation or DeepL by setting
// TRANSLATE_API_PROVIDER + TRANSLATE_API_KEY and adjusting the fetch below —
// the request/response shape this route exposes to the frontend stays the same.
router.post("/translate", authLimiter, async (req, res) => {
  try {
    const { text, target } = req.body || {};
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Falta el texto a traducir" });
    }
    if (target !== "es" && target !== "en") {
      return res.status(400).json({ error: "Idioma de destino inválido" });
    }

    // MyMemory needs to know the source language too. We don't track what
    // language user content was written in, so we just ask it to translate
    // into the opposite of the target — good enough for es<->en, which is
    // all this site supports right now.
    const source = target === "es" ? "en" : "es";

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
    const response = await fetch(url);
    const data = await response.json();

    const translatedText = data?.responseData?.translatedText;
    if (!translatedText) {
      return res.status(502).json({ error: "El servicio de traducción no respondió correctamente" });
    }

    res.json({ translatedText });
  } catch (err) {
    console.error("Translate error:", err);
    res.status(500).json({ error: "Error al traducir" });
  }
});

export default router;
