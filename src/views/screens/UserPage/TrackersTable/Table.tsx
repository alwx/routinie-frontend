import React from "react";
import { Column, useFlexLayout, useTable } from "react-table";

import { Tracker } from "../../../../types/trackers";
import { Row } from "./Row";

type TableProps = {
  columns: Column<Tracker>[];
  data: Tracker[];
};

export const Table = ({ columns, data }: TableProps) => {
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
            return <Row index={i} row={row} {...row.getRowProps()} />;
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
  );
};
