import { Body, Text, TextStyle } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
import { cx } from "@evg-ui/lib/utils/css";
import { FavoriteStar } from "./FavoriteStar";
import styles from "./ProjectOptionGroup.module.css";

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
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- pre-existing violation, surfaced by the Emotion conversion
  <div
    className={styles.optionContainer}
    onClick={() => onClick(projectIdentifier)}
    role="button"
  >
    <FavoriteStar
      isFavorite={isFavorite}
      projectIdentifier={projectIdentifier}
    />
    <Body
      className={cx(styles.label, isSelected && styles.labelSelected)}
      data-testid="project-display-name"
    >
      {displayName || projectIdentifier}
    </Body>
    {isSelected && (
      <Icon
        className={styles.checkmarkIcon}
        fill="var(--via-color-blue-400)"
        glyph="Checkmark"
      />
    )}
  </div>
);

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
        onClick: () => onClick(repoIdentifier, true),
        role: "button",
      }
    : {};

  return (
    <div className={styles.optionGroupContainer}>
      <Text
        className={cx(
          styles.groupHeader,
          canClickOnRepoGroup && styles.groupHeaderClickable,
        )}
        elementType="div"
        textStyle={TextStyle.heading6}
        {...groupHeaderProps}
      >
        {name}
      </Text>
      <div className={styles.listContainer}>
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
      </div>
    </div>
  );
};
