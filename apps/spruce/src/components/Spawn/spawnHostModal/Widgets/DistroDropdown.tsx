import { Fragment } from "react";
import { Overline } from "@leafygreen-ui/typography";
import SearchableDropdown from "components/SearchableDropdown";
import ElementWrapper from "components/SpruceForm/ElementWrapper";
import { EnumSpruceWidgetProps } from "components/SpruceForm/Widgets/types";
import styles from "./DistroDropdown.module.css";

interface DistroValue {
  adminOnly: boolean;
  isVirtualWorkStation: boolean;
  name: string;
}

interface DistroEnum {
  options: {
    distros: DistroValue[];
  };
}

export const DistroDropdown: React.FC<DistroEnum & EnumSpruceWidgetProps> = ({
  label,
  onChange,
  options,
  value,
}) => {
  const {
    ariaLabelledBy,
    "data-testid": dataTestId,
    distros: distroList,
    elementWrapperCSS,
  } = options;

  const searchableOptions = categorizeDistros(distroList);
  return (
    <ElementWrapper className={styles.elementWrapper} css={elementWrapperCSS}>
      <SearchableDropdown
        data-testid={dataTestId}
        label={ariaLabelledBy ? undefined : label}
        onChange={onChange}
        optionRenderer={({ distros, title }, onClick) => (
          <DropdownOption
            key={title}
            distros={distros}
            onClick={onClick}
            title={title}
          />
        )}
        options={searchableOptions}
        searchFunc={(items: DistroGroup[], match: string) =>
          items.map((e) => ({
            ...e,
            distros: e.distros.filter((d: string) =>
              d.toLowerCase().includes(match.toLowerCase()),
            ),
          }))
        }
        value={value}
        valuePlaceholder={value || "Select a distro"}
      />
    </ElementWrapper>
  );
};

type DistroGroup = {
  title: string;
  distros: string[];
};

// Bucketize distros into admin-only, workstation, and Non-Workstation buckets. Admin-only takes precedence over workstation.
const categorizeDistros = (distros: DistroValue[]): DistroGroup[] =>
  distros?.reduce(
    (accum, { adminOnly, isVirtualWorkStation, name }) => {
      // Default to standard distro
      let categoryIndex = 1;
      if (adminOnly) {
        categoryIndex = 2;
      } else if (isVirtualWorkStation) {
        categoryIndex = 0;
      }

      // @ts-expect-error: FIXME. This comment was added by an automated script.
      accum[categoryIndex].distros.push(name);

      return accum;
    },
    [
      { title: "Workstation distros", distros: [] },
      { title: "Other distros", distros: [] },
      { title: "Admin-only distros", distros: [] },
    ],
  );

const DropdownOption: React.FC<{
  title: string;
  distros: string[];
  onClick: (distro: string) => void;
}> = ({ distros, onClick, title }) =>
  distros.length > 0 ? (
    <Fragment key={title}>
      <Overline className={styles.overline}>{title}</Overline>
      <div className={styles.listContainer}>
        {distros.map((d) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- pre-existing violation, surfaced by the Emotion conversion
          <div
            key={d}
            className={styles.option}
            data-testid={`distro-option-${d}`}
            onClick={() => onClick(d)}
          >
            {d}
          </div>
        ))}
      </div>
    </Fragment>
  ) : null;
