import { css } from "@emotion/react";
import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";
import { transformTitleToId } from "./utils";

interface ContainerProps {
  objectFieldCss?: string;
  children: React.ReactNode;
  "data-cy"?: string;
  description?: React.ReactNode;
  id?: string;
  title?: string;
  scrollMarginTop?: number;
}

export const SpruceFormContainer: React.FC<ContainerProps> = ({
  children,
  "data-cy": dataCy,
  description,
  id,
  objectFieldCss,
  scrollMarginTop = 0,
  title,
}) => (
  <div css={objectFieldCss}>
    {title && (
      <a
        css={css`
          scroll-margin-top: ${scrollMarginTop}px;
        `}
        href={`#${transformTitleToId(title)}`}
        id={transformTitleToId(title)}
      >
        <SettingsCardTitle id={id}>{title}</SettingsCardTitle>
      </a>
    )}
    {description}
    <SettingsCard data-cy={dataCy}>{children}</SettingsCard>
  </div>
);
