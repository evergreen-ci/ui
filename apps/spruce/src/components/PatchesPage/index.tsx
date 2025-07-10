import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import Cookies from "js-cookie";
import PageSizeSelector from "@evg-ui/lib/components/PageSizeSelector";
import Pagination from "@evg-ui/lib/components/Pagination";
import { size } from "@evg-ui/lib/constants/tokens";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import usePagination from "@evg-ui/lib/src/hooks/usePagination";
import { useProjectPatchesAnalytics, useUserPatchesAnalytics } from "analytics";
import { PageWrapper, FiltersWrapper, PageTitle } from "components/styles";
import TextInputWithValidation from "components/TextInputWithValidation";
import { INCLUDE_HIDDEN_PATCHES } from "constants/cookies";
import { PatchesPagePatchesFragment } from "gql/generated/types";
import { useFilterInputChangeHandler } from "hooks";
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
      <PaginationRow>
        <Pagination
          currentPage={page}
          pageSize={limit}
          totalResults={patches?.filteredPatchCount ?? 0}
        />
        <PageSizeSelector
          data-cy="my-patches-page-size-selector"
          onChange={handlePageSizeChange}
          value={limit}
        />
      </PaginationRow>
      <ListArea
        loading={loading}
        pageType={pageType}
        patches={patches?.patches || []}
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
