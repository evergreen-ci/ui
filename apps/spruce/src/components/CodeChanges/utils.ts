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
