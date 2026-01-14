import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import Icon, { Size } from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { getFields } from "components/SpruceForm/utils";

const { yellow } = palette;

/** Variable names that are reserved for Backstage. */
const reservedVariableNames = ["__default_bucket", "__default_bucket_role_arn"];

export const VariableRow: React.FC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties" | "uiSchema">
> = ({ formData, properties, uiSchema }) => {
  const [variableName, variableValue, isPrivate] = getFields(
    properties,
    formData.isDisabled,
  );
  const [, , , isAdminOnly] = getFields(properties, false);

  const repoData = uiSchema?.options?.repoData;
  const inRepo = repoData
    ? // @ts-expect-error: FIXME. This comment was added by an automated script.
      repoData.vars.some(({ varName }) => varName === formData.varName)
    : false;

  const isReserved = reservedVariableNames.includes(formData.varName);

  return (
    <RowContainer>
      <LeftColumn showWarning={inRepo || isReserved}>
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
      </LeftColumn>
      <div>
        {variableValue}
        <OptionRow>
          {isPrivate}
          {isAdminOnly}
        </OptionRow>
      </div>
    </RowContainer>
  );
};

const OverrideIcon = styled(Icon)`
  margin-right: ${size.xxs};
  margin-top: 1px;
  vertical-align: text-top;
`;

const LeftColumn = styled.div`
  color: ${yellow.dark2};
  padding-right: ${size.s};

  ${(props: { showWarning?: boolean }): string =>
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    props.showWarning &&
    `input {
    border-color: ${yellow.dark2};
  }`}
`;

const RowContainer = styled.div`
  display: flex;
  margin-bottom: ${size.s};

  > div {
    flex-grow: 1;
    max-width: 50%;
  }
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
