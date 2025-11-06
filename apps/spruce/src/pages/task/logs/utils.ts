import { css } from "@emotion/react";

const CLASSNAME_LINE_LINK = "line-link";
const CLASSNAME_LINE_CONTAINER = "line";
export const CLASSNAME_ACTIVE_LINE = "selected-line";

const getLineContentDiv = (content: string) => {
  const lineContentDiv = document.createElement("div");
  lineContentDiv.innerHTML = content;
  return lineContentDiv;
};

const parseHash = () => {
  let hash = window.location.hash.toString();
  hash = hash.length > 1 ? hash.substr(2) : hash;
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
  lineLink.classList.add("line-link");
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
  color?: string;
  htmlContent: string;
  lineNumber: number;
}

export const getLineContainer = ({
  color,
  htmlContent,
  lineNumber,
}: LineContainerInput) => {
  const lineLink = getLineLink(lineNumber);
  const lineContentDiv = getLineContentDiv(htmlContent);

  const lineContainer = document.createElement("div");
  lineContainer.classList.add(CLASSNAME_LINE_CONTAINER);
  lineContainer.id = `L${lineNumber}`;

  if (color) {
    lineContainer.style.color = color;
  }

  lineContainer.appendChild(lineLink);
  lineContainer.appendChild(lineContentDiv);
  return lineContainer;
};

export interface ValidatedParams {
  taskId: string;
  execution: number;
  origin: string;
}

export const validateParams = (
  taskId: string | undefined,
  execution: string | null,
  origin: string | null,
): ValidatedParams => {
  if (!taskId) {
    throw new Error("Task ID not specified");
  }

  const executionNum = parseInt(execution || "", 10);
  if (isNaN(executionNum)) {
    throw new Error("Execution not specified");
  }

  if (!origin) {
    throw new Error("Log origin type not specified");
  }

  return {
    taskId,
    execution: executionNum,
    origin,
  };
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
