import { Button } from "@leafygreen-ui/button";
import { useLGButtonRouterLink } from "hooks/useLGButtonRouterLink";

interface Props {
  onClick: () => void;
  to: string;
}

export const TaskHistoryTestsButton: React.FC<Props> = ({ onClick, to }) => {
  const Link = useLGButtonRouterLink(to);
  return (
    <Button
      key="task-history"
      as={Link}
      data-cy="task-history-tests-btn"
      onClick={onClick}
      size="xsmall"
      to={to}
    >
      History
    </Button>
  );
};
