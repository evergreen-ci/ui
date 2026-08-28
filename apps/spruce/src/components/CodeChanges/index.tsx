import { useQuery } from "@apollo/client/react";
import { Button } from "@leafygreen-ui/button";
import { Skeleton, TableSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body } from "@leafygreen-ui/typography";
import { useVersionAnalytics } from "analytics";
import { getVersionDiffRoute } from "constants/routes";
import {
  CodeChangesQuery,
  CodeChangesQueryVariables,
} from "gql/generated/types";
import { CODE_CHANGES } from "gql/queries";
import { Badge } from "./Badge";
import styles from "./index.module.css";
import { Table } from "./Table";

interface CodeChangesProps {
  disableDiffLinks?: boolean;
  patchId: string;
}
export const CodeChanges: React.FC<CodeChangesProps> = ({
  disableDiffLinks = false,
  patchId,
}) => {
  const { sendEvent } = useVersionAnalytics(patchId);
  const { data, error, loading } = useQuery<
    CodeChangesQuery,
    CodeChangesQueryVariables
  >(CODE_CHANGES, {
    variables: { id: patchId },
  });
  const { moduleCodeChanges } = data?.patch ?? {};

  if (loading) {
    return (
      <>
        <Skeleton className={styles.skeleton} />
        <TableSkeleton numCols={3} />
      </>
    );
  }
  if (error) {
    return <div id="patch-error">{error.message}</div>;
  }

  if (!moduleCodeChanges?.length) {
    return (
      <Body data-testid="no-code-changes">
        No code changes were applied, or the code changes are too large to
        display.
      </Body>
    );
  }
  return (
    <div data-testid="code-changes">
      {moduleCodeChanges?.map((modCodeChange, index) => {
        const { branchName, fileDiffs, rawLink } = modCodeChange;

        const additions = fileDiffs.reduce(
          (total, diff) => total + diff.additions,
          0,
        );
        const deletions = fileDiffs.reduce(
          (total, diff) => total + diff.deletions,
          0,
        );

        const codeChanges = (
          <Table
            disableDiffLinks={disableDiffLinks}
            fileDiffs={fileDiffs}
            moduleIndex={index}
            patchId={patchId}
          />
        );

        return (
          <div key={branchName}>
            <div className={styles.titleContainer}>
              <Body weight="medium">Changes on {branchName}:</Body>
              {!disableDiffLinks && (
                <>
                  <Button
                    data-testid="html-diff-btn"
                    href={getVersionDiffRoute(patchId, index)}
                    onClick={() =>
                      sendEvent({
                        name: "Clicked code changes diff link",
                        "diff.type": "patch",
                        "diff.format": "html",
                      })
                    }
                    size="small"
                    title="Open diff as html file"
                  >
                    HTML
                  </Button>
                  <Button
                    data-testid="raw-diff-btn"
                    href={rawLink}
                    onClick={() =>
                      sendEvent({
                        name: "Clicked code changes diff link",
                        "diff.type": "patch",
                        "diff.format": "raw",
                      })
                    }
                    size="small"
                    title="Open diff as raw file"
                  >
                    Raw
                  </Button>
                </>
              )}
              <Badge additions={additions} deletions={deletions} />
            </div>
            {codeChanges}
          </div>
        );
      })}
    </div>
  );
};
