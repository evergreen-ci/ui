import { forwardRef } from "react";
import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";
import { transformTitleToId } from "./utils";

interface ContainerProps {
  children: React.ReactNode;
  "data-cy"?: string;
  description?: React.ReactNode;
  id?: string;
  title?: string;
}

export const SpruceFormContainer: React.FC<
  ContainerProps & { ref?: React.Ref<any> }
> = forwardRef(
  ({ children, "data-cy": dataCy, description, id, title }, ref) => (
    <div ref={ref}>
      {title && (
        <a
          href={`#${transformTitleToId(title)}`}
          id={transformTitleToId(title)}
        >
          <SettingsCardTitle id={id}>{title}</SettingsCardTitle>
        </a>
      )}
      {description}
      <SettingsCard data-cy={dataCy}>{children}</SettingsCard>
    </div>
  ),
);
