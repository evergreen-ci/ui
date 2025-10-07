import { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { SearchInput } from "@leafygreen-ui/search-input";
import { Body, Description } from "@leafygreen-ui/typography";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/divider";
import type { MenuItemProps } from "./types";

const { green } = palette;

interface BuildVariantCardProps {
  "data-cy": string;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  onClick: (variantName: string) => (e) => void;
  menuItems: MenuItemProps[];
  selectedMenuItems: string[];
  title: string;
}

const BuildVariantCard: React.FC<BuildVariantCardProps> = ({
  "data-cy": dataCy,
  menuItems,
  onClick,
  selectedMenuItems,
  title,
}) => {
  const [filteredMenuItems, setFilteredMenuItems] =
    useState<MenuItemProps[]>(menuItems);
  const searchRef = useRef<HTMLInputElement>(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (showSearch) {
      searchRef.current?.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    setFilteredMenuItems(menuItems);
  }, [menuItems]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredMenuItems(
      menuItems.filter((item) => {
        try {
          const regex = new RegExp(e.target.value, "i");
          return regex.test(item.displayName) || regex.test(item.name);
        } catch {
          // If invalid regex, fallback to substring match
          const val = e.target.value.toLowerCase();
          return (
            item.displayName.toLowerCase().includes(val) ||
            item.name.toLowerCase().includes(val)
          );
        }
      }),
    );
  };
  return (
    <StyledSiderCard>
      <Container>
        <TitleContainer>
          <Body weight="medium">{title} </Body>
          <IconButton onClick={() => setShowSearch(!showSearch)}>
            <Icon glyph="MagnifyingGlass" />
          </IconButton>
        </TitleContainer>
        {showSearch && (
          <SearchInput
            ref={searchRef}
            aria-labelledby={title}
            onChange={onSearchChange}
            placeholder="Search build variants regex"
          />
        )}
        <Description>
          Use Shift + Click to edit multiple variants simultaneously.
        </Description>
        <Divider />
      </Container>
      <ScrollableBuildVariantContainer>
        {filteredMenuItems.map(({ displayName, name, taskCount }) => {
          const isSelected = selectedMenuItems.includes(name);
          return (
            <BuildVariant
              key={name}
              data-cy={dataCy}
              data-selected={isSelected}
              isSelected={isSelected}
              onClick={onClick(name)}
            >
              <VariantName>
                <Body
                  weight={isSelected || taskCount > 0 ? "medium" : "regular"}
                >
                  {displayName}
                </Body>
              </VariantName>
              {taskCount > 0 && (
                <StyledBadge
                  data-cy="task-count-badge"
                  variant={isSelected ? Variant.DarkGray : Variant.LightGray}
                >
                  {taskCount}
                </StyledBadge>
              )}
            </BuildVariant>
          );
        })}
      </ScrollableBuildVariantContainer>
    </StyledSiderCard>
  );
};

interface VariantProps {
  isSelected: boolean;
}

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const cardSidePadding = css`
  padding-left: ${size.xs};
  padding-right: ${size.xs};
`;
const Container = styled.div`
  ${cardSidePadding}
`;
const StyledSiderCard = styled(SiderCard)`
  padding-left: 0px;
  padding-right: 0px;
`;
const BuildVariant = styled.div<VariantProps>`
  display: flex;
  align-items: center;
  min-height: ${size.l};
  cursor: pointer;
  padding: ${size.xs} 0;
  ${cardSidePadding}
  background-color: ${(props: VariantProps): string =>
    props.isSelected ? green.light3 : "none"};
  border-left: 3px solid white;
  border-left-color: ${(props: VariantProps): string =>
    props.isSelected ? green.base : "none"};
`;
const VariantName = styled.div`
  word-break: break-all;
  white-space: normal;
`;

const StyledBadge = styled(Badge)`
  margin-left: ${size.xs};
`;

const ScrollableBuildVariantContainer = styled.div`
  overflow: scroll;
  max-height: 60vh;

  // Styles to always show scrollbar
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: ${size.xs};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: ${size.xxs};
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;

export default BuildVariantCard;
