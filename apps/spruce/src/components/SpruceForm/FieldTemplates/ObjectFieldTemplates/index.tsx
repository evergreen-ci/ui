import styled from "@emotion/styled";
import { Banner } from "@leafygreen-ui/banner";
import { Subtitle } from "@leafygreen-ui/typography";
import { ObjectFieldTemplateProps } from "@rjsf/utils";
import Accordion from "@evg-ui/lib/components/Accordion";
import { fontSize, size } from "@evg-ui/lib/constants/tokens";
import { getFields } from "components/SpruceForm/utils";
import { SpruceFormContainer } from "../../Container";

export const ObjectFieldTemplate = ({
  description,
  fieldPathId,
  properties,
  registry,
  required,
  title,
  uiSchema = {},
}: ObjectFieldTemplateProps) => {
  const { DescriptionFieldTemplate, TitleFieldTemplate } = registry.templates;
  const errors = uiSchema["ui:errors"] ?? [];
  const warnings = uiSchema["ui:warnings"] ?? [];
  const dataCy = uiSchema["ui:data-cy"];
  const dataTestId = uiSchema["ui:data-testid"];
  return (
    <fieldset
      css={uiSchema["ui:elementWrapperCSS"]}
      data-cy={dataCy}
      data-testid={dataTestId}
      id={fieldPathId.$id}
    >
      {(uiSchema["ui:title"] || title) && (
        <TitleContainer>
          <TitleFieldTemplate
            id={`${fieldPathId.$id}__title`}
            registry={registry}
            required={required}
            schema={registry.rootSchema}
            title={title || uiSchema["ui:title"] || ""}
            uiSchema={uiSchema}
          />
        </TitleContainer>
      )}
      {description && (
        <DescriptionFieldTemplate
          description={description}
          id={`${fieldPathId.$id}__description`}
          registry={registry}
          schema={registry.rootSchema}
          uiSchema={uiSchema}
        />
      )}
      {!!errors.length && (
        <StyledBanner data-testid="error-banner" variant="danger">
          {errors.join(", ")}
        </StyledBanner>
      )}
      {!!warnings.length && (
        <StyledBanner data-testid="warning-banner" variant="warning">
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

export const CardFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  fieldPathId,
  properties,
  registry,
  schema,
  title,
  uiSchema = {},
}) => {
  const {
    "ui:data-testid": dataTestId,
    "ui:description": uiDescription,
    "ui:objectFieldCss": objectFieldCss,
    "ui:title": uiTitle,
    "ui:warnings": warnings = [],
  } = uiSchema;
  const { DescriptionFieldTemplate } = registry.templates;
  const description = uiDescription || schema.description;
  return (
    <SpruceFormContainer
      data-testid={dataTestId}
      description={
        description && (
          <DescriptionFieldTemplate
            description={description}
            id={`${fieldPathId.$id}__description`}
            registry={registry}
            schema={schema}
            uiSchema={uiSchema}
          />
        )
      }
      id={`${fieldPathId.$id}__title`}
      objectFieldCss={objectFieldCss}
      scrollMarginTop={cardScrollMarginTop}
      title={uiTitle || title}
    >
      {!!warnings.length && (
        <StyledBanner data-testid="warning-banner" variant="warning">
          {warnings.join(", ")}
        </StyledBanner>
      )}
      {properties.map((prop) => prop.content)}
    </SpruceFormContainer>
  );
};

const cardScrollMarginTop = 72;

export const AccordionFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  disabled,
  fieldPathId,
  properties,
  readonly,
  title,
  uiSchema = {},
}) => {
  const isDisabled = disabled || readonly;
  const defaultOpen = uiSchema["ui:defaultOpen"] ?? !isDisabled;
  const uiTitle = uiSchema["ui:title"];
  const numberedTitle = uiSchema["ui:numberedTitle"];
  const index = getIndex(fieldPathId.$id);

  return (
    <Accordion
      defaultOpen={defaultOpen}
      title={
        numberedTitle && index !== null
          ? `${numberedTitle} ${index + 1}`
          : uiTitle || title
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
  const dataTestId = uiSchema?.["ui:data-testid"];
  const css = uiSchema?.["ui:elementWrapperCSS"];
  const fields = getFields(properties, formData?.isDisabled ?? false);

  return (
    <RowContainer css={css} data-testid={dataTestId}>
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
const getIndex = (id: string): number | null => {
  if (!id) return null;

  const stringIndex = id.substring(id.lastIndexOf("_") + 1);
  const index = Number(stringIndex);
  return Number.isInteger(index) ? index : null;
};
