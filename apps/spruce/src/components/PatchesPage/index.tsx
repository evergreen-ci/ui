import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import Cookies from "js-cookie";
import { size } from "@evg-ui/lib/constants/tokens";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { useProjectPatchesAnalytics, useUserPatchesAnalytics } from "analytics";
import { PageWrapper, FiltersWrapper, PageTitle } from "components/styles";
import TextInputWithValidation from "components/TextInputWithValidation";
import { INCLUDE_HIDDEN_PATCHES } from "constants/cookies";
import { PatchesPagePatchesFragment } from "gql/generated/types";
import { useFilterInputChangeHandler } from "hooks";
import { PatchPageQueryParams } from "types/patch";
import { validateRegexp } from "utils/validators";
import ListArea from "./ListArea";
import { PaginationButtons } from "./PaginationButtons";
import { StatusSelector } from "./StatusSelector";

interface Props {
  filterComp?: React.ReactNode;
  loading: boolean;
  pageTitle: string;
  pageType: "project" | "user";
  patches?: PatchesPagePatchesFragment;
}

export const PatchesPage: React.FC<Props> = ({
  filterComp,
  loading,
  pageTitle,
  pageType,
  patches,
}) => {
  usePageTitle(pageTitle);
  const userPatchesAnalytics = useUserPatchesAnalytics();
  const projectPatchesAnalytics = useProjectPatchesAnalytics();
  const analytics =
    pageType === "project" ? projectPatchesAnalytics : userPatchesAnalytics;

  // Handle filtering by patch description.
  const { setAndSubmitInputValue } = useFilterInputChangeHandler({
    urlParam: PatchPageQueryParams.PatchName,
    resetPage: true,
    sendAnalyticsEvent: (filterBy: string) =>
      analytics.sendEvent({
        name: "Filtered for patches",
        "filter.by": filterBy,
      }),
  });

  // Handle filtering for hidden patches.
  const [includeHiddenCheckboxChecked, setIsIncludeHiddenCheckboxChecked] =
    useQueryParam(
      PatchPageQueryParams.Hidden,
      Cookies.get(INCLUDE_HIDDEN_PATCHES) === "true",
    );
  const includeHiddenCheckboxOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setIsIncludeHiddenCheckboxChecked(e.target.checked);
    Cookies.set(INCLUDE_HIDDEN_PATCHES, e.target.checked ? "true" : "false");
    analytics.sendEvent({
      name: "Filtered for patches",
      "filter.hidden": e.target.checked,
    });
  };

  const filteredCount = patches?.filteredPatchCount ?? 0;

  return (
    <PageWrapper>
      <PageTitle data-cy="patches-page-title">{pageTitle}</PageTitle>
      <FiltersWrapperSpaceBetween>
        <TextInputWithValidation
          aria-label="Search patch descriptions"
          data-cy="patch-description-input"
          onChange={(value) => setAndSubmitInputValue(value)}
          placeholder="Patch description regex"
          validator={validateRegexp}
          validatorErrorMessage="Invalid regex"
        />
        <StatusSelector />
        {filterComp}
        <HiddenCheckbox
          checked={includeHiddenCheckboxChecked}
          data-cy="include-hidden-checkbox"
          label="Include hidden"
          onChange={includeHiddenCheckboxOnChange}
        />
      </FiltersWrapperSpaceBetween>
      <PaginationButtons
        filteredPatchCount={filteredCount}
        pageType={pageType}
      />
      <ListArea
        loading={loading}
        pageType={pageType}
        patches={patches?.patches || []}
      />
      {!loading && filteredCount > 10 ? (
        <PaginationButtons
          filteredPatchCount={filteredCount}
          pageType={pageType}
        />
      ) : null}
    </PageWrapper>
  );
};

const FiltersWrapperSpaceBetween = styled(FiltersWrapper)`
  display: grid;
  grid-template-columns: repeat(4, 1fr) auto;
  grid-column-gap: ${size.s};
`;

const HiddenCheckbox = styled(Checkbox)`
  justify-content: flex-end;
`;
