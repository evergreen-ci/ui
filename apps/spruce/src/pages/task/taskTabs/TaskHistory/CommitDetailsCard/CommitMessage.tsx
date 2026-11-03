import Accordion, {
  AccordionCaretAlign,
} from "@evg-ui/lib/components/Accordion";
import { useTaskHistoryAnalytics } from "analytics";
import { CommitDescription } from "components/CommitDescription";
import { isProduction } from "utils/environmentVariables";
import { TaskHistoryTask } from "../types";
import styles from "./CommitDetailsCard.module.css";
import FailedTestsTable from "./FailedTestsTable";

interface CommitMessageProps {
  task: TaskHistoryTask;
}

export const CommitMessage: React.FC<CommitMessageProps> = ({ task }) => {
  const { sendEvent } = useTaskHistoryAnalytics();
  const onToggle = (expanded: boolean) =>
    sendEvent({ name: "Toggled commit description", expanded });

  const { order, tests, version } = task;
  const { message, user } = version;
  const author = user.displayName ?? user.id;

  return (
    <div className={styles.row}>
      {tests.testResults.length > 0 ? (
        <Accordion
          caretAlign={AccordionCaretAlign.Start}
          className={styles.fullWidthAccordion}
          onToggle={({ isVisible }) =>
            sendEvent({
              name: "Toggled failed tests table",
              open: isVisible,
            })
          }
          title={
            <CommitDescription
              author={author}
              message={message}
              onToggle={onToggle}
            />
          }
        >
          <FailedTestsTable tests={tests} />
        </Accordion>
      ) : (
        <CommitDescription
          author={author}
          message={message}
          onToggle={onToggle}
        />
      )}
      {/* Use order label to debug issues with pagination. */}
      {!isProduction() && (
        <div className={styles.orderLabel}>Order: {order}</div>
      )}
    </div>
  );
};
