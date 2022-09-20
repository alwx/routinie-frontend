import _ from "lodash";
import React from "react";
import chroma from "chroma-js";

import { Tracker } from "../../../../types/trackers";
import { CANNOT_BE_FULFILLED, TrackerUtils } from "../../../../utils/trackers";

import "./TrackerValueChooser.scss";

export type TrackerValueChooserData = {
  tracker?: Tracker;
  currentValue?: number;
  onValueChoose?: (value: number) => any;
  cellWidth?: number;
};

interface Props {
  optionData: TrackerValueChooserData;
}

interface ItemProps {
  tracker: Tracker;
  value: number;
  onValueChoose: (value: number) => any;
  cellWidth?: number;
}

function TrackerValueChooserItem({
  tracker,
  value,
  onValueChoose,
  cellWidth,
}: ItemProps) {
  const useHover = (lastTrackerEventTrackerValue: number, tracker: Tracker) => {
    const [hover, setHover] = React.useState(false);

    const onMouseEnter = () => {
      setHover(true);
    };
    const onMouseLeave = () => {
      setHover(false);
    };

    const currentFulfillmentProgress = React.useMemo(() => {
      const progress = TrackerUtils.fulfillmentProgress(tracker, value);
      if (progress) {
        return Math.max(0, Math.min(progress, 1));
      }
      return CANNOT_BE_FULFILLED;
    }, [tracker]);

    const backgroundColor = (() => {
      if (currentFulfillmentProgress) {
        return chroma(tracker.color).alpha(currentFulfillmentProgress).hex();
      }
      return "transparent";
    })();

    const textColor = chroma(tracker.color).darken(2).hex();
    const hoverTextColor = chroma(tracker.color).darken(3).hex();

    const hoverStyle = !hover
      ? {
          backgroundColor: backgroundColor,
          color: textColor,
        }
      : {
          backgroundColor: backgroundColor,
          color: hoverTextColor,
        };

    return { hoverStyle, onMouseEnter, onMouseLeave };
  };

  const onCellClick = (e: React.MouseEvent<HTMLDivElement>, value: number) => {
    onValueChoose(value);
  };

  const { hoverStyle, ...hoverProps } = useHover(value, tracker);

  console.log(cellWidth);

  return (
    <div
      className="tracker-value-chooser__item"
      style={{ ...hoverStyle, minWidth: cellWidth || "auto" }}
      {...hoverProps}
      onClick={(e) => onCellClick(e, value)}
    >
      {value}
    </div>
  );
}

export default function TrackerValueChooser({ optionData }: Props) {
  if (!optionData.tracker || !optionData.onValueChoose) {
    return null;
  }
  const tracker = optionData.tracker;
  const onValueChoose = optionData.onValueChoose;
  const step =
    tracker.goal_value > tracker.default_value
      ? tracker.default_change
      : -tracker.default_change;
  const range = [
    ..._.range(tracker.default_value, tracker.goal_value, step),
    tracker.goal_value,
  ];

  return (
    <div className="tracker-value-chooser">
      {range.map((value) => {
        return (
          <TrackerValueChooserItem
            key={"tracker_" + value}
            tracker={tracker}
            value={value}
            onValueChoose={onValueChoose}
            cellWidth={optionData.cellWidth}
          />
        );
      })}
    </div>
  );
}
