import { useMemo, useState } from "react";
import { Badge, Variant } from "@leafygreen-ui/badge";
import {
  SearchInput,
  Size as SearchInputSize,
} from "@leafygreen-ui/search-input";
import { Body, Description } from "@leafygreen-ui/typography";
import { cx } from "@evg-ui/lib/utils/css";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";
import styles from "./BuildVariantCard.module.css";
import type { MenuItemProps } from "./types";

interface BuildVariantCardProps {
  "data-testid": string;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  onClick: (variantName: string) => (e) => void;
  menuItems: MenuItemProps[];
  selectedMenuItems: string[];
  title: string;
}

const BuildVariantCard: React.FC<BuildVariantCardProps> = ({
  "data-testid": dataTestId,
  menuItems,
  onClick,
  selectedMenuItems,
  title,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const filteredMenuItems = useMemo(
    () => getVisibleItems(menuItems, searchValue),
    [menuItems, searchValue],
  );

  return (
    <SiderCard className={styles.siderCardNoSidePadding}>
      <div className={styles.cardSidePadding}>
        <div className={styles.titleContainer}>
          <Body weight="medium">{title} </Body>
        </div>
        <Description>
          Use Shift + Click to edit multiple variants simultaneously.
        </Description>
        <SearchInput
          aria-labelledby={title}
          className={styles.searchInput}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search build variants regex"
          size={SearchInputSize.Small}
        />
        <Divider />
      </div>
      <div className={styles.scrollableContainer}>
        {filteredMenuItems.map(({ displayName, name, taskCount }) => {
          const isSelected = selectedMenuItems.includes(name);
          return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- pre-existing violation, surfaced by the Emotion conversion
            <div
              key={name}
              className={cx(
                styles.buildVariant,
                styles.cardSidePadding,
                isSelected && styles.selected,
              )}
              data-selected={isSelected}
              data-testid={dataTestId}
              onClick={onClick(name)}
            >
              <div className={styles.variantName}>
                <Body
                  weight={isSelected || taskCount > 0 ? "medium" : "regular"}
                >
                  {displayName}
                </Body>
              </div>
              {taskCount > 0 && (
                <Badge
                  className={styles.badge}
                  data-testid="task-count-badge"
                  variant={isSelected ? Variant.DarkGray : Variant.LightGray}
                >
                  {taskCount}
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </SiderCard>
  );
};

const getVisibleItems = (items: MenuItemProps[], filter: string) =>
  items.filter((item) => {
    try {
      const regex = new RegExp(filter, "i");
      return regex.test(item.displayName) || regex.test(item.name);
    } catch {
      // If invalid regex, fallback to substring match
      const val = filter.toLowerCase();
      return (
        item.displayName.toLowerCase().includes(val) ||
        item.name.toLowerCase().includes(val)
      );
    }
  });

export default BuildVariantCard;
