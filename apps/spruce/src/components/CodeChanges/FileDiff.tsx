import { useRef } from "react";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body } from "@leafygreen-ui/typography";
import { useParams, useSearchParams } from "react-router-dom";
import styles from "./FileDiff.module.css";
import { useFileDiffStream } from "./useFileDiffStream";
import { getRawDiffUrl } from "./utils";

export const FileDiff: React.FC = () => {
  const { versionId } = useParams<{ versionId: string }>();
  const [searchParams] = useSearchParams();
  const containerRef = useRef<HTMLPreElement | null>(null);

  const fileName = decodeURIComponent(searchParams.get("file_name") || "");
  const patchNumber = searchParams.get("patch_number") || "0";
  const url = getRawDiffUrl(versionId, patchNumber);

  const { error, isLoading } = useFileDiffStream({
    url,
    containerRef,
    fileName,
  });

  if (!fileName) {
    return (
      <div className={styles.container}>
        <div>Error: file_name parameter is required</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div>Error loading file diff: {error.message}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {fileName && (
        <div className={styles.fileNameContainer}>
          <Body weight="medium">{fileName}</Body>
        </div>
      )}
      {isLoading && <ListSkeleton />}
      <pre ref={containerRef} />
    </div>
  );
};
