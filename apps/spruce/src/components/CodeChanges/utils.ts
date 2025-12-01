export enum DiffType {
  Addition = "addition",
  Context = "context",
  Deletion = "deletion",
  Filestat = "filestat",
}

// Determine if a diff line is an addition, deletion, or context
export const getDiffLineType = (line: string): DiffType => {
  if (line.substring(0, 3) === "+++") {
    return DiffType.Filestat;
  } else if (line.substring(0, 3) === "---") {
    return DiffType.Filestat;
  } else if (line[0] === "+") {
    return DiffType.Addition;
  } else if (line[0] === "-") {
    return DiffType.Deletion;
  }
  return DiffType.Context;
};

export const getLineStyle = (type: DiffType): React.CSSProperties => {
  switch (type) {
    case DiffType.Addition:
      return { backgroundColor: "#9fa" };
    case DiffType.Deletion:
      return { backgroundColor: "#faa" };
    case DiffType.Filestat:
      return { fontWeight: "bold" };
    default:
      return {};
  }
};

// Check if a line starts a new file diff
export const isNewFileDiff = (line: string): boolean =>
  line.indexOf("diff --git") === 0;

// Check if a line is a commit boundary
export const isCommitBoundary = (line: string): boolean => line === "---";

// Extract filename from a "diff --git" line
// Format: "diff --git a/path/to/file b/path/to/file"
export const extractFileNameFromDiffLine = (line: string): string | null => {
  if (!isNewFileDiff(line)) {
    return null;
  }
  // Extract the part after "diff --git "
  const parts = line.substring(11).trim().split(/\s+/);
  if (parts.length >= 2) {
    // Get the second path (b/path/to/file) and remove the "b/" prefix
    const filePath = parts[1];
    if (filePath.startsWith("b/")) {
      return filePath.substring(2);
    }
    // Fallback: if no "b/" prefix, try the first path without "a/" prefix
    if (parts[0].startsWith("a/")) {
      return parts[0].substring(2);
    }
    return filePath;
  }
  return null;
};

// Check if a filename matches the target filename
// Handles cases where the diff line might have "a/" or "b/" prefixes
export const matchesFileName = (
  diffLine: string,
  targetFileName: string,
): boolean => {
  const extractedFileName = extractFileNameFromDiffLine(diffLine);
  if (!extractedFileName) {
    return false;
  }
  return extractedFileName === targetFileName;
};
