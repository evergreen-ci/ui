import { SerializedStyles } from "@emotion/react";
import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";
import { emotionCssToClassName, transformTitleToId } from "./utils";

interface ContainerProps {
  objectFieldCss?: SerializedStyles | string;
  children: React.ReactNode;
  "data-testid"?: string;
  description?: React.ReactNode;
  id?: string;
  title?: string;
  scrollMarginTop?: number;
}

export const SpruceFormContainer: React.FC<ContainerProps> = ({
  children,
  "data-testid": dataTestId,
  description,
  id,
  objectFieldCss,
  scrollMarginTop = 0,
  title,
}) => (
  <div className={emotionCssToClassName(objectFieldCss)}>
    {title && (
      <a
        href={`#${transformTitleToId(title)}`}
        id={transformTitleToId(title)}
        style={{ scrollMarginTop }}
      >
        <SettingsCardTitle id={id}>{title}</SettingsCardTitle>
      </a>
    )}
    {description}
    <SettingsCard data-testid={dataTestId}>{children}</SettingsCard>
  </div>
);
