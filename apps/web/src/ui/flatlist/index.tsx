import type { CSSProperties, ReactElement } from 'react';
import type {
  ListRenderItemInfo, ViewToken, VirtualizedListHandle, VirtualizedListProps,
} from '../@core';
import { useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { ViewElement, VirtualizedList } from '../@core';


// Types ————————————————————————————————————————————————————————————————————————————————
type FlatListProps<T> = Omit<
  VirtualizedListProps<T, T[]>,
  'getItem' | 'getItemCount' | 'data' | 'getItemLayout' | 'keyExtractor' | 'renderItem'
> & {
  data?: T[];
  numColumns?: number;
  columnWrapperStyle?: CSSProperties;
  renderItem: (info: ListRenderItemInfo<T>) => ReactElement | null;
  keyExtractor?: (item: T, index: number) => string;
  getItemLayout?: (data: T[] | undefined, index: number) => { length: number; offset: number; index: number };
};


// Core —————————————————————————————————————————————————————————————————————————————————
export const FlatList = <T,>({
  id, theme, style, a11y, testID, ref,
  onLayout,
  numColumns, columnWrapperStyle,
  data, extraData, initialScrollIndex, windowSize, viewabilityConfig,
  onEndReachedThreshold, ListEmptyComponent, ListFooterComponent, ListHeaderComponent,
  ItemSeparatorComponent,
  renderItem, keyExtractor, getItemLayout, onEndReached,
  onViewableItemsChanged,
  horizontal, scrollEnabled, showsScrollIndicator,
  onContentSizeChange, onScroll,
}: FlatListProps<T>) => {

  const columns = Math.max(1, numColumns ?? 1);
  const listRef = useRef<VirtualizedListHandle>(null);

  // `VirtualizedList`'s handing of handles to consumers is inadequate because
  // `FlatList` is sensistive to multiple columns, while the base component is 1D.
  useImperativeHandle(ref, () => ({
    scrollTo: options => listRef.current?.scrollTo(options),
    scrollToEnd: options => listRef.current?.scrollToEnd(options),
    getScrollableNode: () => listRef.current?.getScrollableNode() ?? null,
    scrollToOffset: options => listRef.current?.scrollToOffset(options),
    scrollToIndex: ({ index, ...opts }) => listRef.current?.scrollToIndex({ index: Math.floor(index /columns), ...opts, }),
  }), [columns]);

  const renderRow = useCallback(({ item, index }: ListRenderItemInfo<T[]>) => (
    <ViewElement
      style={{
        display: 'flex',
        flexDirection: 'row',
        ...columnWrapperStyle,
      }}
    >
      { item.map((rowItem, rowItemIndex) => (
        <ViewElement
          key={ keyExtractor ? keyExtractor(rowItem, index *columns +rowItemIndex) : rowItemIndex }
          style={{ flex: 1, minWidth: 0 }}
        >
          {
            renderItem({
              item: rowItem,
              index: index *columns +rowItemIndex,
            })
          }
        </ViewElement>
      ))}
      {
        // pad the last row so cells keep equal width
        Array.from({ length: columns -item.length }, (_, i) => (
        <ViewElement
          key={`pad-${i}`}
          style={{ flex: 1, minWidth: 0 }}
        />
      ))}
    </ViewElement>
  ), [renderItem, keyExtractor, columnWrapperStyle, columns]);

  const rowLayout = useMemo(() => {
    if (!getItemLayout) return undefined;
    return ((_: T[] | undefined, row: number) => getItemLayout(data, row *columns));
  }, [getItemLayout, data, columns]);

  const handleViewable = useMemo(() => {
    if (!onViewableItemsChanged) return undefined;
    const expand = (tokens: ViewToken<T[]>[]): ViewToken<T>[] =>
      tokens.flatMap(token => token.item.map((item, i) => {
        const index = token.index == null ? null : token.index *columns +i;
        return {
          item,
          index,
          isViewable: token.isViewable,
          key: keyExtractor && index != null ? keyExtractor(item, index) : `${token.key}-${i}`,
        };
      }));
    return ({ viewableItems, changed }: {
      viewableItems: ViewToken<T[]>[];
      changed: ViewToken<T[]>[];
    }) => onViewableItemsChanged({
      viewableItems: expand(viewableItems),
      changed: expand(changed),
    });
  }, [onViewableItemsChanged, keyExtractor, columns]);

  return (
    <VirtualizedList<T[], T[]>
      data={ data }
      renderItem={ renderRow }
      getItem={ (data, row) => data.slice(row *columns, row *columns +columns) }
      getItemCount={ data => (data?.length ? Math.ceil(data.length /columns) : 0) }
      getItemLayout={ rowLayout }
      keyExtractor={
        keyExtractor
        ? (row, rowIndex) => keyExtractor(row[0], rowIndex *columns)
        : (_, rowIndex) => `row-${rowIndex}`
      }
      onScroll={ onScroll }
      onViewableItemsChanged={ handleViewable }
      viewabilityConfig={ viewabilityConfig }
      ListHeaderComponent={ ListHeaderComponent }
      ListFooterComponent={ ListFooterComponent }
      ListEmptyComponent={ ListEmptyComponent }
      ItemSeparatorComponent={ ItemSeparatorComponent }
      onEndReached={ onEndReached }
      onEndReachedThreshold={ onEndReachedThreshold }
      theme={ theme }
      style={ style }
      id={ id }
      a11y={ a11y }
      testID={ testID }
      ref={ listRef }
      onLayout={ onLayout }
      horizontal={ horizontal }
      scrollEnabled={ scrollEnabled }
      showsScrollIndicator={ showsScrollIndicator }
      onContentSizeChange={ onContentSizeChange }
    />
  );
};