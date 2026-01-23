import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useProjectSettingsAnalytics } from "analytics";
import { SpruceForm } from "components/SpruceForm";
import {
  AttachProjectToNewRepoMutation,
  AttachProjectToNewRepoMutationVariables,
} from "gql/generated/types";
import { ATTACH_PROJECT_TO_NEW_REPO } from "gql/mutations";

type ModalProps = {
  githubOrgs: string[];
  handleClose: () => void;
  open: boolean;
  projectId: string;
  repoName: string;
  repoOwner: string;
};

export const MoveRepoModal: React.FC<ModalProps> = ({
  githubOrgs,
  handleClose,
  open,
  projectId,
  repoName,
  repoOwner,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useProjectSettingsAnalytics();

  const form = moveRepoForm(githubOrgs);

  const [formState, setFormState] = useState(form.defaultFormData);
  const [hasError, setHasError] = useState(true);

  const [attachProjectToNewRepo] = useMutation<
    AttachProjectToNewRepoMutation,
    AttachProjectToNewRepoMutationVariables
  >(ATTACH_PROJECT_TO_NEW_REPO, {
    onCompleted(attachProjectMutation) {
      const { repoRefId } = attachProjectMutation?.attachProjectToNewRepo ?? {};
      dispatchToast.success(`Successfully attached to repo ${repoRefId}`);
    },
    onError(err) {
      dispatchToast.error(
        `There was an error attaching the project: ${err.message}`,
      );
    },
    refetchQueries: [
      "ProjectSettings",
      "RepoSettings",
      "ViewableProjectRefs",
      "GithubProjectConflicts",
    ],
  });

  const onConfirm = () => {
    const newOwner = formState.owner;
    const newRepo = formState.repo;
    attachProjectToNewRepo({
      variables: {
        project: {
          projectId,
          newOwner,
          newRepo,
        },
      },
    });
    sendEvent({
      name: "Clicked move project to new repo button",
      "repo.owner": newOwner,
      "repo.name": newRepo,
    });
    handleClose();
  };

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: handleClose,
      }}
      confirmButtonProps={{
        children: "Move project",
        disabled: hasError,
        onClick: onConfirm,
      }}
      data-cy="move-repo-modal"
      open={open}
      title="Move to New Repo"
      variant="danger"
    >
      <StyledBody>
        Currently this project is using default settings for the repo{" "}
        {repoOwner}/{repoName}. Attach to an existing repo or create a new one
        to which unconfigured settings in this project will default.
      </StyledBody>
      <StyledBody>
        Any GitHub features that can only be enabled on one branch will be
        disabled on this branch if there is a conflict with existing branches.
      </StyledBody>
      <SpruceForm
        formData={formState}
        onChange={({ errors, formData }) => {
          setHasError(errors.length > 0);
          setFormState(formData);
        }}
        schema={form.schema}
        uiSchema={form.uiSchema}
      />
    </ConfirmationModal>
  );
};

const StyledBody = styled(Body)<BodyProps>`
  margin-bottom: ${size.xs};
`;

const moveRepoForm = (githubOrgs: string[]) => ({
  defaultFormData: {
    owner: githubOrgs[0],
    repo: "",
  },
  schema: {
    type: "object" as const,
    required: ["owner", "repo"],
    properties: {
      owner: {
        type: "string" as const,
        title: "New Owner",
        oneOf: githubOrgs.map((org) => ({
          type: "string" as const,
          title: org,
          enum: [org],
        })),
      },
      repo: {
        type: "string" as const,
        title: "New Repository Name",
        minLength: 1,
        format: "noSpaces",
      },
    },
  },
  uiSchema: {
    owner: {
      "ui:data-cy": "new-owner-select",
      "ui:allowDeselect": false,
    },
    repo: {
      "ui:data-cy": "new-repo-input",
    },
  },
});
