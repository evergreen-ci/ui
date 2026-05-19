import styled from "@emotion/styled";
import { InlineDefinition } from "@leafygreen-ui/inline-definition";
import { size } from "@evg-ui/lib/constants/tokens";
import { CustomKeyValueRenderConfig } from "components/Settings/EventLog/EventDiffTable/utils/keyRenderer";
import { ProjectSettingsTabRoutes } from "constants/routes";

const StyledInlineDefinition = styled(InlineDefinition)`
  text-underline-offset: ${size.xxs};
`;

// Project variable values are intentionally not displayed in diffs — both
// in the Event Log and the pre-save confirmation modal — so that secrets
// are not leaked through the UI.
const renderVars = (val: string) => (
  <StyledInlineDefinition definition="Evergreen does not display project variable values for security reasons.">
    {val}
  </StyledInlineDefinition>
);

const variablesConfig: CustomKeyValueRenderConfig = {
  "vars.vars": renderVars,
};

export const getDiffRenderConfig = (
  tab: ProjectSettingsTabRoutes,
): CustomKeyValueRenderConfig | undefined => {
  switch (tab) {
    case ProjectSettingsTabRoutes.Variables:
      return variablesConfig;
    default:
      return undefined;
  }
};

export { renderVars };
