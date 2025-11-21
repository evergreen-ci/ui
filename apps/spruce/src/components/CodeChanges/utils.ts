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
