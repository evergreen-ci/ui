import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  Combobox,
  ComboboxGroup,
  ComboboxOption,
} from "@leafygreen-ui/combobox";
import { useNavigate } from "react-router-dom";
import { getDistroSettingsRoute } from "constants/routes";
import { DistrosQuery, DistrosQueryVariables } from "gql/generated/types";
import { DISTROS } from "gql/queries";

interface DistroSelectProps {
  selectedDistro: string;
}

export const DistroSelect: React.FC<DistroSelectProps> = ({
  selectedDistro,
}) => {
  const navigate = useNavigate();

  const { data: distrosData, loading } = useQuery<
    DistrosQuery,
    DistrosQueryVariables
  >(DISTROS, {
    variables: {
      onlySpawnable: false,
    },
  });

  const [adminOnly, nonAdminOnly] = useMemo(
    () => filterAdminOnlyDistros(distrosData?.distros ?? []),
    [distrosData?.distros],
  );

  const [filteredOptions, setFilteredOptions] = useState(
    distrosData?.distros?.map(({ name }) => name) ?? [],
  );

  return loading ? null : (
    <Combobox
      clearable={false}
      data-cy="distro-select"
      filteredOptions={filteredOptions}
      label="Distro"
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      onChange={(distroId: string) => {
        navigate(getDistroSettingsRoute(distroId));
      }}
      onFilter={(input) => {
        const filter = input.toLowerCase();
        setFilteredOptions(
          distrosData?.distros
            ?.filter(
              ({ aliases, name }) =>
                name.toLowerCase().includes(filter) ||
                aliases.some((a: string) => a.toLowerCase().includes(filter)),
            )
            ?.map(({ name }) => name) ?? [],
        );
      }}
      placeholder="Select distro"
      value={selectedDistro}
    >
      {nonAdminOnly.map(({ aliases, name }) => (
        <ComboboxOption
          key={name}
          description={
            aliases.length ? `Aliases: ${aliases.map((a) => a).join(", ")}` : ""
          }
          value={name}
        />
      ))}
      {adminOnly.length > 0 && (
        <ComboboxGroup label="Admin-Only">
          {adminOnly.map(({ name }) => (
            <ComboboxOption key={name} value={name}>
              {name}
            </ComboboxOption>
          ))}
        </ComboboxGroup>
      )}
    </Combobox>
  );
};

// Returns an array of [adminOnlyDistros, nonAdminOnlyDistros]
const filterAdminOnlyDistros = (
  distros: DistrosQuery["distros"],
): Array<DistrosQuery["distros"]> =>
  distros.reduce(
    (accum, distro) => {
      const [adminOnly, nonAdminOnly] = accum;
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      (distro.adminOnly ? adminOnly : nonAdminOnly).push(distro);
      return accum;
    },
    [[], []],
  );
