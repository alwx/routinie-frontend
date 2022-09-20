import { DateTime } from "luxon";
import { Column } from "react-table";
import { Tracker } from "../../../../types/trackers";
import { DateSpecification } from "../../../../utils/date";

const range = (len: number): number[] => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

export const generateColumns = (
  dateSpecification: DateSpecification,
  renderCell: (tracker: Tracker, day: DateTime, index: number) => any,
  renderTitle: (tracker: Tracker) => any
): Column<Tracker>[] => {
  return [
    {
      id: "title",
      accessor: (tracker: Tracker) => {
        return renderTitle(tracker);
      },
    },
    ...range(dateSpecification.daysToShow).map((i) => {
      const day = dateSpecification.dayToStart.plus({ days: i });
      const dateParts = day
        .toLocaleParts({ month: "short", day: "numeric", weekday: "short" })
        .filter((part) => part.type !== "literal");

      return {
        id: "day" + (dateSpecification.daysToShow - i - 1),
        Header: () => {
          return (
            <div className="cell-date">
              {dateParts.map((part) => {
                const className =
                  "cell-date__item cell-date__item--" + part.type;
                const key = `header_day_${i}_${part.type}`;
                return (
                  <div className={className} key={key}>
                    {part.value}
                  </div>
                );
              })}
            </div>
          );
        },
        accessor: (tracker: Tracker) => {
          return renderCell(tracker, day, dateSpecification.daysToShow - i - 1);
        },
      };
    }),
    {
      id: "empty_space",
      Header: () => {
        return <div></div>;
      },
      Cell: ({ row }: { row: any }) => {
        return null;
      },
    },
    {
      id: "current_streak",
      Header: () => {
        return "Current streak";
      },
      accessor: (tracker: Tracker) => {
        return tracker.current_streak || 0;
      },
    },
    {
      id: "longest_streak",
      Header: () => {
        return "Longest streak";
      },
      accessor: (tracker: Tracker) => {
        return tracker.max_streak || 0;
      },
    },
  ];
};
