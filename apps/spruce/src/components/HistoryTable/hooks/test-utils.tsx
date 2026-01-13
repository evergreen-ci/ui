import { MockedProvider, MockedProviderProps } from "@evg-ui/lib/test_utils";
import { HistoryTableProvider } from "../HistoryTableContext";
import { HistoryTableReducerState } from "../historyTableContextReducer";

const initialState: HistoryTableReducerState = {
  loadedCommits: [],
  processedCommits: [],
  processedCommitCount: 0,
  commitCache: new Map(),
  currentPage: 0,
  pageCount: 0,
  columns: [],
  historyTableFilters: [],
  commitCount: 10,
  visibleColumns: [],
  columnLimit: 7,
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  selectedCommit: null,
};

interface ProviderProps {
  mocks?: MockedProviderProps["mocks"];
  state?: Partial<HistoryTableReducerState>;
  children: React.ReactNode;
}
const ProviderWrapper: React.FC<ProviderProps> = ({
  children,
  mocks = [],
  state = {},
}) => (
  <MockedProvider mocks={mocks}>
    <HistoryTableProvider initialState={{ ...initialState, ...state }}>
      {children}
    </HistoryTableProvider>
  </MockedProvider>
);

export { ProviderWrapper };
