import { forwardRef, useState } from "react";
import styled from "@emotion/styled";
import { Tab, Tabs } from "@leafygreen-ui/tabs";
import { H3 } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { useSectionsFeatureDiscoveryContext } from "context/SectionsFeatureDiscoveryContext";
import { useParsleySettings } from "hooks/useParsleySettings";
import { releaseSectioning } from "utils/featureFlag";
import ButtonRow from "./ButtonRow";
import SearchRangeInput from "./SearchRangeInput";
import {
  CaseSensitiveToggle,
  ExpandableRowsToggle,
  FilterLogicToggle,
  HighlightFiltersToggle,
  JumpToFailingLineToggle,
  PrettyPrintToggle,
  SectionsToggle,
  WordWrapFormatToggle,
  WrapToggle,
  ZebraStripingToggle,
} from "./Toggles";

interface DetailsMenuProps {
  "data-cy"?: string;
}

const DetailsMenuCard = forwardRef<HTMLDivElement, DetailsMenuProps>(
  ({ "data-cy": dataCy }, ref) => {
    const { showGuideCue } = useSectionsFeatureDiscoveryContext();
    const [selectedTab, setSelectedTab] = useState(showGuideCue ? 1 : 0);

    const { settings, updateSettings } = useParsleySettings();
    const { jumpToFailingLineEnabled = true, sectionsEnabled = true } =
      settings ?? {};

    return (
      <Container ref={ref} data-cy={dataCy}>
        <H3>Parsley Settings</H3>
        <Tabs
          aria-label="Details Card Tabs"
          selected={selectedTab}
          setSelected={setSelectedTab}
        >
          <Tab data-cy="search-and-filter-tab" name="Search & Filter">
            <Row>
              <Column>
                <SearchRangeInput />
                <CaseSensitiveToggle />
                <FilterLogicToggle />
                <HighlightFiltersToggle />
              </Column>
            </Row>
            <ButtonRow />
          </Tab>
          <Tab data-cy="log-viewing-tab" name="Log Viewing">
            <Row>
              <Column>
                <WrapToggle />
                <WordWrapFormatToggle />
                <PrettyPrintToggle />
                <ExpandableRowsToggle />
                <ZebraStripingToggle />
                <JumpToFailingLineToggle
                  checked={jumpToFailingLineEnabled}
                  updateSettings={updateSettings}
                />
                {releaseSectioning && (
                  <SectionsToggle
                    checked={sectionsEnabled}
                    updateSettings={updateSettings}
                  />
                )}
              </Column>
            </Row>
          </Tab>
        </Tabs>
      </Container>
    );
  },
);
DetailsMenuCard.displayName = "DetailsMenuCard";

const Container = styled.div`
  padding: ${size.xs};
  display: flex;
  flex-direction: column;
  width: 500px;
`;

const Row = styled.div`
  padding-top: ${size.s};
`;
const Column = styled.div`
  width: 100%;
`;

export default DetailsMenuCard;
