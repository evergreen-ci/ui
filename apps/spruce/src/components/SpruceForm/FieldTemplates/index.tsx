import styled from "@emotion/styled";
import { Banner } from "@leafygreen-ui/banner";
import { palette } from "@leafygreen-ui/palette";
import { FieldTemplateProps } from "@rjsf/core";
import { size } from "@evg-ui/lib/constants/tokens";
import { TitleField as CustomTitleField } from "../CustomFields";
import { SpruceWidgetProps } from "../Widgets/types";

export * from "./ArrayFieldTemplates";
export * from "./ObjectFieldTemplates";

const { gray } = palette;

// Custom field template that does not render fields' titles, as this is handled by LeafyGreen widgets
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
  const fieldCss = uiSchema["ui:fieldCss"];
  const errors = uiSchema["ui:errors"] ?? (rawErrors?.length ? rawErrors : []);
  const warnings: NonNullable<SpruceWidgetProps["options"]["warnings"]> =
    uiSchema["ui:warnings"] ?? [];
  return !hidden ? (
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
          {warnings.map((w, i) =>
            typeof w === "string" || w instanceof String ? (
              <div key={`warning-${i}`}>{w}</div> // eslint-disable-line  react/no-array-index-key
            ) : (
              w
            ),
          )}
        </StyledBanner>
      )}
      <DefaultFieldContainer
        border={border}
        className={classNames}
        css={fieldCss}
        data-cy={fieldDataCy}
        id={`${sectionId} ${id}`}
      >
        {children}
      </DefaultFieldContainer>
    </>
  ) : null;
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
