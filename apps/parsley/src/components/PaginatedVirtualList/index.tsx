import { forwardRef, useCallback, useEffect, useRef } from "react";
import { ItemContent, Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { CharKey } from "@evg-ui/lib/constants/keys";
import { useKeyboardShortcut } from "@evg-ui/lib/hooks/useKeyboardShortcut";
import { PaginatedVirtualListRef } from "./types";
import usePaginatedVirtualList from "./usePaginatedVirtualList";

interface PaginatedVirtualListProps {
  rowCount: number;
  rowRenderer: ItemContent<unknown, unknown>;
  /**
   * The number of lines to render on each page.
   */
  paginationThreshold?: number;
  /**
   * The number of lines to scroll by when the user scrolls to the next page.
   * This is used to avoid the scroll event firing again and causing an infinite loop.
   * This value must be less than paginationThreshold.
   */
  paginationOffset?: number;
  className?: string;
  stickyHeadersEnabled: boolean;
  updateStickyHeaders?: (startIndex: number) => void;
}

const PaginatedVirtualList = forwardRef<
  PaginatedVirtualListRef,
  PaginatedVirtualListProps
>(
  (
    {
      className,
      paginationOffset = 10,
      paginationThreshold = 10000,
      rowCount,
      rowRenderer,
      stickyHeadersEnabled,
      updateStickyHeaders,
    },
    ref,
  ) => {
    if (paginationOffset >= paginationThreshold) {
      throw new Error("paginationOffset must be less than paginationThreshold");
    }

    const listRef = useRef<VirtuosoHandle>(null);

    const {
      pageSize,
      scrollToLine,
      scrollToNextPage,
      scrollToPrevPage,
      startingIndex,
    } = usePaginatedVirtualList({
      paginationOffset,
      paginationThreshold,
      ref: listRef,
      rowCount,
    });

    useKeyboardShortcut({ charKey: CharKey.PageEnd }, () => {
      scrollToLine(rowCount - 1);
    });

    useKeyboardShortcut({ charKey: CharKey.PageHome }, () => {
      scrollToLine(0);
    });

    // itemContent maps the paginated index to the actual index in the list
    const itemContent = useCallback(
      (index: number) => {
        const lineIndex = index + startingIndex;

        return rowRenderer(lineIndex, undefined, undefined);
      },
      [rowRenderer, startingIndex],
    );

    // Expose scrollToIndex as a ref
    useEffect(() => {
      if (ref && "current" in ref) {
        ref.current = {
          scrollToIndex: scrollToLine,
        };
      }
    }, [ref, scrollToLine]);

    return (
      <Virtuoso
        ref={listRef}
        atBottomStateChange={(val) => {
          if (val) {
            scrollToNextPage();
          }
        }}
        atTopStateChange={(val) => {
          if (val) {
            scrollToPrevPage();
          }
        }}
        className={className}
        data-cy="paginated-virtual-list"
        itemContent={itemContent}
        overscan={stickyHeadersEnabled ? 0 : 300}
        rangeChanged={(range) => updateStickyHeaders?.(range.startIndex)}
        totalCount={pageSize}
      />
    );
  },
);

PaginatedVirtualList.displayName = "PaginatedVirtualList";

export default PaginatedVirtualList;
