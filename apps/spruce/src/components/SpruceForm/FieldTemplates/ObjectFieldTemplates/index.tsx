import { Banner } from "@leafygreen-ui/banner";
import { Subtitle } from "@leafygreen-ui/typography";
import { ObjectFieldTemplateProps } from "@rjsf/utils";
import Accordion from "@evg-ui/lib/components/Accordion";
import { cx } from "@evg-ui/lib/utils/css";
import { emotionCssToClassName, getFields } from "components/SpruceForm/utils";
import { SpruceFormContainer } from "../../Container";
import styles from "./index.module.css";

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
      className={emotionCssToClassName(uiSchema["ui:elementWrapperCSS"])}
      data-cy={dataCy}
      data-testid={dataTestId}
      id={fieldPathId.$id}
    >
      {(uiSchema["ui:title"] || title) && (
        <div className={styles.titleContainer}>
          <TitleFieldTemplate
            id={`${fieldPathId.$id}__title`}
            registry={registry}
            required={required}
            schema={registry.rootSchema}
            title={title || uiSchema["ui:title"] || ""}
            uiSchema={uiSchema}
          />
        </div>
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
        <Banner
          className={styles.banner}
          data-testid="error-banner"
          variant="danger"
        >
          {errors.join(", ")}
        </Banner>
      )}
      {!!warnings.length && (
        <Banner
          className={styles.banner}
          data-testid="warning-banner"
          variant="warning"
        >
          {warnings.join(", ")}
        </Banner>
      )}
      {properties.map((prop) => prop.content)}
    </fieldset>
  );
};

export const CardFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  fieldPathId,
  properties,
  registry,
  schema,
  title,
  uiSchema = {},
}) => {
  const dataTestId = uiSchema["ui:data-testid"];
  const uiDescription = uiSchema["ui:description"];
  const objectFieldCss = uiSchema["ui:objectFieldCss"];
  const uiTitle = uiSchema["ui:title"];
  const warnings = uiSchema["ui:warnings"] ?? [];
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
        <Banner
          className={styles.banner}
          data-testid="warning-banner"
          variant="warning"
        >
          {warnings.join(", ")}
        </Banner>
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
  registry: _registry,
  title,
  uiSchema = {},
}) => {
  const isDisabled = disabled || readonly;
  const defaultOpen = uiSchema["ui:defaultOpen"] ?? !isDisabled;
  const uiTitle = uiSchema["ui:title"] ?? uiSchema["ui:displayTitle"];
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
  const rowCss = uiSchema?.["ui:elementWrapperCSS"];
  const fields = getFields(properties, formData?.isDisabled ?? false);

  return (
    <div
      className={cx(styles.rowContainer, emotionCssToClassName(rowCss))}
      data-testid={dataTestId}
    >
      {fields}
    </div>
  );
};

const AccordionTitle: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <Subtitle className={styles.accordionTitle}>{children}</Subtitle>;

// Extract index of the current field via its ID
const getIndex = (id: string): number | null => {
  if (!id) return null;

  const stringIndex = id.substring(id.lastIndexOf("_") + 1);
  const index = Number(stringIndex);
  return Number.isInteger(index) ? index : null;
};
