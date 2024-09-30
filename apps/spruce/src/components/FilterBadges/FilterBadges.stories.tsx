import { useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { size } from "constants/tokens";

import FilterBadges from ".";
import { FilterBadgeType } from "./FilterBadge";

export default {
  component: FilterBadges,
} satisfies CustomMeta<typeof FilterBadges>;

export const Default: CustomStoryObj<typeof FilterBadges> = {
  render: () => <BadgeContainer />,
};

const BadgeContainer = () => {
  const [badges, setBadges] = useState<FilterBadgeType[]>([
    { key: "test", value: "test" },
  ]);

  const addBadge = (key: string, value: string) => {
    setBadges([...badges, { key, value }]);
  };
  const removeBadge = (badge: FilterBadgeType) => {
    setBadges(
      badges.filter(
        (b) => (b.key !== badge.key && b.value !== badge.value) || false,
      ),
    );
  };
  const onClearAll = () => {
    setBadges([]);
  };

  return (
    <div>
      <FilterBadges
        badges={badges}
        onClearAll={onClearAll}
        onRemove={removeBadge}
      />
      <BadgeInput onAdd={addBadge} />
    </div>
  );
};

// Must use a separate input component to dynamically add badges
// Since leafygreen knobs rerender the component on every change
const BadgeInput = ({
  onAdd,
}: {
  onAdd: (key: string, value: string) => void;
}) => {
  const [badgeKey, setBadgeKey] = useState("");
  const [badgeValue, setBadgeValue] = useState("");

  const handleAdd = () => {
    onAdd(badgeKey, badgeValue);
    setBadgeKey("");
    setBadgeValue("");
  };
  return (
    <div>
      <TextInput
        label="key"
        onChange={(e) => setBadgeKey(e.target.value)}
        placeholder="key"
        value={badgeKey}
      />
      <TextInput
        label="value"
        onChange={(e) => setBadgeValue(e.target.value)}
        placeholder="value"
        value={badgeValue}
      />
      <StyledButton onClick={handleAdd}>Add</StyledButton>
    </div>
  );
};

const StyledButton = styled(Button)`
  margin-top: ${size.s};
`;
