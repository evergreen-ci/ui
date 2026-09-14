import { useState } from "react";
import {
  AlertDialog,
  Button,
  DialogRoot,
  Text,
  TextField,
} from "@via-ds/components";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { useWaterfallAnalytics } from "analytics/waterfall/useWaterfallAnalytics";
import { WaterfallFilterOptions } from "../types";
import styles from "./GitCommitSearch.module.css";

interface GitCommitSearchProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const GitCommitSearch: React.FC<GitCommitSearchProps> = ({
  open,
  setOpen,
}) => {
  const { sendEvent } = useWaterfallAnalytics();
  const [, setQueryParams] = useQueryParams();

  const [commitHash, setCommitHash] = useState("");

  const onCancel = () => {
    setOpen(false);
  };

  const onConfirm = () => {
    sendEvent({ name: "Filtered by git commit" });
    setQueryParams({
      [WaterfallFilterOptions.Revision]: commitHash,
    });
    onCancel();
  };

  return (
    <DialogRoot isOpen={open} onOpenChange={setOpen}>
      <AlertDialog data-testid="git-commit-search-modal" variant="primary">
        <Text slot="title">Search by Git Commit Hash</Text>
        <Text className={styles.description} textStyle="description">
          Searching for a git hash will jump to the commit in the waterfall. If
          the commit is not found, the waterfall will be reset.
        </Text>
        <TextField
          label="Git Commit Hash"
          onChange={(value) => setCommitHash(value.trim())}
          onKeyDown={(e) =>
            e.key === "Enter" && commitHash.length >= 7 && onConfirm()
          }
          value={commitHash}
        />
        <Button onPress={onCancel} slot="cancel">
          Cancel
        </Button>
        <Button
          isDisabled={commitHash.length < 7}
          onPress={onConfirm}
          slot="action"
        >
          Submit
        </Button>
      </AlertDialog>
    </DialogRoot>
  );
};
