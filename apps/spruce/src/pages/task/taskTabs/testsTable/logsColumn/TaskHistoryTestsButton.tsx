import { Button } from "@leafygreen-ui/button";
import { Link } from "react-router-dom";

interface Props {
  onClick: () => void;
  to: string;
}

export const TaskHistoryTestsButton: React.FC<Props> = ({ onClick, to }) => (
  <Button
    key="task-history"
    as={Link}
    data-testid="task-history-tests-btn"
    onClick={onClick}
    size="xsmall"
    to={to}
  >
    History
  </Button>
);
