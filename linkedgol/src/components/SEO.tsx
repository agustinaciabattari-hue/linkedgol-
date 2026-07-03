import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  path?: string; // e.g. "/jugador" — used to build the canonical URL
  noindex?: boolean;
};

const SITE_NAME = "Linkedgol";
const SITE_URL = "https://www.linkedgol.com";

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

// Sets document.title + meta description + OG/Twitter tags + canonical URL
// for whichever page renders it. Plain useEffect-based approach — no extra
// dependency needed since this app doesn't do server-side rendering, and
// Google executes JS before reading these tags for indexing purposes.
export function SEO({ title, description, path = "/", noindex = false }: SEOProps) {
  useEffect(() => {
    const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;
    const canonicalUrl = `${SITE_URL}${path}`;

    document.title = fullTitle;
    setMetaTag("name", "description", description);
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", description);
    setCanonical(canonicalUrl);

    let robotsTag = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noindex) {
      if (!robotsTag) {
        robotsTag = document.createElement("meta");
        robotsTag.setAttribute("name", "robots");
        document.head.appendChild(robotsTag);
      }
      robotsTag.setAttribute("content", "noindex, nofollow");
    } else if (robotsTag) {
      robotsTag.remove();
    }
  }, [title, description, path, noindex]);

  return null;
}
