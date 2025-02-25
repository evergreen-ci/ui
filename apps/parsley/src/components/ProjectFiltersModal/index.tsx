import { css } from "@emotion/react";
import styled from "@emotion/styled";
import ConfirmationModal from "@leafygreen-ui/confirmation-modal";
import { Body } from "@leafygreen-ui/typography";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { useLogWindowAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import { useFilterParam } from "hooks/useFilterParam";
import { useTaskQuery } from "hooks/useTaskQuery";
import { SentryBreadcrumb, leaveBreadcrumb } from "utils/errorReporting";
import ProjectFilter from "./ProjectFilter";
import useSelectedFiltersState from "./state";

interface ProjectFiltersModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ProjectFiltersModal: React.FC<ProjectFiltersModalProps> = ({
  open,
  setOpen,
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const { dispatch, state } = useSelectedFiltersState();
  const [filters, setFilters] = useFilterParam();

  const { logMetadata } = useLogContext();
  const { buildID, execution, logType, taskID } = logMetadata ?? {};

  const { task } = useTaskQuery({ buildID, execution, logType, taskID });
  const { parsleyFilters } = task?.versionMetadata?.projectMetadata ?? {};

  const onConfirm = () => {
    // Apply selected filters.
    const newFilters = filters.concat(state.selectedFilters);
    setFilters(newFilters);

    // Send relevant tracking events.
    leaveBreadcrumb(
      "applied-project-filters",
      { filters: state.selectedFilters },
      SentryBreadcrumb.User,
    );
    sendEvent({
      "filter.expressions": state.selectedFilters.map((f) => f.expression),
      name: "Used project filters",
    });
    setOpen(false);
    dispatch({ type: "RESET" });
  };

  const onCancel = () => {
    setOpen(false);
    dispatch({ type: "RESET" });
  };

  return (
    <ConfirmationModal
      buttonText="Apply filters"
      css={css`
        z-index: ${zIndex.modal};
      `}
      data-cy="project-filters-modal"
      onCancel={onCancel}
      onConfirm={onConfirm}
      open={open}
      setOpen={setOpen}
      submitDisabled={state.selectedFilters.length === 0}
      title="Project Filters"
    >
      <Scrollable>
        {parsleyFilters && parsleyFilters.length > 0 ? (
          parsleyFilters.map((filter) => (
            <ProjectFilter
              key={filter.expression}
              active={!!filters.find((f) => f.expression === filter.expression)}
              addFilter={(filterToAdd) =>
                dispatch({ filterToAdd, type: "ADD_FILTER" })
              }
              filter={filter}
              removeFilter={(filterToRemove) => {
                dispatch({ filterToRemove, type: "REMOVE_FILTER" });
              }}
              selected={
                !!state.selectedFilters.find(
                  (f) => f.expression === filter.expression,
                )
              }
            />
          ))
        ) : (
          <Body data-cy="no-filters-message">
            No filters have been defined for this project.
          </Body>
        )}
      </Scrollable>
    </ConfirmationModal>
  );
};

const Scrollable = styled.div`
  max-height: 60vh;
  overflow-y: scroll;
`;

export default ProjectFiltersModal;
