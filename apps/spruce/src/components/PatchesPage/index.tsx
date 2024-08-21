import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import Cookies from "js-cookie";
import { useProjectPatchesAnalytics, useUserPatchesAnalytics } from "analytics";
import PageSizeSelector from "components/PageSizeSelector";
import Pagination from "components/Pagination";
import { PageWrapper, FiltersWrapper, PageTitle } from "components/styles";
import TextInputWithValidation from "components/TextInputWithValidation";
import {
  INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES,
  INCLUDE_COMMIT_QUEUE_USER_PATCHES,
  INCLUDE_HIDDEN_PATCHES,
} from "constants/cookies";
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
  const userPatchesAnalytics = useUserPatchesAnalytics();
  const projectPatchesAnalytics = useProjectPatchesAnalytics();
  const analytics =
    pageType === "project" ? projectPatchesAnalytics : userPatchesAnalytics;
  const { setLimit } = usePagination();
  const cookie =
    pageType === "project"
      ? INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES
      : INCLUDE_COMMIT_QUEUE_USER_PATCHES;
  const [isCommitQueueCheckboxChecked, setIsCommitQueueCheckboxChecked] =
    useQueryParam(
      PatchPageQueryParams.CommitQueue,
      Cookies.get(cookie) === "true",
    );
  const [includeHiddenCheckboxChecked, setIsIncludeHiddenCheckboxChecked] =
    useQueryParam(
      PatchPageQueryParams.Hidden,
      Cookies.get(INCLUDE_HIDDEN_PATCHES) === "true",
    );
  const { limit, page } = usePatchesQueryParams();
  const { inputValue: filterInput, setAndSubmitInputValue } =
    useFilterInputChangeHandler({
      urlParam: PatchPageQueryParams.PatchName,
      resetPage: true,
      sendAnalyticsEvent: (filterBy: string) =>
        analytics.sendEvent({
          name: "Filtered for patches",
          "filter.by": filterBy,
          "filter.hidden": includeHiddenCheckboxChecked,
          "filter.commit_queue": isCommitQueueCheckboxChecked,
        }),
    });
  usePageTitle(pageTitle);

  const commitQueueCheckboxOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setIsCommitQueueCheckboxChecked(e.target.checked);
    Cookies.set(cookie, e.target.checked ? "true" : "false");
    analytics.sendEvent({
      name: "Filtered for patches",
      "filter.by": filterInput,
      "filter.hidden": includeHiddenCheckboxChecked,
      "filter.commit_queue": e.target.checked,
    });
  };

  const includeHiddenCheckboxOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setIsIncludeHiddenCheckboxChecked(e.target.checked);
    Cookies.set(INCLUDE_HIDDEN_PATCHES, e.target.checked ? "true" : "false");
    analytics.sendEvent({
      name: "Filtered for patches",
      "filter.by": filterInput,
      "filter.hidden": e.target.checked,
      "filter.commit_queue": isCommitQueueCheckboxChecked,
    });
  };

  const handlePageSizeChange = (pageSize: number): void => {
    setLimit(pageSize);
    analytics.sendEvent({ name: "Changed page size" });
  };

  return (
    <PageWrapper>
      <PageTitle data-cy="patches-page-title">{pageTitle}</PageTitle>
      <FiltersWrapperSpaceBetween hasAdditionalFilterComp={!!filterComp}>
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
        <CheckboxContainer>
          <Checkbox
            data-cy="commit-queue-checkbox"
            onChange={commitQueueCheckboxOnChange}
            label={
              pageType === "project"
                ? "Only Show Commit Queue Patches"
                : "Include Commit Queue"
            }
            checked={isCommitQueueCheckboxChecked}
          />
          <Checkbox
            data-cy="include-hidden-checkbox"
            onChange={includeHiddenCheckboxOnChange}
            label="Include hidden"
            checked={includeHiddenCheckboxChecked}
          />
        </CheckboxContainer>
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
const FiltersWrapperSpaceBetween = styled(FiltersWrapper)<{
  hasAdditionalFilterComp: boolean;
}>`
  display: grid;
  grid-template-columns:
    repeat(
      ${({ hasAdditionalFilterComp }) => (hasAdditionalFilterComp ? 3 : 2)},
      1fr
    )
    2fr;
  grid-column-gap: ${size.s};
`;

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: ${size.xs};
`;
