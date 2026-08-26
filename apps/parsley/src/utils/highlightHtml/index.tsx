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
      if (domNode.type === "text") {
        let searchMatchIndex = 0;
        const searchedText = searchTerm
          ? highlighter(searchTerm, domNode.data, (match) => {
              const key = `search-${searchMatchIndex}`;
              searchMatchIndex += 1;
              return (
                <Highlight key={key} data-testid="highlight">
                  {match}
                </Highlight>
              );
            })
          : [domNode.data];

        const shouldApplyHighlights =
          highlights &&
          !hasOverlappingRegex(searchTerm, highlights, domNode.data);
        let highlightMatchIndex = 0;
        const highlightedText = shouldApplyHighlights
          ? searchedText.flatMap((node) =>
              typeof node === "string"
                ? highlighter(highlights, node, (match, index) => {
                    const key = `highlight-${highlightMatchIndex}`;
                    highlightMatchIndex += 1;
                    return (
                      <Highlight
                        key={key}
                        color={
                          highlightColorList[index % highlightColorList.length]
                        }
                        data-testid="highlight"
                      >
                        {match}
                      </Highlight>
                    );
                  })
                : node,
            )
          : searchedText;

        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{highlightedText}</>;
      }
    },
  });
};

export default highlightHtml;
