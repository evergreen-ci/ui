import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import {
  Body,
  BodyProps,
  Overline,
  OverlineProps,
} from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import {
  hoverStyles,
  overlineStyles,
} from "components/styles/SearchableDropdown";
import { size } from "constants/tokens";
import { FavoriteStar } from "./FavoriteStar";

const { blue } = palette;

interface OptionProps {
  displayName: string;
  projectIdentifier: string;
  isFavorite: boolean;
  onClick: (identifier: string) => void;
  isSelected: boolean;
}

const ProjectOption: React.FC<OptionProps> = ({
  displayName,
  isFavorite,
  isSelected,
  onClick,
  projectIdentifier,
}) => (
  <ProjectOptionContainer
    onClick={() => onClick(projectIdentifier)}
    role="button"
  >
    <FavoriteStar
      isFavorite={isFavorite}
      projectIdentifier={projectIdentifier}
    />
    <Label bolded={isSelected} data-cy="project-display-name">
      {displayName || projectIdentifier}
    </Label>
    {isSelected && <CheckmarkIcon fill={blue.base} glyph="Checkmark" />}
  </ProjectOptionContainer>
);

const Label = styled(Body)<BodyProps & { bolded: boolean }>`
  font-weight: ${({ bolded }) => (bolded ? "bold" : "normal")};
`;

const ProjectOptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
  padding: ${size.xxs} 0;
  padding-left: ${size.xxs};
  ${hoverStyles}
`;

interface OptionGroupProps {
  name: string;
  repoIdentifier?: string;
  canClickOnRepoGroup?: boolean;
  projects: {
    displayName: string;
    identifier: string;
    isFavorite: boolean;
  }[];
  onClick: (identifier: string) => void;
  value: string | undefined;
}
export const ProjectOptionGroup: React.FC<OptionGroupProps> = ({
  canClickOnRepoGroup = false,
  name,
  onClick,
  projects,
  repoIdentifier,
  value,
}) => (
  <OptionGroupContainer>
    {/* if it's the project settings page and it's not the "" group, make the header clickable */}
    {canClickOnRepoGroup ? (
      <GroupHeader
        css={hoverStyles}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        onClick={() => onClick(repoIdentifier)}
        role="button"
      >
        {name}
      </GroupHeader>
    ) : (
      <GroupHeader>{name}</GroupHeader>
    )}

    <ListContainer>
      {projects?.map((project) => (
        <ProjectOption
          key={project.identifier}
          isSelected={
            value === project.displayName || value === project.identifier
          }
          onClick={onClick}
          projectIdentifier={project.identifier}
          {...project}
        />
      ))}
    </ListContainer>
  </OptionGroupContainer>
);

const ListContainer = styled.div`
  margin: 0;
  padding: 0;
`;

const GroupHeader = styled(Overline)<OverlineProps>`
  ${overlineStyles}
`;

const OptionGroupContainer = styled.div`
  word-break: normal;
  overflow-wrap: anywhere;
`;

const CheckmarkIcon = styled(Icon)`
  margin-left: auto;
  margin-right: ${size.xs};
`;
