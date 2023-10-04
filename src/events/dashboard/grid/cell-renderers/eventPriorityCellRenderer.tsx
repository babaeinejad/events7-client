import { ICellRendererParams } from "ag-grid-community";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import classnames from "classnames";

export default function EventPriorityCellRenderer(params: ICellRendererParams) {
  const hasHighPriority = params.value > 7;
  return (
    <div
      className={classnames("flex justify-center gap-1 items-center", {
        "text-red-700 font-bold": hasHighPriority,
      })}
    >
      {params.value}
      {hasHighPriority && (
        <PriorityHighIcon fontSize="inherit" className="text-red-700 text-xs" />
      )}
    </div>
  );
}
