import { Fragment } from "react";
import styled from "@emotion/styled";
import { Overline } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants";
import SearchableDropdown from "components/SearchableDropdown";
import ElementWrapper from "components/SpruceForm/ElementWrapper";
import { EnumSpruceWidgetProps } from "components/SpruceForm/Widgets/types";
import {
  hoverStyles,
  overlineStyles,
} from "components/styles/SearchableDropdown";

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
    "data-cy": dataCy,
    distros: distroList,
    elementWrapperCSS,
  } = options;

  const searchableOptions = categorizeDistros(distroList);
  return (
    <StyledElementWrapper css={elementWrapperCSS}>
      <SearchableDropdown
        data-cy={dataCy}
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
    </StyledElementWrapper>
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
      <Overline css={overlineStyles}>{title}</Overline>
      <ListContainer>
        {distros.map((d) => (
          <Option
            key={d}
            data-cy={`distro-option-${d}`}
            onClick={() => onClick(d)}
          >
            {d}
          </Option>
        ))}
      </ListContainer>
    </Fragment>
  ) : null;

const ListContainer = styled.div`
  margin: 0;
  padding: 0;
`;

const Option = styled.div`
  word-break: normal;
  overflow-wrap: anywhere;
  padding: ${size.xs} ${size.s};
  ${hoverStyles};
`;

const StyledElementWrapper = styled(ElementWrapper)`
  display: flex;
  flex-direction: column;
`;
