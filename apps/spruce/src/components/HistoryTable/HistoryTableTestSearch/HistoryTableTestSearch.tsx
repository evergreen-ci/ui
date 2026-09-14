import TextInput from "components/TextInputWithValidation";
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

  const handleOnSubmit = (input: string) => {
    onSubmit();
    handleSubmit({ category: TestStatus.Failed, value: input });
  };

  return (
    <div className={styles.contentWrapper}>
      <TextInput
        aria-label="history-table-test-search-input"
        clearOnSubmit
        label="Filter by Failed Tests"
        onSubmit={handleOnSubmit}
        placeholder="Search test name regex"
        type="search"
        validator={validateRegexp}
        validatorErrorMessage="Invalid regular expression"
      />
    </div>
  );
};
