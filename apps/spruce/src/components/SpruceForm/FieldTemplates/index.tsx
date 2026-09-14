import { Banner } from "@leafygreen-ui/banner";
import { FieldTemplateProps } from "@rjsf/core";
import { cx } from "@evg-ui/lib/utils/css";
import { TitleField as CustomTitleField } from "../CustomFields";
import { emotionCssToClassName } from "../utils";
import { SpruceWidgetProps } from "../Widgets/types";
import styles from "./index.module.css";

export * from "./ArrayFieldTemplates";
export * from "./ObjectFieldTemplates";

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
  const fielddataTestId = uiSchema["ui:field-data-testid"];
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
        <Banner
          className={styles.banner}
          data-testid="error-banner"
          variant="danger"
        >
          {errors.join(", ")}
        </Banner>
      )}
      {isNullType && !!warnings.length && (
        <Banner
          className={styles.banner}
          data-testid="warning-banner"
          variant="warning"
        >
          {warnings.map((w, i) =>
            typeof w === "string" || w instanceof String ? (
              <div key={`warning-${i}`}>{w}</div> // eslint-disable-line  react/no-array-index-key
            ) : (
              w
            ),
          )}
        </Banner>
      )}
      <div
        className={cx(
          styles.defaultFieldContainer,
          border === "top" && styles.borderTop,
          border === "bottom" && styles.borderBottom,
          emotionCssToClassName(fieldCss),
          classNames,
        )}
        data-testid={fielddataTestId}
        id={`${sectionId} ${id}`}
      >
        {children}
      </div>
    </>
  ) : null;
};
