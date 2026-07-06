import { Fragment } from "react";

// Very small markdown-lite renderer — just enough for legal pages edited
// from the admin's plain-textarea CMS field. Supports:
//   ## Heading
//   - bullet list items (consecutive lines)
//   blank-line-separated paragraphs
// Anything fancier (tables, bold, links) isn't needed for Términos/Privacidad.
export function MarkdownLite({ content }: { content: string }) {
  const blocks: JSX.Element[] = [];
  const lines = content.split("\n");
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(<h2 key={key++}>{line.slice(3).trim()}</h2>);
      i++;
      continue;
    }

    if (line.trim().startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2).trim());
        i++;
      }
      blocks.push(
        <ul key={key++}>
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Regular paragraph — collect consecutive non-blank, non-special lines.
    const paragraphLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("## ") && !lines[i].trim().startsWith("- ")) {
      paragraphLines.push(lines[i]);
      i++;
    }
    blocks.push(<p key={key++}>{paragraphLines.join(" ")}</p>);
  }

  return <Fragment>{blocks}</Fragment>;
}
