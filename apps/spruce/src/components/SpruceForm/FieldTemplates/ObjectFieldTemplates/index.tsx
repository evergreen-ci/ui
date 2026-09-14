import { Banner } from "@leafygreen-ui/banner";
import { Subtitle } from "@leafygreen-ui/typography";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import Accordion from "@evg-ui/lib/components/Accordion";
import { cx } from "@evg-ui/lib/utils/css";
import { emotionCssToClassName, getFields } from "components/SpruceForm/utils";
import { SpruceFormContainer } from "../../Container";
import styles from "./index.module.css";

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
  const dataTestId = uiSchema["ui:data-testid"];
  return (
    <fieldset
      className={emotionCssToClassName(uiSchema["ui:elementWrapperCSS"])}
      data-testid={dataTestId}
      id={idSchema.$id}
    >
      {(uiSchema["ui:title"] || title) && (
        <div className={styles.titleContainer}>
          <TitleField
            id={`${idSchema.$id}__title`}
            required={required}
            title={title || uiSchema["ui:title"]}
          />
        </div>
      )}
      {description && (
        <DescriptionField
          description={description}
          id={`${idSchema.$id}__description`}
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

/**
 * `CardFieldTemplate` is a custom ObjectFieldTemplate that renders a card with a title and a list of properties.
 * @param props - ObjectFieldTemplateProps
 * @param props.DescriptionField - DescriptionField
 * @param props.idSchema - idSchema
 * @param props.properties - properties
 * @param props.schema - schema
 * @param props.title - title
 * @param props.uiSchema - uiSchema
 * @param props.uiSchema."ui:data-testid" - data-testid
 * @param props.uiSchema."ui:description" - description
 * @param props.uiSchema."ui:title" - title
 * @param props.uiSchema."ui:objectFieldCss" - css style
 * @param props.uiSchema."ui:warnings" - warning messages
 * @returns JSX.Element
 */
export const CardFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  DescriptionField,
  idSchema,
  properties,
  schema,
  title,
  uiSchema: {
    "ui:data-testid": dataTestId,
    "ui:description": uiDescription,
    "ui:objectFieldCss": objectFieldCss,
    "ui:title": uiTitle,
    "ui:warnings": warnings = [],
  },
}) => {
  const description = uiDescription || schema.description;
  return (
    <SpruceFormContainer
      data-testid={dataTestId}
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
  const dataTestId = uiSchema?.["ui:data-testid"];
  const rowCss = uiSchema?.["ui:elementWrapperCSS"];
  const fields = getFields(properties, formData.isDisabled);

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
const getIndex = (id: string): number => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  if (!id) return null;

  const stringIndex = id.substring(id.lastIndexOf("_") + 1);
  const index = Number(stringIndex);
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  return Number.isInteger(index) ? index : null;
};
