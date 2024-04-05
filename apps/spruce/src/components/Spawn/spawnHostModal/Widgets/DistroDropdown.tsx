import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Overline } from "@leafygreen-ui/typography";
import SearchableDropdown from "components/SearchableDropdown";
import ElementWrapper from "components/SpruceForm/ElementWrapper";
import { EnumSpruceWidgetProps } from "components/SpruceForm/Widgets/types";
import { size } from "constants/tokens";

const { gray } = palette;

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
        valuePlaceholder={value || "Select a distro"}
        label={ariaLabelledBy ? undefined : label}
        value={value}
        data-cy={dataCy}
        onChange={onChange}
        options={searchableOptions}
        searchFunc={(items, match) =>
          items.map((e) => ({
            ...e,
            distros: e.distros.filter((d: string) =>
              d.toLowerCase().includes(match.toLowerCase()),
            ),
          }))
        }
        optionRenderer={({ distros, title }, onClick) => (
          <DropdownOption
            key={title}
            onClick={onClick}
            title={title}
            distros={distros}
          />
        )}
      />
    </StyledElementWrapper>
  );
};

// Bucketize distros into admin-only, workstation, and Non-Workstation buckets. Admin-only takes precedence over workstation.
const categorizeDistros = (distros: DistroValue[]) =>
  distros.reduce(
    (accum, { adminOnly, isVirtualWorkStation, name }) => {
      // Default to standard distro
      let categoryIndex = 1;
      if (adminOnly) {
        categoryIndex = 2;
      } else if (isVirtualWorkStation) {
        categoryIndex = 0;
      }

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
    <OptionContainer key={title}>
      <Overline>{title}</Overline>
      <ListContainer>
        {distros.map((d) => (
          <Option
            onClick={() => onClick(d)}
            key={d}
            data-cy={`distro-option-${d}`}
          >
            {d}
          </Option>
        ))}
      </ListContainer>
    </OptionContainer>
  ) : null;

const ListContainer = styled.div`
  margin: 0;
  padding: 0;
`;
const OptionContainer = styled.div`
  padding: ${size.xs};
`;
const Option = styled(OptionContainer)`
  word-break: normal;
  overflow-wrap: anywhere;
  cursor: pointer;
  :hover {
    background-color: ${gray.light1};
  }
`;
const StyledElementWrapper = styled(ElementWrapper)`
  display: flex;
  flex-direction: column;
`;
