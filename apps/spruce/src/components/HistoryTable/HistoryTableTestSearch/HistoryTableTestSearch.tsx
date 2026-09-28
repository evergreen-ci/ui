import { useState } from "react";
import { SearchField } from "@via-ds/components/search-field";
import { useUpsertQueryParams } from "hooks";
import { TestStatus } from "types/history";
import { validators } from "utils";
import styles from "./HistoryTableTestSearch.module.css";

const { validateRegexp } = validators;

interface HistoryTableTestSearchProps {
  onSubmit?: () => void;
}

export const HistoryTableTestSearch: React.FC<HistoryTableTestSearchProps> = ({
  onSubmit = () => {},
}) => {
  const handleSubmit = useUpsertQueryParams();
  const [input, setInput] = useState("");

  const isInvalid = input !== "" && !validateRegexp(input);

  const handleOnSubmit = (value: string) => {
    if (!validateRegexp(value)) {
      return;
    }
    onSubmit();
    handleSubmit({ category: TestStatus.Failed, value });
    setInput("");
  };

  return (
    <div className={styles.contentWrapper}>
      <SearchField
        aria-label="history-table-test-search-input"
        errorMessage="Invalid regular expression"
        isInvalid={isInvalid}
        label="Filter by Failed Tests"
        onChange={setInput}
        onSubmit={handleOnSubmit}
        placeholder="Search test name regex"
        value={input}
      />
    </div>
  );
};
