import { getEvergreenUrl } from "utils/environmentVariables";

export enum DiffType {
  Addition = "addition",
  Context = "context",
  Deletion = "deletion",
  Filestat = "filestat",
}

export const getDiffLineType = (line: string): DiffType => {
  if (line.startsWith("+++") || line.startsWith("---")) {
    return DiffType.Filestat;
  }
  if (line.startsWith("+")) {
    return DiffType.Addition;
  }
  if (line.startsWith("-")) {
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

export const isNewFileDiff = (line: string): boolean =>
  line.startsWith("diff --git");

export const isCommitBoundary = (line: string): boolean => line === "---";

export const getRawDiffUrl = (
  versionId: string | undefined,
  patchNumber: string | number = 0,
): string | null => {
  if (!versionId) {
    return null;
  }
  return `${getEvergreenUrl()}/rawdiff/${versionId}/?patch_number=${patchNumber}`;
};
