import { ItemContent } from "react-virtuoso";

type RowRenderer = (index: number) => ItemContent<unknown, unknown>;

interface PaginatedVirtualListRef {
  scrollToIndex: (index: number) => void;
}

export type { RowRenderer, PaginatedVirtualListRef };
