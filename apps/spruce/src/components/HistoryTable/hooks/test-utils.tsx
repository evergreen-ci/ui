import { MockedProvider, MockedProviderProps } from "@evg-ui/lib/test_utils";
import { HistoryTableProvider } from "../HistoryTableContext";
import { HistoryTableReducerState } from "../historyTableContextReducer";

const initialState: HistoryTableReducerState = {
  columnLimit: 7,
  columns: [],
  commitCache: new Map(),
  commitCount: 10,
  currentPage: 0,
  historyTableFilters: [],
  loadedCommits: [],
  pageCount: 0,
  processedCommitCount: 0,
  processedCommits: [],
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  selectedCommit: null,
  visibleColumns: [],
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
