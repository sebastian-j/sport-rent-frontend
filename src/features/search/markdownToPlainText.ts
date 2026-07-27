const stripInlineMarkdown = (text: string) =>
  text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`]/g, '')
    .trim();

export const markdownToPlainText = (markdown: string) => {
  const textParts: string[] = [];
  let listItems: string[] = [];

  const appendList = () => {
    if (listItems.length === 0) return;

    textParts.push(listItems.join(', '));
    listItems = [];
  };

  markdown.split(/\r?\n/).forEach((line) => {
    const listItem = line.match(/^\s*(?:[-+*]|\d+[.)])\s+(.+)$/);

    if (listItem) {
      listItems.push(stripInlineMarkdown(listItem[1]));
      return;
    }

    appendList();

    const plainLine = stripInlineMarkdown(line.replace(/^\s*(?:#{1,6}|>)\s*/, ''));
    if (plainLine) textParts.push(plainLine);
  });

  appendList();

  return textParts.join(' ').replace(/\s+/g, ' ').trim();
};
