import { useRef } from "react";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useParams, useSearchParams } from "react-router-dom";
import styles from "./PatchDiff.module.css";
import { usePatchDiffStream } from "./usePatchDiffStream";
import { getRawDiffUrl } from "./utils";

export const PatchDiff: React.FC = () => {
  const { versionId } = useParams<{ versionId: string }>();
  const [searchParams] = useSearchParams();
  const containerRef = useRef<HTMLPreElement | null>(null);

  const patchNumber = searchParams.get("patch_number") || "0";
  const url = getRawDiffUrl(versionId, patchNumber);

  const { error, isLoading } = usePatchDiffStream({
    url,
    containerRef,
  });

  if (error) {
    return (
      <div className={styles.container}>
        <div>Error loading diff: {error.message}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {isLoading && <ListSkeleton />}
      <pre ref={containerRef} />
    </div>
  );
};
