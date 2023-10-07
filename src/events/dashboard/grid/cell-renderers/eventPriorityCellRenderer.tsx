import { ICellRendererParams } from "ag-grid-community";
import classnames from "classnames";

export default function EventPriorityCellRenderer(params: ICellRendererParams) {
  const hasHighPriority = params.value > 7;
  return (
    <div
      className={classnames("flex relative justify-center gap-1 items-center", {
        "text-red-700 font-bold": hasHighPriority,
      })}
    >
      {params.value}
    </div>
  );
}
