import { useMemo } from "react";
import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import { taskStatusToCopy } from "@evg-ui/lib/constants/task";
import { size } from "@evg-ui/lib/constants/tokens";
import { useQueryParam, useQueryParams } from "@evg-ui/lib/hooks";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { useVersionAnalytics } from "analytics";
import TextInputWithValidation from "components/TextInputWithValidation";
import { TestAnalysisQueryParams } from "types/task";
import { validateRegexp } from "utils/validators";
import { TaskBuildVariantField } from "../types";
import { getAllBuildVariants, getAllTaskStatuses } from "./utils";

interface FilterGroupProps {
  versionId: string;
  hasResults: boolean;
  totalTestCount: number;
  totalFilteredTestCount: number;
  groupedTestsMap: Map<string, TaskBuildVariantField[]>;
}
const FilterGroup: React.FC<FilterGroupProps> = ({
  groupedTestsMap,
  hasResults,
  totalFilteredTestCount,
  totalTestCount,
  versionId,
}) => {
  const [selectedTaskStatuses, setSelectedTaskStatuses] = useQueryParam<
    string[]
  >(TestAnalysisQueryParams.Statuses, []);

  const [selectedBuildVariants, setSelectedBuildVariants] = useQueryParam<
    string[]
  >(TestAnalysisQueryParams.Variants, []);

  const [testName, setTestName] = useQueryParam<string | undefined>(
    TestAnalysisQueryParams.TestName,
    "",
  );
  const [, setQueryParams] = useQueryParams();
  const { sendEvent } = useVersionAnalytics(versionId);

  const buildVariants = useMemo(
    () => getAllBuildVariants(groupedTestsMap),
    [groupedTestsMap],
  );
  const taskStatuses = useMemo(
    () => getAllTaskStatuses(groupedTestsMap),
    [groupedTestsMap],
  );

  const hasFiltersApplied =
    selectedTaskStatuses.length > 0 ||
    selectedBuildVariants.length > 0 ||
    (testName || "").length > 0;

  return (
    <>
      <FilterContainer>
        <TextInputWithValidation
          aria-labelledby="test-failure-search-label"
          disabled={!hasResults}
          id="test-failure-search-input"
          label="Search Test Failures"
          onSubmit={(value) => {
            if (value === "") {
              setTestName(undefined);
            } else {
              setTestName(value);
            }
            sendEvent({
              name: "Filtered test analysis tab",
              "filter.by": "test name",
            });
          }}
          placeholder="Search failed tests (regex)"
          validator={validateRegexp}
          value={testName}
        />
        <Combobox
          disabled={!hasResults}
          label="Failure Type"
          multiselect
          onChange={(value: string[]) => {
            setSelectedTaskStatuses(value);
            sendEvent({
              name: "Filtered test analysis tab",
              "filter.by": "task statuses",
            });
          }}
          placeholder="Select a task status"
          value={selectedTaskStatuses}
        >
          {taskStatuses.map((status) => (
            <ComboboxOption
              key={status}
              data-cy={`task-status-${status}-option`}
              displayName={taskStatusToCopy[status as TaskStatus]}
              value={status}
            />
          ))}
        </Combobox>
        <Combobox
          disabled={!hasResults}
          label="Build Variant"
          multiselect
          onChange={(value: string[]) => {
            setSelectedBuildVariants(value);
            sendEvent({
              name: "Filtered test analysis tab",
              "filter.by": "build variant",
            });
          }}
          overflow="scroll-x"
          placeholder="Select a build variant"
          value={selectedBuildVariants}
        >
          {buildVariants.map((bv) => (
            <ComboboxOption
              key={bv.buildVariant}
              data-cy={`build-variant-${bv.buildVariant}-option`}
              displayName={bv.buildVariantDisplayName}
              value={bv.buildVariant}
            />
          ))}
        </Combobox>
      </FilterContainer>
      {hasResults && (
        <FilterSubheaderContainer>
          <Body weight="medium">
            {totalFilteredTestCount}/{totalTestCount} Failed{" "}
            {pluralize("Test", totalFilteredTestCount)}
          </Body>
          <Button
            data-cy="clear-filter-button"
            disabled={!hasFiltersApplied}
            onClick={() => {
              setQueryParams({
                [TestAnalysisQueryParams.Statuses]: [],
                [TestAnalysisQueryParams.Variants]: [],
                [TestAnalysisQueryParams.TestName]: "",
              });
            }}
            size="xsmall"
          >
            Clear Filters
          </Button>
          {hasFiltersApplied && <Disclaimer>Filters applied</Disclaimer>}
        </FilterSubheaderContainer>
      )}
    </>
  );
};
const FilterSubheaderContainer = styled.div`
  display: flex;
  margin-bottom: ${size.m};
  gap: ${size.xs};
  align-items: center;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${size.m};
  margin-top: ${size.s};
  > * {
    flex-basis: 30%;
  }
`;

export default FilterGroup;
