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
  modalButton?: React.JSX.Element,
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    definitions: {
      varsArray: {
        items: {
          properties: {
            isAdminOnly: {
              title: "Admin Only",
              type: "boolean" as const,
            },
            isDisabled: {
              type: "boolean" as const,
            },
            isPrivate: {
              default: true,
              title: "Private",
              type: "boolean" as const,
            },
            varDescription: {
              default: "",
              title: "Description",
              type: "string" as const,
            },
            varName: {
              default: "",
              format: "noStartingOrTrailingWhitespace",
              minLength: 1,
              title: "Variable Name",
              type: "string" as const,
            },
            varValue: {
              default: "",
              minLength: 1,
              title: "Variable",
              type: "string" as const,
            },
          },
          type: "object" as const,
        },
        type: "array" as const,
      },
    },
    properties: {
      vars: { $ref: "#/definitions/varsArray" },
      ...(repoData && {
        repoData: {
          title: "Repo Variables",
          type: "object" as const,
          ...(repoData.vars.length === 0 && {
            description: "Repo has no variables defined.",
          }),
          properties: {
            vars: { $ref: "#/definitions/varsArray" },
          },
        },
      }),
    },
    type: "object" as const,
  },
  uiSchema: {
    repoData: {
      vars: {
        items: {
          "ui:ObjectFieldTemplate": VariableRow,
          varDescription: {
            "ui:widget": widgets.TextareaWidget,
          },
          varName: {
            "ui:elementWrapperCSS": nameCss,
          },
          varValue: {
            "ui:elementWrapperCSS": varCSS,
            "ui:widget": widgets.TextareaWidget,
          },
        },
        "ui:fullWidth": true,
        "ui:readonly": true,
        "ui:showLabel": false,
      },
    },
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    vars: {
      items: {
        isAdminOnly: {
          "ui:data-cy": "var-admin-input",
          "ui:tooltipDescription":
            "Admin only variables can only be used by project admins.",
        },
        isPrivate: {
          "ui:data-cy": "var-private-input",
          "ui:tooltipDescription":
            "Private variables have redacted values on the Project Page and the API and cannot be updated.",
        },
        options: { repoData },
        "ui:label": false,
        "ui:ObjectFieldTemplate": VariableRow,
        varDescription: {
          "ui:data-cy": "var-description-input",
          "ui:widget": widgets.TextareaWidget,
        },
        varName: {
          "ui:data-cy": "var-name-input",
          "ui:elementWrapperCSS": nameCss,
        },
        varValue: {
          "ui:data-cy": "var-value-input",
          "ui:elementWrapperCSS": varCSS,
          "ui:widget": widgets.TextareaWidget,
        },
      },
      "ui:addButtonText": "Add variables",
      "ui:descriptionNode": getDescription(projectType),
      "ui:fullWidth": true,
      "ui:orderable": false,
      "ui:secondaryButton": modalButton,
      "ui:showLabel": false,
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
  margin-bottom: ${size.xxs};
`;
