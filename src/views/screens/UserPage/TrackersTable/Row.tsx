import React from "react";
import { Row as ReactTableRow } from "react-table";

import { Tracker } from "../../../../types/trackers";

type TableRowProps = {
  index: number;
  row: ReactTableRow<Tracker>;
};

export const Row = ({ row, index }: TableRowProps) => {
  const props = row.getRowProps();
  return (
    <div className="trackers-table__row" {...props} style={props.style}>
      {row.cells.map((cell, index) => {
        return (
          <div
            className={
              "trackers-table__cell trackers-table__cell--" + cell.column.id
            }
            {...cell.getCellProps()}
          >
            {cell.render("Cell")}
          </div>
        );
      })}
    </div>
  );
};
