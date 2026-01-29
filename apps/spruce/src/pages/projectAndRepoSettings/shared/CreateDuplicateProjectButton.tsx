import { cloneElement, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { PlusButton, Size, Variant } from "components/Buttons";
import {
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables,
} from "gql/generated/types";
import { USER_PROJECT_SETTINGS_PERMISSIONS } from "gql/queries";
import { CopyProjectModal } from "./CopyProjectModal";
import { CreateProjectModal } from "./CreateProjectModal";
import { ProjectType } from "./tabs/utils";

const NewProjectButton = (
  <PlusButton
    data-cy="new-project-button"
    size={Size.Small}
    variant={Variant.Primary}
  >
    New project
  </PlusButton>
);

interface Props {
  id?: string;
  identifier: string;
  label: string;
  owner: string;
  projectType: ProjectType;
  repo: string;
}

export const CreateDuplicateProjectButton: React.FC<Props> = ({
  id,
  identifier,
  label,
  owner,
  projectType,
  repo,
}) => {
  const { data } = useQuery<
    UserProjectSettingsPermissionsQuery,
    UserProjectSettingsPermissionsQueryVariables
  >(USER_PROJECT_SETTINGS_PERMISSIONS, {
    variables: { projectIdentifier: identifier },
    skip: !identifier,
  });

  const canCreateProject = data?.user?.permissions?.canCreateProject ?? false;
  const projectPermissions = data?.user?.permissions?.projectPermissions ?? {
    edit: false,
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);

  if (!canCreateProject) {
    return null;
  }

  return (
    <>
      {projectType === ProjectType.Repo ? (
        // Use cloneElement so that the same component can be used as a button and a Menu trigger
        cloneElement(NewProjectButton, {
          onClick: () => setCreateModalOpen(true),
        })
      ) : (
        <Menu
          data-cy="new-project-menu"
          open={menuOpen}
          setOpen={setMenuOpen}
          trigger={NewProjectButton}
        >
          <MenuItem
            data-cy="create-project-button"
            onClick={() => {
              setMenuOpen(false);
              setCreateModalOpen(true);
            }}
          >
            Create new project
          </MenuItem>
          <MenuItem
            data-cy="copy-project-button"
            disabled={!projectPermissions?.edit}
            onClick={() => {
              setMenuOpen(false);
              setCopyModalOpen(true);
            }}
          >
            Duplicate current project
          </MenuItem>
        </Menu>
      )}
      {owner && repo && (
        <CreateProjectModal
          handleClose={() => setCreateModalOpen(false)}
          open={createModalOpen}
          owner={owner}
          repo={repo}
        />
      )}
      {id && (
        <CopyProjectModal
          handleClose={() => setCopyModalOpen(false)}
          id={id}
          label={label}
          open={copyModalOpen}
        />
      )}
    </>
  );
};
