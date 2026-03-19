import { useCallback } from "react";
import styled from "@emotion/styled";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { size } from "@evg-ui/lib/constants/tokens";
import { setLocalStorageString } from "@evg-ui/lib/utils/localStorage";
import { useWaterfallAnalytics } from "analytics";
import TupleSelect from "components/TupleSelect";
import { useUpsertQueryParams } from "hooks";
import {
  stringFilterTooltipText,
  tupleSelectOptions,
  VARIANT_FILTER_SETTING_KEY,
} from "../constants";
import { FilterType, WaterfallFilterOptions } from "../types";
import { getFilterType, makeExactFilter } from "../utils";

export const BuildVariantFilter = () => {
  const onSubmit = useUpsertQueryParams();
  const { sendEvent } = useWaterfallAnalytics();

  const onSubmitTupleSelect = useCallback(
    ({ category, value }: { category: string; value: string }) => {
      const filterType = category as FilterType;
      const isRegex = filterType === FilterType.Regex;
      const filterValue = isRegex ? value : makeExactFilter(value);
      onSubmit({
        category: WaterfallFilterOptions.BuildVariant,
        value: filterValue,
      });
      sendEvent({
        name: "Filtered by build variant",
        "filter.type": filterType,
        "filter.value": filterValue,
      });
    },
    [onSubmit, sendEvent],
  );

  const defaultFilterType = getFilterType(VARIANT_FILTER_SETTING_KEY);

  const handleToggleOption = useCallback((newOption: string) => {
    setLocalStorageString(VARIANT_FILTER_SETTING_KEY, newOption);
  }, []);

  return (
    <TupleSelect
      ariaLabel="Build Variant Filter"
      data-cy="build-variant-filter"
      defaultOption={defaultFilterType}
      id="build-variant-filter"
      label={
        <LabelContainer>
          <span>Build Variant</span>
          <InfoSprinkle>{stringFilterTooltipText}</InfoSprinkle>
        </LabelContainer>
      }
      onSubmit={onSubmitTupleSelect}
      onToggleOption={handleToggleOption}
      options={tupleSelectOptions}
      placeholder="Search"
      validatorErrorMessage="Invalid regular expression"
    />
  );
};

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;
