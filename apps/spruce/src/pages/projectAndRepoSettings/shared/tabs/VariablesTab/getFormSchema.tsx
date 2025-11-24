import { css } from "@emotion/react";
import { Description } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { redactedVarsDocumentationUrl } from "constants/externalResources";
import { ProjectType } from "../utils";
import { VariablesFormState } from "./types";
import { VariableRow } from "./VariableRow";

export const getFormSchema = (
  projectType: ProjectType,
  repoData?: VariablesFormState,
  modalButton?: JSX.Element,
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    definitions: {
      varsArray: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            varName: {
              type: "string" as const,
              title: "Variable Name",
              default: "",
              minLength: 1,
              format: "noStartingOrTrailingWhitespace",
            },
            varValue: {
              type: "string" as const,
              title: "Variable",
              default: "",
              minLength: 1,
            },
            isPrivate: {
              type: "boolean" as const,
              title: "Private",
              default: true,
            },
            isAdminOnly: {
              type: "boolean" as const,
              title: "Admin Only",
            },
            isDisabled: {
              type: "boolean" as const,
            },
          },
        },
      },
    },
    type: "object" as const,
    properties: {
      vars: { $ref: "#/definitions/varsArray" },
      ...(repoData && {
        repoData: {
          type: "object" as const,
          title: "Repo Variables",
          ...(repoData.vars.length === 0 && {
            description: "Repo has no variables defined.",
          }),
          properties: {
            vars: { $ref: "#/definitions/varsArray" },
          },
        },
      }),
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    vars: {
      "ui:addButtonText": "Add variables",
      "ui:descriptionNode": getDescription(projectType),
      "ui:fullWidth": true,
      "ui:orderable": false,
      "ui:secondaryButton": modalButton,
      "ui:showLabel": false,
      items: {
        "ui:ObjectFieldTemplate": VariableRow,
        "ui:label": false,
        options: { repoData },
        varName: {
          "ui:data-cy": "var-name-input",
          "ui:elementWrapperCSS": nameCss,
        },
        varValue: {
          "ui:data-cy": "var-value-input",
          "ui:elementWrapperCSS": varCSS,
          "ui:widget": widgets.TextareaWidget,
        },
        isPrivate: {
          "ui:tooltipDescription":
            "Private variables have redacted values on the Project Page and the API and cannot be updated.",
          "ui:data-cy": "var-private-input",
        },
        isAdminOnly: {
          "ui:tooltipDescription":
            "Admin only variables can only be used by project admins.",
          "ui:data-cy": "var-admin-input",
        },
      },
    },
    repoData: {
      vars: {
        "ui:fullWidth": true,
        "ui:readonly": true,
        "ui:showLabel": false,
        items: {
          "ui:ObjectFieldTemplate": VariableRow,
          varName: {
            "ui:elementWrapperCSS": nameCss,
          },
          varValue: {
            "ui:elementWrapperCSS": varCSS,
            "ui:widget": widgets.TextareaWidget,
          },
        },
      },
    },
  },
});

const getDescription = (projectType: ProjectType) => {
  if (projectType === ProjectType.Repo) {
    return (
      <Description>
        Variables defined here will be used by all branches attached to this
        project, unless a variable is specifically overridden in the branch.
        Variables will be redacted in logs if they meet{" "}
        <StyledLink href={redactedVarsDocumentationUrl}>
          certain conditions
        </StyledLink>
        .
      </Description>
    );
  }
  if (projectType === ProjectType.AttachedProject) {
    return (
      <Description>
        Variables are sourced from both the repo-level and branch-level
        settings. If a variable name is defined at both the repo-level and
        branch-level, then the branch variable will override the repo variable.
        Variables will be redacted in logs if they meet{" "}
        <StyledLink href={redactedVarsDocumentationUrl}>
          certain conditions
        </StyledLink>
        .
      </Description>
    );
  }
};

const varCSS = css`
  margin-bottom: ${size.xxs};
`;

const nameCss = css`
  margin-bottom: ${size.xs};
`;
