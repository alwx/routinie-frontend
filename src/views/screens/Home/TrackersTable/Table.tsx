import React from "react";
import { Column, useFlexLayout, useTable } from "react-table";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Tracker } from "../../../../types/trackers";
import { Row } from "./Row";

type TableProps = {
  columns: Column<Tracker>[];
  data: Tracker[];
  onMoveRow: (dragIndex: number, hoverIndex: number) => void;
  onDropRow: (dragIndex: number) => void;
};

export const Table = ({ columns, data, onMoveRow, onDropRow }: TableProps) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
  } = useTable<Tracker>(
    {
      data,
      columns,
    },
    useFlexLayout
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="trackers-table">
        <div className="trackers-table__content" {...getTableProps()}>
          {headerGroups.map((headerGroup) => (
            <div
              className="trackers-table__header-row"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <div
                  className={
                    "trackers-table__header-cell trackers-table__header-cell--" +
                    column.id
                  }
                  {...column.getHeaderProps()}
                >
                  {column.render("Header")}
                </div>
              ))}
            </div>
          ))}
          <div {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <Row
                  index={i}
                  row={row}
                  onMoveRow={onMoveRow}
                  onDropRow={onDropRow}
                  {...row.getRowProps()}
                />
              );
            })}
          </div>
          {footerGroups.map((group) => (
            <div
              className="trackers-table__footer-row"
              {...group.getFooterGroupProps()}
            >
              {group.headers.map((column) => (
                <div
                  className={
                    "trackers-table__footer-cell trackers-table__footer-cell--" +
                    column.id
                  }
                  {...column.getFooterProps()}
                >
                  {column.render("Footer")}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};
