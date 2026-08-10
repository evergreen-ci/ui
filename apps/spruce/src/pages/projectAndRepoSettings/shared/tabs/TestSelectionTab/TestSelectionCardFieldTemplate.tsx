import styled from "@emotion/styled";
import { Banner, Variant } from "@leafygreen-ui/banner";
import { Description } from "@leafygreen-ui/typography";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import { size } from "@evg-ui/lib/constants/tokens";
import { SpruceFormContainer } from "components/SpruceForm";

const sections = {
  project: {
    description: "Sets if the project can use test selection features or not.",
    title: "Project-Level Test Selection",
  },
  task: {
    description:
      "Controls whether test selection is enabled by default for patch tasks and mainline commit tasks.",
    title: "Task-Level Test Selection",
  },
};

export const TestSelectionCardFieldTemplate: React.FC<
  Pick<ObjectFieldTemplateProps, "properties" | "uiSchema">
> = ({ properties, uiSchema }) => {
  const allowed = properties.find(({ name }) => name === "allowed");
  const taskLevelSettings = properties.filter(({ name }) =>
    ["defaultEnabled", "mainlineDefaultEnabled"].includes(name),
  );
  const warnings = uiSchema["ui:warnings"] ?? [];

  return (
    <>
      <SpruceFormContainer
        description={<Description>{sections.project.description}</Description>}
        title={sections.project.title}
      >
        {allowed?.content}
      </SpruceFormContainer>
      <SpruceFormContainer
        description={<Description>{sections.task.description}</Description>}
        title={sections.task.title}
      >
        {!!warnings.length && (
          <StyledBanner variant={Variant.Warning}>
            {warnings.join(", ")}
          </StyledBanner>
        )}
        {taskLevelSettings.map(({ content, name }) => (
          <div key={name}>{content}</div>
        ))}
      </SpruceFormContainer>
    </>
  );
};

const StyledBanner = styled(Banner)`
  margin-bottom: ${size.s};
`;
