import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { Subtitle } from "@leafygreen-ui/typography";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import Accordion from "@evg-ui/lib/components/Accordion";
import { fontSize, size } from "@evg-ui/lib/constants/tokens";
import { getFields } from "components/SpruceForm/utils";
import { SpruceFormContainer } from "../../Container";

export const ObjectFieldTemplate = ({
  DescriptionField,
  TitleField,
  description,
  idSchema,
  properties,
  required,
  title,
  uiSchema,
}: ObjectFieldTemplateProps) => {
  const errors = uiSchema["ui:errors"] ?? [];
  const warnings = uiSchema["ui:warnings"] ?? [];
  const tooltipTitle = uiSchema["ui:tooltipTitle"] ?? null;
  return (
    <fieldset css={uiSchema["ui:elementWrapperCSS"]} id={idSchema.$id}>
      {(uiSchema["ui:title"] || title) && (
        <TitleContainer>
          <TitleField
            id={`${idSchema.$id}__title`}
            required={required}
            title={title || uiSchema["ui:title"]}
          />
          {tooltipTitle && <InfoSprinkle>{tooltipTitle}</InfoSprinkle>}
        </TitleContainer>
      )}
      {description && (
        <DescriptionField
          description={description}
          id={`${idSchema.$id}__description`}
        />
      )}
      {!!errors.length && (
        <StyledBanner data-cy="error-banner" variant="danger">
          {errors.join(", ")}
        </StyledBanner>
      )}
      {!!warnings.length && (
        <StyledBanner data-cy="warning-banner" variant="warning">
          {warnings.join(", ")}
        </StyledBanner>
      )}
      {properties.map((prop) => prop.content)}
    </fieldset>
  );
};

const TitleContainer = styled.div`
  align-items: baseline;
  display: flex;
  gap: ${size.xs};
`;

/**
 * `CardFieldTemplate` is a custom ObjectFieldTemplate that renders a card with a title and a list of properties.
 * @param props - ObjectFieldTemplateProps
 * @param props.DescriptionField - DescriptionField
 * @param props.idSchema - idSchema
 * @param props.properties - properties
 * @param props.schema - schema
 * @param props.title - title
 * @param props.uiSchema - uiSchema
 * @param props.uiSchema."ui:data-cy" - data-cy
 * @param props.uiSchema."ui:description" - description
 * @param props.uiSchema."ui:title" - title
 * @param props.uiSchema."ui:objectFieldCss" - css style
 * @returns JSX.Element
 */
export const CardFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  DescriptionField,
  idSchema,
  properties,
  schema,
  title,
  uiSchema: {
    "ui:data-cy": dataCy,
    "ui:description": uiDescription,
    "ui:objectFieldCss": objectFieldCss,
    "ui:title": uiTitle,
  },
}) => {
  const description = uiDescription || schema.description;
  return (
    <SpruceFormContainer
      data-cy={dataCy}
      description={
        description && (
          <DescriptionField
            description={description}
            id={`${idSchema.$id}__description`}
          />
        )
      }
      id={`${idSchema.$id}__title`}
      objectFieldCss={objectFieldCss}
      scrollMarginTop={cardScrollMarginTop}
      title={uiTitle || title}
    >
      {properties.map((prop) => prop.content)}
    </SpruceFormContainer>
  );
};

const cardScrollMarginTop = 72;

/**
 * `AccordionFieldTemplate` is a custom ObjectFieldTemplate that renders an accordion with a title and a list of properties.
 * @param props - ObjectFieldTemplateProps
 * @param props.disabled - disabled
 * @param props.idSchema - idSchema
 * @param props.properties - properties
 * @param props.title - title
 * @param props.uiSchema - uiSchema
 * @param props.readonly - readonly property // jsdoc/valid-types is disabled for this file due to // https://github.com/jsdoc-type-pratt-parser/jsdoc-type-pratt-parser/issues/104
 * @returns JSX.Element
 */
export const AccordionFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  disabled,
  idSchema,
  properties,
  readonly,
  title,
  uiSchema,
}) => {
  const isDisabled = disabled || readonly;
  const defaultOpen = uiSchema["ui:defaultOpen"] ?? !isDisabled;
  const displayTitle = uiSchema["ui:displayTitle"];
  const numberedTitle = uiSchema["ui:numberedTitle"];
  const index = getIndex(idSchema.$id);

  return (
    <Accordion
      defaultOpen={defaultOpen}
      title={
        numberedTitle ? `${numberedTitle} ${index + 1}` : displayTitle || title
      }
      titleTag={AccordionTitle}
    >
      {properties.map(({ content }) => content)}
    </Accordion>
  );
};

/**
 * `FieldRow` is a custom ObjectFieldTemplate that renders the fields in a row.
 * @param props - ObjectFieldTemplateProps
 * @param props.formData - formData
 * @param props.properties - properties
 * @param props.uiSchema - uiSchema
 * @returns JSX.Element
 */
export const FieldRow: React.FC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties" | "uiSchema">
> = ({ formData, properties, uiSchema }) => {
  const dataCy = uiSchema?.["ui:data-cy"];
  const css = uiSchema?.["ui:elementWrapperCSS"];
  const fields = getFields(properties, formData.isDisabled);

  return (
    <RowContainer css={css} data-cy={dataCy}>
      {fields}
    </RowContainer>
  );
};

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${size.l};
`;

const AccordionTitle = styled(Subtitle)`
  font-size: ${fontSize.l};
  margin: ${size.xs} 0;
`;

const StyledBanner = styled(Banner)`
  margin-bottom: ${size.s};
`;

// Extract index of the current field via its ID
const getIndex = (id: string): number => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  if (!id) return null;

  const stringIndex = id.substring(id.lastIndexOf("_") + 1);
  const index = Number(stringIndex);
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  return Number.isInteger(index) ? index : null;
};
