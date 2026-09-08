import { ReactNode } from "react";

type ReplaceFunction = (match: string, matchIndex: number) => ReactNode;

/**
 * `highlighter` is a function that takes a regular expression, a string, and a function that
 * returns a React node with the function applied to the matching elements.
 * It keeps unmatched text as strings instead of combining the text and replacements into an HTML string.
 * @param regexp - the regular expression to match
 * @param text - the text to match the regular expression against
 * @param replaceFunction - the function to apply to the matching elements
 * @returns React nodes with the matching elements replaced by the function
 */
export const highlighter = (
  regexp: RegExp,
  text: string,
  replaceFunction: ReplaceFunction,
) => {
  const highlightedText: ReactNode[] = [];
  let previousMatchEnd = 0;

  // Use replace to obtain each match's offset while keeping text and replacement nodes separate.
  text.replace(regexp, (match, ...replaceArguments) => {
    const hasNamedGroups =
      typeof replaceArguments[replaceArguments.length - 1] === "object";
    const offsetIndex = replaceArguments.length - (hasNamedGroups ? 3 : 2);
    const offset = replaceArguments[offsetIndex] as number;
    const captureGroups = replaceArguments.slice(0, offsetIndex);
    const matchedGroup = captureGroups.findIndex(
      (group) => group !== undefined,
    );

    highlightedText.push(text.slice(previousMatchEnd, offset));
    highlightedText.push(
      replaceFunction(match, matchedGroup === -1 ? 0 : matchedGroup),
    );
    previousMatchEnd = offset + match.length;

    return match;
  });

  highlightedText.push(text.slice(previousMatchEnd));

  return highlightedText;
};
