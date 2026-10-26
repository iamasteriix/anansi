import type { ComponentType, ReactElement, Ref } from 'react';
import type {
  ListRenderItemInfo, ViewToken, VirtualizedListHandle, VirtualizedListProps,
} from '../@core';
import { createElement, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { VirtualizedList } from '../@core';


// Types ————————————————————————————————————————————————————————————————————————————————
type SectionListData<T, S = {}> = S & {
  data: T[];
  key?: string;
  renderItem?: (info: SectionListRenderItemInfo<T, S>) => ReactElement | null;
  ItemSeparatorComponent?: ComponentType<any> | null;
  keyExtractor?: (item: T, index: number) => string;
};

type SectionListRenderItemInfo<T, S = {}> = ListRenderItemInfo<T> & {
  section: SectionListData<T, S>;
};

type SectionListRow<T, S> =
  | { kind: 'section-separator';  sectionIndex: number; }
  | { kind: 'header';             sectionIndex: number; section: SectionListData<T, S>; }
  | { kind: 'item';               sectionIndex: number; itemIndex: number;              item: T; }
  | { kind: 'item-separator';     sectionIndex: number; itemIndex: number; }
  | { kind: 'footer';             sectionIndex: number; section: SectionListData<T, S>; }

type ScrollToLocationOpts = {
  sectionIndex: number;
  itemIndex?: number;
  viewOffset?: number;
  animated?: boolean;
};

type SectionListHandle = VirtualizedListHandle & {
  scrollToLocation: (opts: ScrollToLocationOpts) => void;
};

type SectionListProps<T, S = {}> = Omit<
  VirtualizedListProps<SectionListRow<T, S>, SectionListData<T, S>[]>,
  'data' | 'renderItem' | 'getItem' | 'getItemCount' | 'getItemLayout' | 'keyExtractor' | 'ref'
> & {
  sections: SectionListData<T, S>[];
  renderItem: (info: SectionListRenderItemInfo<T, S>) => ReactElement | null;
  renderSectionHeader?: (info: { section: SectionListData<T, S> }) => ReactElement | null;
  renderSectionFooter?: (info: { section: SectionListData<T, S> }) => ReactElement | null;
  SectionSeparatorComponent?: ComponentType<any> | null;
  stickySectionHeadersEnabled?: boolean;
  keyExtractor?: (item: T, index: number) => string;
  ref?: Ref<SectionListHandle>;
};


// Core —————————————————————————————————————————————————————————————————————————————————
export const SectionList = <T, S = {}>({
  id, theme, style, a11y, testID, ref,
  onLayout,
  sections, SectionSeparatorComponent, ItemSeparatorComponent, ListHeaderComponent,
  ListFooterComponent, ListEmptyComponent, 
  renderItem, renderSectionHeader, renderSectionFooter, keyExtractor,
  onViewableItemsChanged, onEndReached,
  extraData, initialScrollIndex, windowSize, onEndReachedThreshold, viewabilityConfig,
  stickySectionHeadersEnabled,
  horizontal, scrollEnabled, showsScrollIndicator,
  onContentSizeChange, onScroll,
}: SectionListProps<T, S>) => {

  const listRef = useRef<VirtualizedListHandle>(null);

  const rows = useMemo(() => {
    const list: SectionListRow<T, S>[] = [];
    sections.forEach((section, sectionIndex) => {
      if (sectionIndex > 0 && SectionSeparatorComponent) list.push({ kind: 'section-separator', sectionIndex, });
      if (renderSectionHeader) list.push({ kind: 'header', sectionIndex, section, });
      if (renderSectionFooter) list.push({ kind: 'footer', sectionIndex, section, });
      section.data.forEach((item, itemIndex) => {
        list.push({ kind: 'item', sectionIndex, itemIndex, item, });
        const separator = section.ItemSeparatorComponent ?? ItemSeparatorComponent;
        if (itemIndex < section.data.length -1 && separator) list.push({ kind: 'item-separator', sectionIndex, itemIndex, });
      });
    });
    return list;
  }, [sections, renderSectionHeader, renderSectionFooter, SectionSeparatorComponent, ItemSeparatorComponent]);

  const scrollToLocation = useCallback(({ sectionIndex, itemIndex, animated = true, }: ScrollToLocationOpts) => {
    const target = itemIndex === null
      ? rows.findIndex(row => row.sectionIndex === sectionIndex)
      : rows.findIndex(row => (
          row.sectionIndex === sectionIndex &&
          row.kind === 'item' &&
          row.itemIndex === itemIndex
      ));
    if (target < 0) return;
    listRef.current?.scrollToIndex({ index: target, animated, })
  }, [rows]);

  useImperativeHandle(ref, () => ({
    scrollTo: options => listRef.current?.scrollTo(options),
    scrollToEnd: options => listRef.current?.scrollToEnd(options),
    getScrollableNode: () => listRef.current?.getScrollableNode() ?? null,
    scrollToOffset: options => listRef.current?.scrollToOffset(options),
    scrollToIndex: options => listRef.current?.scrollToIndex(options),
    scrollToLocation,
  }), [scrollToLocation]);

  const renderRow = useCallback(({ item: row }: ListRenderItemInfo<SectionListRow<T, S>>) => {
    const section = sections[row.sectionIndex];
    switch (row.kind) {
      case 'section-separator':
        return SectionSeparatorComponent ? createElement(SectionSeparatorComponent) : null;
      case 'header':
        return renderSectionHeader ? renderSectionHeader({ section }) : null;
      case 'footer':
        return renderSectionFooter ? renderSectionFooter({ section }) : null;
      case 'item-separator':
        return section.ItemSeparatorComponent ? createElement(section.ItemSeparatorComponent) : ItemSeparatorComponent ? createElement(ItemSeparatorComponent) : null;
      case 'item': {
        const fn = section.renderItem ?? renderItem;
        return fn({
          item: row.item,
          index: row.itemIndex,
          section,
        });
      }
    }
  }, [sections, renderItem, renderSectionHeader, renderSectionFooter, SectionSeparatorComponent, ItemSeparatorComponent]);

  const rowKeyExtractor = useCallback((row: SectionListRow<T, S>) => {
    const section = sections[row.sectionIndex];
    const sectionKey = section.key ?? `s${row.sectionIndex}`;
    switch (row.kind) {
      case 'header': return `${sectionKey}:header`;
      case 'footer': return `${sectionKey}:footer`;
      case 'section-separator': return `sep:${row.sectionIndex}`;
      case 'item-separator': return `${sectionKey}:sep:${row.itemIndex}`;
      case 'item': {
        const fn = section.keyExtractor ?? keyExtractor;
        return `${sectionKey}:item:${ fn ? fn(row.item, row.itemIndex) : row.itemIndex }`
      }
    }
  }, [sections, keyExtractor]);

  const handleViewable = useMemo(() => {
    if (!onViewableItemsChanged) return undefined;
    const pick = (tokens: ViewToken<SectionListRow<T, S>>[]): ViewToken<T>[] => (
      tokens.flatMap(token => token.item.kind === 'item'
        ? [{
            item: token.item.item,
            key: token.key,
            index: token.item.itemIndex,
            isViewable: token.isViewable,
          }]
        : []
    ));
    return ({ viewableItems, changed }: {
      viewableItems: ViewToken<SectionListRow<T, S>>[];
      changed: ViewToken<SectionListRow<T, S>>[];
    }) => onViewableItemsChanged({
      viewableItems: pick(viewableItems),
      changed: pick(changed),
    });
  }, [onViewableItemsChanged]);

  return (
    <VirtualizedList<SectionListRow<T, S>, SectionListRow<T, S>[]>
      data={ rows }
      renderItem={ renderRow }
      getItem={ (data, index) => data[index] }
      getItemCount={ data => data.length }
      keyExtractor={ rowKeyExtractor }
      onViewableItemsChanged={ handleViewable }
      viewabilityConfig={ viewabilityConfig }
      onScroll={ onScroll }
      onEndReached={ onEndReached }
      onEndReachedThreshold={ onEndReachedThreshold }
      ListHeaderComponent={ ListHeaderComponent }
      ListFooterComponent={ ListFooterComponent }
      ListEmptyComponent={ ListEmptyComponent }
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
}
