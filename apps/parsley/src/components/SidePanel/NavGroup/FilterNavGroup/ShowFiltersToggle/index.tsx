import { useState } from "react";
import styled from "@emotion/styled";
import Toggle, { Size as ToggleSize } from "@leafygreen-ui/toggle";
import { size } from "@evg-ui/lib/constants/tokens";
import { useFilterParam } from "hooks/useFilterParam";

const ShowFiltersToggle: React.FC = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useFilterParam();

  const onChange = (checked: boolean) => {
    setShowFilters(checked);
    const newFilters = filters.map((f) => ({
      ...f,
      visible: checked,
    }));
    setFilters(newFilters);
  };
  return (
    <StyledToggle
      aria-labelledby="Show filters toggle"
      checked={showFilters}
      data-cy="show-filters-toggle"
      onChange={onChange}
      size={ToggleSize.XSmall}
    />
  );
};

const StyledToggle = styled(Toggle)`
  margin-left: ${size.xxs};
`;

export default ShowFiltersToggle;
