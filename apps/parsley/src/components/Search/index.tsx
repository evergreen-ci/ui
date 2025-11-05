import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { leaveBreadcrumb } from "@evg-ui/lib/utils/errorReporting";
import { SentryBreadcrumbTypes } from "@evg-ui/lib/utils/sentry/types";
import { useLogWindowAnalytics } from "analytics";
import SearchBar from "components/Search/SearchBar";
import SearchBarGuideCue from "components/Search/SearchBarGuideCue";
import SearchResults from "components/Search/SearchResults";
import { CaseSensitivity, MatchType, SearchBarActions } from "constants/enums";
import { QueryParams, urlParseOptions } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import {
  ProjectFiltersQuery,
  ProjectFiltersQueryVariables,
} from "gql/generated/types";
import { PROJECT_FILTERS } from "gql/queries";
import { useFilterParam } from "hooks/useFilterParam";
import { useHighlightParam } from "hooks/useHighlightParam";
import { useSearchHistory } from "hooks/useSearchHistory";
import { useTaskQuery } from "hooks/useTaskQuery";
import { stringifyFilters } from "utils/query-string";
import { validateRegexp } from "utils/validators";

const Search: React.FC = () => {
  const { sendEvent } = useLogWindowAnalytics();

  const [filters, setFilters] = useFilterParam();
  const [highlights, setHighlights] = useHighlightParam();
  const [searchParams, setSearchParams] = useQueryParams(urlParseOptions);
  const {
    hasLogs,
    logMetadata,
    paginate,
    preferences,
    searchState,
    setSearch,
  } = useLogContext();
  const { addToHistory, searchHistory } = useSearchHistory();
  const { highlightFilters } = preferences;
  const { execution, taskID } = logMetadata ?? {};
  const { hasSearch } = searchState;

  const { task } = useTaskQuery({ execution, taskID });
  const { versionMetadata } = task ?? {};
  const { projectMetadata } = versionMetadata ?? {};

  const { data } = useQuery<ProjectFiltersQuery, ProjectFiltersQueryVariables>(
    PROJECT_FILTERS,
    {
      skip: !projectMetadata?.id,
      variables: { projectId: projectMetadata?.id ?? "" },
    },
  );
  const { project } = data || {};
  const { parsleyFilters } = project || {};

  const handleOnSubmit = (selected: string, value: string) => {
    addToHistory(value);
    switch (selected) {
      case SearchBarActions.Filter:
        if (!filters.some((f) => f.expression === value)) {
          setSearch("");

          if (highlightFilters) {
            setSearchParams({
              ...searchParams,
              [QueryParams.Highlights]: [...highlights, value],
              [QueryParams.Filters]: stringifyFilters([
                ...filters,
                {
                  caseSensitive: CaseSensitivity.Insensitive,
                  expression: value,
                  matchType: MatchType.Exact,
                  visible: true,
                },
              ]),
            });
          } else {
            setFilters([
              ...filters,
              {
                caseSensitive: CaseSensitivity.Insensitive,
                expression: value,
                matchType: MatchType.Exact,
                visible: true,
              },
            ]);
          }
          sendEvent({ "filter.expression": value, name: "Created new filter" });
          leaveBreadcrumb(
            "Added filter",
            { filterExpression: value },
            SentryBreadcrumbTypes.User,
          );
        }
        break;
      case SearchBarActions.Highlight:
        if (!highlights.includes(value)) {
          setSearch("");
          setHighlights([...highlights, value]);
          sendEvent({
            "highlight.expression": value,
            name: "Created new highlight",
          });
          leaveBreadcrumb(
            "Added highlight",
            { highlightExpression: value },
            SentryBreadcrumbTypes.User,
          );
        }
        break;
      default:
        throw new Error("Invalid search action");
    }
  };

  const handleOnChange = (value: string) => {
    setSearch(value);
    sendEvent({ name: "Used search", "search.expression": value });
    leaveBreadcrumb(
      "Applied search",
      { searchExpression: value },
      SentryBreadcrumbTypes.User,
    );
  };

  return (
    <Container>
      {hasLogs && <SearchBarGuideCue />}
      <StyledSearchBar
        disabled={!hasLogs}
        onChange={handleOnChange}
        onSubmit={handleOnSubmit}
        paginate={paginate}
        searchSuggestions={[
          {
            suggestions: searchHistory,
            title: "Previous Searches",
          },
          {
            suggestions: parsleyFilters?.map((p) => p.expression) ?? [],
            title: "Project Filters",
          },
        ]}
        validator={validateRegexp}
        validatorMessage="Invalid regular expression"
      />
      {hasSearch && (
        <SearchResults paginate={paginate} searchState={searchState} />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const StyledSearchBar = styled(SearchBar)`
  width: 60vw;
  margin-left: ${size.m};
`;

export default Search;
