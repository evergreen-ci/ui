import { css } from "@emotion/react";

export const CLASSNAME_LINE_LINK = "line-link";
export const CLASSNAME_LINE_CONTAINER = "line";
export const CLASSNAME_ACTIVE_LINE = "selected-line";

const getLineContentDiv = (content: string) => {
  const lineContentDiv = document.createElement("div");
  lineContentDiv.innerHTML = content;
  return lineContentDiv;
};

const parseHash = () => {
  let hash = window.location.hash.toString();
  hash = hash.length > 1 ? hash.substring(2) : hash;
  return parseInt(hash, 10);
};

const toggleLineHighlight = (e: Event) => {
  e.preventDefault();

  const currentLineNumber = parseHash();
  const elementId = (e?.currentTarget as HTMLAnchorElement)?.hash;
  const newLineNumber = parseInt(elementId.substring(1), 10);

  if (!isNaN(newLineNumber) && newLineNumber >= 0) {
    removeHighlightLine(currentLineNumber);
    setLine(newLineNumber);
  }
};

const getLineLink = (lineNumber: number) => {
  const lineLink = document.createElement("a");
  lineLink.classList.add(CLASSNAME_LINE_LINK);
  lineLink.href = `#${lineNumber}`;
  lineLink.innerHTML = "🔗";
  lineLink.title = `Link to line ${lineNumber}`;
  lineLink.onclick = toggleLineHighlight;
  return lineLink;
};

const addHighlightLine = (lineNumber: number) => {
  document
    .getElementById(`L${lineNumber}`)
    ?.classList?.add(CLASSNAME_ACTIVE_LINE);
};

const removeHighlightLine = (lineNumber: number) => {
  document
    .getElementById(`L${lineNumber}`)
    ?.classList?.remove(CLASSNAME_ACTIVE_LINE);
};

const setLine = (lineNumber: number) => {
  history.replaceState(null, "", `#L${lineNumber}`);
  addHighlightLine(lineNumber);
};

interface LineContainerInput {
  style?: React.CSSProperties;
  htmlContent: string;
  lineNumber: number;
}

export const getLineContainer = ({
  htmlContent,
  lineNumber,
  style,
}: LineContainerInput) => {
  const lineLink = getLineLink(lineNumber);
  const lineContentDiv = getLineContentDiv(htmlContent);

  const lineContainer = document.createElement("div");
  lineContainer.classList.add(CLASSNAME_LINE_CONTAINER);
  lineContainer.id = `L${lineNumber}`;

  if (style) {
    Object.assign(lineContainer.style, style);
  }

  lineContainer.appendChild(lineLink);
  lineContainer.appendChild(lineContentDiv);
  return lineContainer;
};

export const styles = css`
  .${CLASSNAME_ACTIVE_LINE} {
    background-color: #ffc;

    .${CLASSNAME_LINE_LINK} {
      opacity: 1 !important;
    }
  }

  .${CLASSNAME_LINE_CONTAINER} {
    display: flex;
    align-items: center;
  }

  .${CLASSNAME_LINE_LINK} {
    cursor: pointer;
    margin-right: 8px;
    padding: 0 4px;
    opacity: 0.4;
    transition: opacity 0.2s;
  }

  .${CLASSNAME_LINE_LINK}:hover {
    opacity: 1;
  }
`;
