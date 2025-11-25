import { useState } from "react";
import styled from "@emotion/styled";
import { Toggle, Size as ToggleSize } from "@leafygreen-ui/toggle";
import { size } from "@evg-ui/lib/constants/tokens";
import { useLogWindowAnalytics } from "analytics";
import { useFilterParam } from "hooks/useFilterParam";

const AllFiltersToggle: React.FC = () => {
  const { sendEvent } = useLogWindowAnalytics();
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useFilterParam();

  const onChange = (checked: boolean) => {
    setShowFilters(checked);
    const newFilters = filters.map((f) => ({
      ...f,
      visible: checked,
    }));
    sendEvent({ checked, name: "Clicked all filters toggle" });
    setFilters(newFilters);
  };

  return (
    <StyledToggle
      aria-labelledby="Show or hide all filters toggle"
      checked={showFilters}
      data-cy="all-filters-toggle"
      onChange={onChange}
      size={ToggleSize.XSmall}
    />
  );
};

const StyledToggle = styled(Toggle)`
  margin-left: ${size.xxs};
`;

export default AllFiltersToggle;
