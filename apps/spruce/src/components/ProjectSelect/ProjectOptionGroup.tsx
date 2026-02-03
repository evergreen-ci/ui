import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import {
  Body,
  BodyProps,
  Overline,
  OverlineProps,
} from "@leafygreen-ui/typography";
import { Icon } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import {
  hoverStyles,
  overlineStyles,
} from "components/styles/SearchableDropdown";
import { FavoriteStar } from "./FavoriteStar";

const { blue } = palette;

interface OptionProps {
  displayName: string;
  isFavorite: boolean;
  isSelected: boolean;
  onClick: (identifier: string) => void;
  projectIdentifier: string;
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
    <Label bolded={isSelected ? 1 : 0} data-cy="project-display-name">
      {displayName || projectIdentifier}
    </Label>
    {isSelected && <CheckmarkIcon fill={blue.base} glyph="Checkmark" />}
  </ProjectOptionContainer>
);

// bolded is a number because booleans aren't valid props to styled components.
const Label = styled(Body)<BodyProps & { bolded: number }>`
  font-weight: ${({ bolded }) => (bolded ? "bold" : "normal")};
`;

const CheckmarkIcon = styled(Icon)`
  margin-left: auto;
  margin-right: ${size.xs};
`;

const ProjectOptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
  padding: ${size.xxs};
  ${hoverStyles}
`;

interface OptionGroupProps {
  canClickOnRepoGroup?: boolean;
  name: string;
  onClick: (identifier: string, isRepo: boolean) => void;
  projects: {
    displayName: string;
    identifier: string;
    isFavorite: boolean;
  }[];
  repoIdentifier?: string;
  value: string | undefined;
}
export const ProjectOptionGroup: React.FC<OptionGroupProps> = ({
  canClickOnRepoGroup = false,
  name,
  onClick,
  projects,
  repoIdentifier = "",
  value,
}) => {
  const groupHeaderProps = canClickOnRepoGroup
    ? {
        css: hoverStyles,
        onClick: () => onClick(repoIdentifier, true),
        role: "button",
      }
    : {};

  return (
    <OptionGroupContainer>
      <GroupHeader {...groupHeaderProps}>{name}</GroupHeader>
      <ListContainer>
        {projects?.map((project) => (
          <ProjectOption
            key={project.identifier}
            isSelected={
              value === project.displayName || value === project.identifier
            }
            onClick={() => onClick(project.identifier, false)}
            projectIdentifier={project.identifier}
            {...project}
          />
        ))}
      </ListContainer>
    </OptionGroupContainer>
  );
};

const GroupHeader = styled(Overline)<OverlineProps>`
  ${overlineStyles}
`;

const ListContainer = styled.div`
  margin: 0;
  padding: 0;
`;

const OptionGroupContainer = styled.div`
  word-break: normal;
  overflow-wrap: anywhere;
`;
