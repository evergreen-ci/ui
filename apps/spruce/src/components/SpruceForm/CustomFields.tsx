import { Description, H3, Subtitle } from "@leafygreen-ui/typography";
import { Field, FieldProps } from "@rjsf/core";
import styles from "./CustomFields.module.css";

type TitleFieldProps = Pick<FieldProps, "id" | "title" | "uiSchema">;

export const TitleField: React.FC<TitleFieldProps> = ({
  id,
  title,
  uiSchema,
}) => {
  const isSectionTitle = uiSchema?.["ui:sectionTitle"] ?? false;
  return isSectionTitle ? (
    <H3 className={styles.h3} id={id}>
      {title}
    </H3>
  ) : (
    <Subtitle className={styles.subtitle} id={id}>
      {title}
    </Subtitle>
  );
};

export const DescriptionField: Field = ({ description, id }) =>
  description ? (
    <Description className={styles.description} id={id}>
      {description}
    </Description>
  ) : null;
