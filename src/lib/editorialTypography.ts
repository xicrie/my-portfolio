type EditorialNode = { type: string; value?: string; children?: EditorialNode[] };

// Keep short Russian prepositions and conjunctions with the following word.
// The trailing-space case also covers a following emphasis node or link.
export function russianTypography(value: string) {
  return value
    .replace(/(\d)[\u2013\u2014](?=\d)/g, "$1-")
    .replace(/\s*[\u2013\u2014]\s*/g, ": ")
    .replace(/(?<![\p{L}\p{N}_])(а|и|но|да|или|либо|что|как|чтобы|если|когда|хотя|пока|ведь|чем|в|во|на|к|ко|с|со|о|об|обо|от|до|из|изо|у|за|по|под|подо|над|надо|для|без|безо|при|про|через|перед|между) +(?=\S|$)/giu, "$1\u00a0");
}

// Applies only to prose text nodes, never to code, inline code, URLs or raw data.
export function editorialTypography() {
  return (tree: EditorialNode) => {
    const visit = (node: EditorialNode) => {
      // A blockquote already marks an attributed quotation. Remove only its
      // outer quotation marks, retaining the quote text and attribution.
      if (node.type === "blockquote") {
        const texts: EditorialNode[] = [];
        const collect = (child: EditorialNode) => {
          if (child.type === "text") texts.push(child);
          child.children?.forEach(collect);
        };
        collect(node);
        const first = texts.find(text => text.value?.trim());
        if (first?.value && /^\s*«/.test(first.value)) {
          const last = [...texts].reverse().find(text => text.value?.includes("»"));
          if (last?.value) {
            first.value = first.value.replace("«", "");
            const close = last.value.lastIndexOf("»");
            last.value = last.value.slice(0, close) + last.value.slice(close + 1);
          }
        }
      }
      if (node.type === "text" && node.value) {
        node.value = russianTypography(node.value);
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
