import { memo, useMemo } from "react";
import highlightHtml from "utils/highlightHtml";

interface HighlighterProps {
  ["data-testid"]?: string;
  children: string;
  color?: string;
  highlights?: RegExp;
  searchTerm?: RegExp;
}

const Highlighter: React.FC<HighlighterProps> = memo((props) => {
  const {
    children: text,
    color,
    "data-testid": dataTestId,
    highlights,
    searchTerm,
  } = props;

  const htmlToRender = useMemo(
    () => highlightHtml(text, searchTerm, highlights),
    [text, searchTerm, highlights],
  );

  return (
    <span data-testid={dataTestId} style={{ color }}>
      {htmlToRender}
    </span>
  );
});

Highlighter.displayName = "Highlighter";
export default Highlighter;
