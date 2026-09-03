import { Checkbox } from "@via-ds/components";
import Cookies from "js-cookie";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { useProjectPatchesAnalytics, useUserPatchesAnalytics } from "analytics";
import { FiltersWrapper, PageTitle, PageWrapper } from "components/styles";
import TextInputWithValidation from "components/TextInputWithValidation";
import { INCLUDE_HIDDEN_PATCHES } from "constants/cookies";
import { PatchesPagePatchesFragment } from "gql/generated/types";
import { PatchPageQueryParams } from "types/patch";
import { validateRegexp } from "utils/validators";
import styles from "./index.module.css";
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

  const [patchName, setPatchName] = useQueryParam<string>(
    PatchPageQueryParams.PatchName,
    "",
  );

  // Handle filtering by patch description.
  const handleInputChange = (value: string) => {
    setPatchName(value);
    analytics.sendEvent({
      name: "Filtered for patches",
      "filter.by": value,
    });
  };

  // Handle filtering for hidden patches.
  const [includeHiddenCheckboxChecked, setIsIncludeHiddenCheckboxChecked] =
    useQueryParam(
      PatchPageQueryParams.Hidden,
      Cookies.get(INCLUDE_HIDDEN_PATCHES) === "true",
    );
  const includeHiddenCheckboxOnChange = (isSelected: boolean): void => {
    setIsIncludeHiddenCheckboxChecked(isSelected);
    Cookies.set(INCLUDE_HIDDEN_PATCHES, isSelected ? "true" : "false");
    analytics.sendEvent({
      name: "Filtered for patches",
      "filter.hidden": isSelected,
    });
  };

  const filteredCount = patches?.filteredPatchCount ?? 0;

  return (
    <PageWrapper>
      <PageTitle data-testid="patches-page-title">{pageTitle}</PageTitle>
      <FiltersWrapper className={styles.filtersWrapperSpaceBetween}>
        <TextInputWithValidation
          aria-label="Search patch descriptions"
          data-testid="patch-description-input"
          onChange={handleInputChange}
          placeholder="Patch description regex"
          validator={validateRegexp}
          validatorErrorMessage="Invalid regex"
          value={`${patchName}`}
        />
        <StatusSelector />
        {filterComp}
        <Checkbox
          className={styles.hiddenCheckbox}
          data-testid="include-hidden-checkbox"
          isSelected={includeHiddenCheckboxChecked}
          onChange={includeHiddenCheckboxOnChange}
        >
          Include hidden
        </Checkbox>
      </FiltersWrapper>
      <PaginationButtons
        filteredPatchCount={filteredCount}
        loading={loading}
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
