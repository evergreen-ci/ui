import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import Icon, { Size } from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { getFields } from "components/SpruceForm/utils";
import { VariablesFormState } from "./types";

const { yellow } = palette;

/** Variable names that are reserved for Backstage. */
const reservedVariableNames = ["__default_bucket", "__default_bucket_role_arn"];

export const VariableRow: React.FC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties" | "uiSchema">
> = ({ formData, properties, uiSchema }) => {
  const [variableName, variableValue, , isPrivate] = getFields(
    properties,
    formData.isDisabled,
  );
  const [, , variableDescription, , isAdminOnly] = getFields(properties, false);

  const repoData: VariablesFormState["repoData"] = uiSchema?.options?.repoData;
  const inRepo = repoData
    ? repoData.vars.some(({ varName }) => varName === formData.varName)
    : false;

  const isReserved = reservedVariableNames.includes(formData.varName);

  return (
    <RowContainer>
      <Name showWarning={inRepo || isReserved}>
        {variableName}
        {inRepo && (
          <span data-cy="override-warning">
            <OverrideIcon glyph="ImportantWithCircle" size={Size.Small} />
            This will override the variable of the same name defined in the
            repo.
          </span>
        )}
        {isReserved && (
          <span data-cy="reserved-warning">
            <OverrideIcon glyph="ImportantWithCircle" size={Size.Small} />
            This variable name is reserved for Backstage.
          </span>
        )}
      </Name>
      <Description>{variableDescription}</Description>
      <Value>
        {variableValue}
        <OptionRow>
          {isPrivate}
          {isAdminOnly}
        </OptionRow>
      </Value>
    </RowContainer>
  );
};

const OverrideIcon = styled(Icon)`
  margin-right: ${size.xxs};
  margin-top: 1px;
  vertical-align: text-top;
`;

const flexSpacingCss = css`
  flex: 0 0 30%;
`;

const RowContainer = styled.div`
  display: flex;
  margin-bottom: ${size.s};
  gap: ${size.s};
`;

const Name = styled.div`
  ${flexSpacingCss};

  color: ${yellow.dark2};
  ${(props: { showWarning?: boolean }): string =>
    props.showWarning
      ? `input {
    border-color: ${yellow.dark2};
  }`
      : ""}
`;

const Description = styled.div`
  ${flexSpacingCss};
`;

const Value = styled.div`
  ${flexSpacingCss};
`;

const OptionRow = styled.div`
  display: flex;
  margin-bottom: ${size.s};

  > div {
    flex-shrink: 0;
    margin-right: ${size.s};
    width: fit-content;
  }
`;
