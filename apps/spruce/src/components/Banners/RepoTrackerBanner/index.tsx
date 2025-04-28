import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import TextInput from "@leafygreen-ui/text-input";
import { InlineCode } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { ConfirmationModal } from "components/ConfirmationModal";
import {
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables,
  RepotrackerErrorQuery,
  RepotrackerErrorQueryVariables,
  SetLastRevisionMutation,
  SetLastRevisionMutationVariables,
} from "gql/generated/types";
import { SET_LAST_REVISION } from "gql/mutations";
import {
  USER_PROJECT_SETTINGS_PERMISSIONS,
  REPOTRACKER_ERROR,
} from "gql/queries";
import { PortalBanner } from "../PortalBanner";

interface RepoTrackerBannerProps {
  projectIdentifier: string;
}
export const RepoTrackerBanner: React.FC<RepoTrackerBannerProps> = ({
  projectIdentifier,
}) => {
  const dispatchToast = useToastContext();
  const [openModal, setOpenModal] = useState(false);
  const [baseRevision, setBaseRevision] = useState("");

  const { data: repoTrackerData } = useQuery<
    RepotrackerErrorQuery,
    RepotrackerErrorQueryVariables
  >(REPOTRACKER_ERROR, {
    variables: { projectIdentifier },
    skip: !projectIdentifier,
  });
  const hasRepoTrackerError =
    repoTrackerData?.project?.repotrackerError?.exists ?? false;

  const { data: permissionsData } = useQuery<
    UserProjectSettingsPermissionsQuery,
    UserProjectSettingsPermissionsQueryVariables
  >(USER_PROJECT_SETTINGS_PERMISSIONS, {
    variables: { projectIdentifier },
    // If there's no repoTracker error, there is no need to determine whether the current user is an admin.
    skip: !hasRepoTrackerError,
  });
  const isProjectAdmin =
    permissionsData?.user?.permissions?.projectPermissions?.edit ?? false;

  const [setLastRevision] = useMutation<
    SetLastRevisionMutation,
    SetLastRevisionMutationVariables
  >(SET_LAST_REVISION, {
    onCompleted: () => {
      dispatchToast.success(
        "Successfully updated merge base revision. The repoTracker job has been scheduled to run.",
      );
    },
    onError: (err) => {
      dispatchToast.error(
        `Error when attempting to update merge base revision: ${err.message}`,
      );
    },
  });

  const resetModal = () => {
    setOpenModal(false);
    setBaseRevision("");
  };

  const onConfirm = () => {
    setLastRevision({
      variables: { projectIdentifier, revision: baseRevision },
      refetchQueries: ["RepotrackerError"],
    });
    resetModal();
  };

  if (!hasRepoTrackerError) {
    return null;
  }
  return (
    <>
      <PortalBanner
        banner={
          <Banner data-cy="repoTracker-error-banner" variant="danger">
            {isProjectAdmin ? (
              <span>
                The project was unable to build. Please specify a new base
                revision by clicking{" "}
                <ModalTriggerText
                  data-cy="repoTracker-error-trigger"
                  onClick={() => setOpenModal(true)}
                >
                  here
                </ModalTriggerText>
                .
              </span>
            ) : (
              "The project was unable to build. Please reach out to a project admin to fix."
            )}
          </Banner>
        }
      />
      <ConfirmationModal
        cancelButtonProps={{
          onClick: resetModal,
        }}
        confirmButtonProps={{
          children: "Confirm",
          disabled: baseRevision.length < 40,
          onClick: onConfirm,
        }}
        data-cy="repoTracker-error-modal"
        open={openModal}
        setOpen={setOpenModal}
        title="Enter New Base Revision"
      >
        <ModalDescription>
          The current base revision{" "}
          <InlineCode>
            {repoTrackerData?.project?.repotrackerError?.invalidRevision}
          </InlineCode>{" "}
          cannot be found on branch &apos;{repoTrackerData?.project?.branch}
          &apos;. In order to resume tracking the repository, please enter a new
          base revision.
        </ModalDescription>
        <TextInput
          description="Specify a full 40 character hash."
          label="Base Revision"
          onChange={(e) => setBaseRevision(e.target.value)}
          value={baseRevision}
        />
      </ConfirmationModal>
    </>
  );
};

const ModalDescription = styled.div`
  margin-bottom: ${size.xs};
`;

const ModalTriggerText = styled.span`
  font-weight: bold;
  text-decoration-line: underline;
  text-underline-offset: 2px;
  text-decoration-thickness: 2px;
  :hover {
    cursor: pointer;
  }
`;
