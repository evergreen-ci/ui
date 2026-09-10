import { useState } from "react";
import { skipToken, useMutation, useQuery } from "@apollo/client/react";
import { Banner } from "@via-ds/components/banner";
import { Button, Content, Dialog, DialogRoot, Footer, Header } from "@via-ds/components";
import { Text } from "@via-ds/components/typography";
import { TextField } from "@via-ds/components/text-field";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  RepotrackerErrorQuery,
  RepotrackerErrorQueryVariables,
  SetLastRevisionMutation,
  SetLastRevisionMutationVariables,
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables,
} from "gql/generated/types";
import { SET_LAST_REVISION } from "gql/mutations";
import {
  REPOTRACKER_ERROR,
  USER_PROJECT_SETTINGS_PERMISSIONS,
} from "gql/queries";
import { PortalBanner } from "../PortalBanner";
import styles from "./index.module.css";

interface RepotrackerBannerProps {
  projectIdentifier: string;
}
export const RepotrackerBanner: React.FC<RepotrackerBannerProps> = ({
  projectIdentifier,
}) => {
  const dispatchToast = useToastContext();
  const [openModal, setOpenModal] = useState(false);
  const [baseRevision, setBaseRevision] = useState("");

  const { data: repotrackerData } = useQuery<
    RepotrackerErrorQuery,
    RepotrackerErrorQueryVariables
  >(
    REPOTRACKER_ERROR,
    projectIdentifier ? { variables: { projectIdentifier } } : skipToken,
  );
  const hasRepotrackerError =
    repotrackerData?.project?.repotrackerError?.exists ?? false;

  const { data: permissionsData } = useQuery<
    UserProjectSettingsPermissionsQuery,
    UserProjectSettingsPermissionsQueryVariables
  >(
    USER_PROJECT_SETTINGS_PERMISSIONS,
    hasRepotrackerError ? { variables: { projectIdentifier } } : skipToken,
  );
  const isProjectAdmin =
    permissionsData?.user?.permissions?.projectPermissions?.edit ?? false;

  const [setLastRevision] = useMutation<
    SetLastRevisionMutation,
    SetLastRevisionMutationVariables
  >(SET_LAST_REVISION, {
    onCompleted: () => {
      dispatchToast.success(
        "Successfully updated merge base revision. The repotracker job has been scheduled to run.",
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

  if (!hasRepotrackerError) {
    return null;
  }
  return (
    <>
      <PortalBanner
        banner={
          <Banner data-testid="repotracker-error-banner" variant="danger">
            {isProjectAdmin ? (
              <span>
                The project was unable to build. Please specify a new base
                revision by clicking{" "}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- pre-existing violation, surfaced by the Emotion conversion */}
                <span
                  className={styles.modalTriggerText}
                  data-testid="repotracker-error-trigger"
                  onClick={() => setOpenModal(true)}
                >
                  here
                </span>
                .
              </span>
            ) : (
              "The project was unable to build. Please reach out to a project admin to fix."
            )}
          </Banner>
        }
      />
      <DialogRoot isOpen={openModal} onOpenChange={setOpenModal}>
        <Dialog>
          <Header>
            <Text slot="title">Enter New Base Revision</Text>
          </Header>
          <Content>
            <div className={styles.modalDescription}>
              The current base revision{" "}
              <Text elementType="code" textStyle="inlineCode">
                {repotrackerData?.project?.repotrackerError?.invalidRevision}
              </Text>{" "}
              cannot be found on branch &apos;{repotrackerData?.project?.branch}
              &apos;. In order to resume tracking the repository, please enter a
              new base revision.
            </div>
            <TextField
              description="Specify a full 40 character hash."
              label="Base Revision"
              onChange={(val: string) => setBaseRevision(val)}
              value={baseRevision}
            />
          </Content>
          <Footer>
            <Button onPress={resetModal}>Cancel</Button>
            <Button
              isDisabled={baseRevision.length < 40}
              onPress={onConfirm}
              variant="primary"
            >
              Confirm
            </Button>
          </Footer>
        </Dialog>
      </DialogRoot>
    </>
  );
};
