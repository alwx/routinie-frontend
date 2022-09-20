import React, { SyntheticEvent } from "react";
import { useHistory } from "react-router";

import { useContextMenuHelpers } from "../../../../hooks/contextMenu";
import { useAppDispatch } from "../../../../hooks/store";
import { addTrackers } from "../../../../store/trackers";
import {
  closeContextMenu,
  updateContextMenu,
} from "../../../../store/contextMenu";
import {
  ContextMenuPositionType,
  ContextMenuType,
} from "../../../../types/contextMenu";
import { usePatchTrackerMutation } from "../../../../services";
import {
  Tracker,
  TrackerResponse,
  TrackerType,
} from "../../../../types/trackers";
import { TrackerUtils } from "../../../../utils/trackers";

type TitleProps = {
  tracker: Tracker;
  allTrackers: Tracker[];
};

export const Title = ({ tracker, allTrackers }: TitleProps) => {
  const { push } = useHistory();
  const { showNetworkError } = useContextMenuHelpers();
  const dispatch = useAppDispatch();

  const [patchTracker] = usePatchTrackerMutation();

  const trackerIndex = React.useMemo(() => {
    return allTrackers.findIndex((t) => t.id === tracker.id);
  }, [tracker, allTrackers]);

  const moveTracker = (dragIndex: number, hoverIndex: number) => {
    const newRank = TrackerUtils.rankFromTrackers(
      allTrackers,
      dragIndex,
      hoverIndex
    );

    patchTracker({
      patchedTracker: { rank: newRank },
      id: tracker.id,
    })
      .unwrap()
      .then((response: TrackerResponse) => {
        dispatch(addTrackers([response.tracker]));
      })
      .catch((error) => {
        showNetworkError(error?.data?.message);
      });
  };

  const useHover = (tracker: Tracker) => {
    const [domRect, setDomRect] = React.useState<DOMRect | undefined>(
      undefined
    );

    const onMouseEnter = (e: SyntheticEvent) => {
      setDomRect(e.currentTarget.getBoundingClientRect());
    };

    const onMouseLeave = (e: SyntheticEvent) => {
      setDomRect(undefined);
    };

    const onCellRightClick = (e: React.MouseEvent | undefined) => {
      if (!domRect) {
        return;
      }

      e?.preventDefault();

      dispatch(
        updateContextMenu({
          position: {
            type: ContextMenuPositionType.POSITION,
            x: domRect.left + 50,
            y: domRect.bottom,
            width: domRect.width + 8,
          },
          options: [
            {
              type: ContextMenuType.CLICKABLE,
              data: {
                label: "Edit tracker...",
                action: () => {
                  push(`/trackers/${tracker.id}`, true);
                  dispatch(closeContextMenu());
                },
              },
            },
            trackerIndex > 0
              ? {
                  type: ContextMenuType.CLICKABLE,
                  data: {
                    label: "Move up",
                    action: () => {
                      moveTracker(trackerIndex, trackerIndex - 1);
                      dispatch(closeContextMenu());
                    },
                  },
                }
              : null,
            trackerIndex < allTrackers.length - 1
              ? {
                  type: ContextMenuType.CLICKABLE,
                  data: {
                    label: "Move down",
                    action: () => {
                      moveTracker(trackerIndex, trackerIndex + 1);
                      dispatch(closeContextMenu());
                    },
                  },
                }
              : null,
          ],
        })
      );

      return false;
    };

    return {
      onCellRightClick,
      onMouseEnter,
      onMouseLeave,
    };
  };

  const { onCellRightClick, onMouseEnter, onMouseLeave } = useHover(tracker);

  return (
    <div
      className="cell-title"
      onContextMenu={onCellRightClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={(e) => {
        onMouseLeave(e);
      }}
      onClick={(e) => {
        onCellRightClick(e);
      }}
    >
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
        {tracker.is_public && (
          <>
            {" "}
            <span className="cell-title__eye">👁</span>
          </>
        )}
      </div>
    </div>
  );
};
