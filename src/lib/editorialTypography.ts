type EditorialNode = { type: string; value?: string; children?: EditorialNode[] };

// Applies only to prose text nodes, never to code, inline code, URLs or raw data.
export function editorialTypography() {
  return (tree: EditorialNode) => {
    const visit = (node: EditorialNode) => {
      if (node.type === "text" && node.value) {
        node.value = node.value
          .replace(/(\d)[\u2013\u2014](?=\d)/g, "$1-")
          .replace(/\s*[\u2013\u2014]\s*/g, ": ");
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
