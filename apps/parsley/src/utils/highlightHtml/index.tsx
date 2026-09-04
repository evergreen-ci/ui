import { ReactNode } from "react";
import parse from "html-react-parser";
import Highlight, { highlightColorList } from "components/Highlight";
import { escapeTags } from "utils/escapeTags";
import { hasOverlappingRegex } from "utils/regex";
import { highlighter } from "./highlighter";

/**
 * `highlightHtml` adds highlights in the form of <mark> tags.
 * @param html - The html string to parse
 * @param searchTerm - The active search term as a regex expression
 * @param highlights - The active highlights as a regex expression
 * @returns - html string converted to an array of domNodes with highlighted text
 */
const highlightHtml = (
  html: string = "",
  searchTerm: RegExp | undefined = undefined,
  highlights: RegExp | undefined = undefined,
) => {
  const escapedHtml = escapeTags(html);

  return parse(escapedHtml, {
    replace: (domNode) => {
      if (domNode.type !== "text") {
        return;
      }

      // Keep decoded log content as text nodes and insert only application-created
      // highlights as elements. Reparsing a combined HTML string could interpret
      // entity-encoded log content as markup.
      let searchedText: ReactNode[] = [domNode.data];
      if (searchTerm) {
        let searchMatchIndex = 0;
        searchedText = highlighter(searchTerm, domNode.data, (match) => {
          const key = `search-${searchMatchIndex}`;
          searchMatchIndex += 1;
          return (
            <Highlight key={key} data-testid="highlight">
              {match}
            </Highlight>
          );
        });
      }

      const shouldApplyHighlights =
        highlights &&
        !hasOverlappingRegex(searchTerm, highlights, domNode.data);

      if (!shouldApplyHighlights) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{searchedText}</>;
      }

      let highlightMatchIndex = 0;
      const highlightedText = searchedText.flatMap((node) => {
        if (typeof node !== "string") {
          return node;
        }

        return highlighter(highlights, node, (match, index) => {
          const key = `highlight-${highlightMatchIndex}`;
          highlightMatchIndex += 1;
          return (
            <Highlight
              key={key}
              color={highlightColorList[index % highlightColorList.length]}
              data-testid="highlight"
            >
              {match}
            </Highlight>
          );
        });
      });

      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <>{highlightedText}</>;
    },
  });
};

export default highlightHtml;
