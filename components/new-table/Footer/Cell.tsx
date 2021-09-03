import { defineComponent } from 'vue';
import Cell from '../Cell';
import { useInjectSummary } from '../context/SummaryContext';
import { useInjectTable } from '../context/TableContext';
import type { AlignType } from '../interface';
import { getCellFixedInfo } from '../utils/fixUtil';

export interface SummaryCellProps {
  className?: string;
  children?: any;
  index: number;
  colSpan?: number;
  rowSpan?: number;
  align?: AlignType;
}

export default defineComponent<SummaryCellProps>({
  name: 'SummaryCell',
  props: ['index', 'colSpan', 'rowSpan', 'align'] as any,
  inheritAttrs: false,
  setup(props, { attrs, slots }) {
    const tableContext = useInjectTable();
    const summaryContext = useInjectSummary();
    return () => {
      const { index, colSpan, rowSpan, align } = props;
      const { prefixCls, direction } = tableContext;
      const { scrollColumnIndex, stickyOffsets, flattenColumns } = summaryContext;
      const lastIndex = index + colSpan - 1;
      const mergedColSpan = lastIndex + 1 === scrollColumnIndex ? colSpan + 1 : colSpan;

      const fixedInfo = getCellFixedInfo(
        index,
        index + mergedColSpan - 1,
        flattenColumns,
        stickyOffsets,
        direction,
      );

      return (
        <Cell
          className={attrs.class as string}
          index={index}
          component="td"
          prefixCls={prefixCls}
          record={null}
          dataIndex={null}
          align={align}
          customRender={() => ({
            children: slots.defalut?.(),
            props: {
              colSpan: mergedColSpan,
              rowSpan,
            },
          })}
          {...fixedInfo}
        />
      );
    };
  },
});
