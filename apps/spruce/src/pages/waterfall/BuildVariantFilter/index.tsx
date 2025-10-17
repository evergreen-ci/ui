import { useCallback } from "react";
import styled from "@emotion/styled";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { size } from "@evg-ui/lib/constants/tokens";
import { toEscapedRegex } from "@evg-ui/lib/utils/string";
import { useWaterfallAnalytics } from "analytics";
import TupleSelect from "components/TupleSelect";
import { FilterType } from "components/TupleSelectWithRegexConditional";
import { useUpsertQueryParams } from "hooks";
import { tupleSelectOptions } from "../constants";
import { WaterfallFilterOptions } from "../types";

export const BuildVariantFilter = () => {
  const onSubmit = useUpsertQueryParams();
  const { sendEvent } = useWaterfallAnalytics();

  const onSubmitTupleSelect = useCallback(
    ({ category, value }: { category: string; value: string }) => {
      const filterType = category as FilterType;
      const isRegex = filterType === FilterType.Regex;
      onSubmit({
        category: WaterfallFilterOptions.BuildVariant,
        value: isRegex ? value : toEscapedRegex(value),
      });
      sendEvent({
        name: "Filtered by build variant",
        "filter.type": filterType,
      });
    },
    [onSubmit, sendEvent],
  );

  return (
    <TupleSelect
      ariaLabel="Build Variant Filter"
      data-cy="build-variant-filter"
      id="build-variant-filter"
      label={
        <LabelContainer>
          <span>Build Variant</span>
          <InfoSprinkle>Search is case sensitive.</InfoSprinkle>
        </LabelContainer>
      }
      onSubmit={onSubmitTupleSelect}
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
