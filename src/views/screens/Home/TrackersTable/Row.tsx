import React from "react";
import { useDrag, useDrop, XYCoord } from "react-dnd";
import { Row as ReactTableRow } from "react-table";

import { Tracker } from "../../../../types/trackers";

const DND_ITEM_TYPE = "row";

type TableRowProps = {
  index: number;
  row: ReactTableRow<Tracker>;
  onMoveRow: (dragIndex: number, hoverIndex: number) => void;
  onDropRow: (dragIndex: number) => void;
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const Row = ({ row, index, onMoveRow, onDropRow }: TableRowProps) => {
  const dropRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item: DragItem, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      onMoveRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    drop(item: DragItem, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      onDropRow(dragIndex);
    },
  });

  const [, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    item: { type: DND_ITEM_TYPE, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  preview(drop(dropRef));
  drag(dragRef);

  const props = row.getRowProps();
  return (
    <div
      className="trackers-table__row"
      ref={dropRef}
      {...props}
      style={props.style}
    >
      {row.cells.map((cell, index) => {
        return (
          <div
            ref={index === 0 ? dragRef : null}
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
