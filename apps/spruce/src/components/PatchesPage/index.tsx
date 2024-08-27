import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import Cookies from "js-cookie";
import { useProjectPatchesAnalytics, useUserPatchesAnalytics } from "analytics";
import PageSizeSelector from "components/PageSizeSelector";
import Pagination from "components/Pagination";
import { PageWrapper, FiltersWrapper, PageTitle } from "components/styles";
import TextInputWithValidation from "components/TextInputWithValidation";
import { INCLUDE_HIDDEN_PATCHES } from "constants/cookies";
import { size } from "constants/tokens";
import { PatchesPagePatchesFragment } from "gql/generated/types";
import { useFilterInputChangeHandler, usePageTitle } from "hooks";
import usePagination from "hooks/usePagination";
import { useQueryParam } from "hooks/useQueryParam";
import { PatchPageQueryParams } from "types/patch";
import { validateRegexp } from "utils/validators";
import ListArea from "./ListArea";
import { StatusSelector } from "./StatusSelector";
import { usePatchesQueryParams } from "./usePatchesQueryParams";

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

  // Handle pagination logic.
  const { setLimit } = usePagination();
  const { limit, page } = usePatchesQueryParams();
  const handlePageSizeChange = (pageSize: number): void => {
    setLimit(pageSize);
    analytics.sendEvent({ name: "Changed page size" });
  };

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

  return (
    <PageWrapper>
      <PageTitle data-cy="patches-page-title">{pageTitle}</PageTitle>
      <FiltersWrapperSpaceBetween>
        <TextInputWithValidation
          aria-label="Search patch descriptions"
          placeholder="Patch description regex"
          onChange={(value) => setAndSubmitInputValue(value)}
          data-cy="patch-description-input"
          validator={validateRegexp}
          validatorErrorMessage="Invalid regex"
        />
        <StatusSelector />
        {filterComp}
        <HiddenCheckbox
          data-cy="include-hidden-checkbox"
          onChange={includeHiddenCheckboxOnChange}
          label="Include hidden"
          checked={includeHiddenCheckboxChecked}
        />
      </FiltersWrapperSpaceBetween>
      <PaginationRow>
        <Pagination
          currentPage={page}
          totalResults={patches?.filteredPatchCount ?? 0}
          pageSize={limit}
        />
        <PageSizeSelector
          data-cy="my-patches-page-size-selector"
          value={limit}
          onChange={handlePageSizeChange}
        />
      </PaginationRow>
      <ListArea
        patches={patches?.patches || []}
        loading={loading}
        pageType={pageType}
      />
    </PageWrapper>
  );
};

const PaginationRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const FiltersWrapperSpaceBetween = styled(FiltersWrapper)`
  display: grid;
  grid-template-columns: repeat(4, 1fr) auto;
  grid-column-gap: ${size.s};
`;

// @ts-expect-error
const HiddenCheckbox = styled(Checkbox)`
  justify-content: flex-end;
`;
