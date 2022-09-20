import React from "react";
import { Tracker, TrackerType } from "../../../../types/trackers";

type TitleProps = {
  tracker: Tracker;
};

export const Title = ({ tracker }: TitleProps) => {
  return (
    <div className="cell-title cell-title--no-hover">
      <div className="cell-title__text">
        {tracker.title}
        {tracker.type === TrackerType.DAILY &&
          (tracker.default_value !== 0 ||
            tracker.goal_value !== 1 ||
            tracker.is_infinite) && (
            <span className="cell-title__type">
              {tracker.default_value} → {tracker.goal_value}
              {tracker.is_infinite && " ∞"}
            </span>
          )}
        {tracker.type === TrackerType.TIMER && (
          <span className="cell-title__type">
            {tracker.type === TrackerType.TIMER
              ? tracker.goal_value / 60
              : tracker.goal_value}{" "}
            min
          </span>
        )}
      </div>
    </div>
  );
};
