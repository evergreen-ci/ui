import { useRef } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useLogWindowAnalytics } from "analytics";
import SearchBar from "components/Search/SearchBar";
import SearchBarGuideCue from "components/Search/SearchBarGuideCue";
import SearchResults from "components/Search/SearchResults";
import { CaseSensitivity, MatchType, SearchBarActions } from "constants/enums";
import { QueryParams } from "constants/queryParams";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import {
  ProjectFiltersQuery,
  ProjectFiltersQueryVariables,
} from "gql/generated/types";
import { PROJECT_FILTERS } from "gql/queries";
import { useFilterParam } from "hooks/useFilterParam";
import { useHighlightParam } from "hooks/useHighlightParam";
import { useQueryParams } from "hooks/useQueryParam";
import { useTaskQuery } from "hooks/useTaskQuery";
import { SentryBreadcrumb, leaveBreadcrumb } from "utils/errorReporting";
import { stringifyFilters } from "utils/query-string";
import { validateRegexp } from "utils/validators";

const Search: React.FC = () => {
  const { sendEvent } = useLogWindowAnalytics();

  const containerRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useFilterParam();
  const [highlights, setHighlights] = useHighlightParam();
  const [searchParams, setSearchParams] = useQueryParams({
    parseNumbers: false,
  });
  const {
    hasLogs,
    logMetadata,
    paginate,
    preferences,
    searchState,
    setSearch,
  } = useLogContext();
  const { highlightFilters } = preferences;
  const { buildID, execution, logType, taskID } = logMetadata ?? {};
  const { hasSearch } = searchState;

  const { task } = useTaskQuery({ buildID, execution, logType, taskID });
  const { versionMetadata } = task ?? {};
  const { projectIdentifier = "" } = versionMetadata ?? {};

  const { data } = useQuery<ProjectFiltersQuery, ProjectFiltersQueryVariables>(
    PROJECT_FILTERS,
    {
      skip: !projectIdentifier,
      variables: { projectIdentifier },
    },
  );
  const { project } = data || {};
  const { parsleyFilters } = project || {};

  const handleOnSubmit = (selected: string, value: string) => {
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
            SentryBreadcrumb.User,
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
            SentryBreadcrumb.User,
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
      SentryBreadcrumb.User,
    );
  };

  return (
    <Container ref={containerRef}>
      {hasLogs && containerRef.current && (
        <SearchBarGuideCue containerRef={containerRef.current} />
      )}
      <StyledSearchBar
        disabled={!hasLogs}
        onChange={handleOnChange}
        onSubmit={handleOnSubmit}
        paginate={paginate}
        searchSuggestions={parsleyFilters?.map((p) => p.expression)}
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
