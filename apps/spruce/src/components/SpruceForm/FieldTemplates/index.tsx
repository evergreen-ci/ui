import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import { palette } from "@leafygreen-ui/palette";
import { FieldTemplateProps } from "@rjsf/core";
import { size } from "constants/tokens";
import { TitleField as CustomTitleField } from "../CustomFields";

export * from "./ArrayFieldTemplates";
export * from "./ObjectFieldTemplates";

const { gray } = palette;

// Custom field template that does not render fields' titles, as this is handled by LeafyGreen widgets
// @ts-expect-error: FIXME. This comment was added by an automated script.
export const DefaultFieldTemplate: React.FC<FieldTemplateProps> = ({
  children,
  classNames,
  description,
  hidden,
  id,
  label,
  rawErrors,
  schema,
  uiSchema,
}) => {
  const isNullType = schema.type === "null";
  const sectionId = uiSchema["ui:sectionId"] ?? "";
  const border = uiSchema["ui:border"];
  const showLabel = uiSchema["ui:showLabel"] ?? true;
  const fieldDataCy = uiSchema["ui:field-data-cy"];
  const descriptionNode = uiSchema["ui:descriptionNode"];
  const errors = uiSchema["ui:errors"] ?? (rawErrors?.length ? rawErrors : []);
  const warnings = uiSchema["ui:warnings"] ?? [];
  return (
    !hidden && (
      <>
        {isNullType && showLabel && (
          <CustomTitleField id={id} title={label} uiSchema={uiSchema} />
        )}
        {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
        {isNullType && <>{descriptionNode || description}</>}
        {isNullType && !!errors.length && (
          <StyledBanner data-cy="error-banner" variant="danger">
            {errors.join(", ")}
          </StyledBanner>
        )}
        {isNullType && !!warnings.length && (
          <StyledBanner data-cy="warning-banner" variant="warning">
            {warnings.join(", ")}
          </StyledBanner>
        )}
        <DefaultFieldContainer
          border={border}
          className={classNames}
          data-cy={fieldDataCy}
          id={`${sectionId} ${id}`}
        >
          {children}
        </DefaultFieldContainer>
      </>
    )
  );
};

const DefaultFieldContainer = styled.div<{ border?: "top" | "bottom" }>`
  ${({ border }) =>
    border &&
    `border-${border}: 1px solid ${gray.light1}; padding-${border}: ${size.s};`}
  width: 100%;
`;

const StyledBanner = styled(Banner)`
  margin: ${size.xs} 0;
`;
