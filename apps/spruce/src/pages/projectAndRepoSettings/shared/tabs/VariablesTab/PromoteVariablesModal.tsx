import { useReducer, useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import { Checkbox } from "@leafygreen-ui/checkbox";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  PromoteVarsToRepoMutation,
  PromoteVarsToRepoMutationVariables,
} from "gql/generated/types";
import { PROMOTE_VARS_TO_REPO } from "gql/mutations";
import { useHasProjectOrRepoEditPermission } from "hooks";

type Action =
  | { type: "checkCheckbox"; names: string[] }
  | { type: "uncheckCheckbox"; names: string[] };

const reducer = (state: Set<string>, action: Action): Set<string> => {
  switch (action.type) {
    case "checkCheckbox":
      action.names.forEach((name) => state.add(name));
      return new Set(state);
    case "uncheckCheckbox":
      action.names.forEach((name) => state.delete(name));
      return new Set(state);
    default:
      throw new Error("Unknown action type");
  }
};

type ProjectVariable = {
  name: string;
  inRepo: boolean;
};

interface PromoteVariablesModalProps {
  handleClose: () => void;
  open: boolean;
  projectId: string;
  variables: ProjectVariable[];
}

export const PromoteVariablesModal: React.FC<PromoteVariablesModalProps> = ({
  handleClose,
  open,
  projectId,
  variables,
}) => {
  const dispatchToast = useToastContext();
  const [promoteVarsToRepo] = useMutation<
    PromoteVarsToRepoMutation,
    PromoteVarsToRepoMutationVariables
  >(PROMOTE_VARS_TO_REPO, {
    onCompleted() {
      dispatchToast.success(`Successfully moved variables to repo.`);
    },
    onError(err) {
      dispatchToast.error(
        `There was an error moving the variables: ${err.message}`,
      );
    },
  });

  const [selected, setSelected] = useReducer(reducer, new Set<string>());

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const handleClickCheckbox = (name) => (e) => {
    setSelected({
      type: e.target.checked ? "checkCheckbox" : "uncheckCheckbox",
      names: [name],
    });
  };

  const handleSelectAll = () => {
    const names = variables.map(({ name }) => name);
    setSelected({
      type:
        selected.size === variables.length
          ? "uncheckCheckbox"
          : "checkCheckbox",
      names,
    });
  };

  const onConfirm = () => {
    promoteVarsToRepo({
      variables: {
        projectId,
        varNames: Array.from(selected),
      },
      refetchQueries: ["ProjectSettings", "RepoSettings"],
    });
    handleClose();
  };

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: handleClose,
      }}
      confirmButtonProps={{
        children: getButtonText(selected.size),
        disabled: selected.size === 0,
        onClick: onConfirm,
      }}
      data-cy="promote-vars-modal"
      open={open}
      title="Move Variables to Repo"
    >
      <Body>
        Variables will be moved to the repo to which this project is attached,
        allowing them to be used by all attached projects. They will be deleted
        from this project.
      </Body>
      <SelectAllContainer>
        <Button onClick={handleSelectAll} size={Size.XSmall}>
          {selected.size === variables.length ? "Deselect all" : "Select all"}
        </Button>
      </SelectAllContainer>
      {variables.map(({ inRepo, name }) => (
        <Checkbox
          key={name}
          checked={selected.has(name)}
          data-cy="promote-var-checkbox"
          label={
            <>
              {name}
              {inRepo && <DuplicateVarTooltip />}
            </>
          }
          onClick={handleClickCheckbox(name)}
        />
      ))}
    </ConfirmationModal>
  );
};

const getButtonText = (selectedCount: number) =>
  `Move ${selectedCount === 0 ? "" : selectedCount} variable${
    selectedCount === 1 ? "" : "s"
  }`;

const DuplicateVarTooltip: React.FC = () => (
  <Tooltip
    data-cy="duplicate-var-tooltip"
    justify="middle"
    trigger={
      <IconContainer data-cy="duplicate-var-icon">
        <Icon glyph="ImportantWithCircle" size="small" />
      </IconContainer>
    }
    triggerEvent="hover"
  >
    <TooltipContainer>
      This variable is also defined in the repo. Moving it will replace the repo
      value with the value found in this project.
    </TooltipContainer>
  </Tooltip>
);

interface PromoteVariablesModalButtonProps {
  projectId: string;
  variables: ProjectVariable[];
}

export const PromoteVariablesModalButton: React.FC<
  PromoteVariablesModalButtonProps
> = ({ projectId, variables }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { canEdit } = useHasProjectOrRepoEditPermission(projectId);

  return (
    <>
      {modalOpen && (
        <PromoteVariablesModal
          handleClose={() => setModalOpen(false)}
          open={modalOpen}
          projectId={projectId}
          variables={variables}
        />
      )}
      <Button
        data-cy="promote-vars-button"
        disabled={!canEdit}
        onClick={() => setModalOpen(true)}
        size={Size.Small}
      >
        Move variables to repo
      </Button>
    </>
  );
};

const SelectAllContainer = styled.div`
  margin: ${size.s} 0 ${size.xs} 0;
`;

const TooltipContainer = styled.div`
  max-width: 300px;
`;

const IconContainer = styled.span`
  margin-left: ${size.xxs};
  top: 2px;
  vertical-align: text-top;
`;
