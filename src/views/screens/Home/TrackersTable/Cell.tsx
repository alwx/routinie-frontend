import React, { SyntheticEvent } from "react";
import { DateTime } from "luxon";
import chroma from "chroma-js";
import { useLongPress } from "use-long-press";

import { useContextMenuHelpers } from "../../../../hooks/contextMenu";
import { useAppDispatch, useAppSelector } from "../../../../hooks/store";
import {
  usePatchTrackerEventMutation,
  usePostTrackerEventMutation,
} from "../../../../services";
import {
  closeContextMenu,
  contextMenuClosedAt,
  updateContextMenu,
} from "../../../../store/contextMenu";
import { addTrackers } from "../../../../store/trackers";
import {
  addTrackerEvents,
  trackerEventsData,
} from "../../../../store/trackerEvents";
import {
  ContextMenuPositionType,
  ContextMenuType,
} from "../../../../types/contextMenu";
import {
  NewTrackerEvent,
  PatchedTrackerEvent,
  TrackerEvent,
  TrackerEventResponse,
  TrackerEventType,
} from "../../../../types/trackerEvents";
import { Tracker, TrackerType } from "../../../../types/trackers";
import { User } from "../../../../types/users";
import {
  daysAgo,
  diffBetweenNowAndTrackerEventCreatedAt,
  toHHMMSS,
  trackerEventAssignedTo,
} from "../../../../utils/date";
import { CANNOT_BE_FULFILLED, TrackerUtils } from "../../../../utils/trackers";

type CellProps = {
  tracker: Tracker;
  day: DateTime;
  user: User;
};

export const Cell = ({ tracker, day, user }: CellProps) => {
  const dispatch = useAppDispatch();
  const { showNetworkError } = useContextMenuHelpers();
  const trackerEvents = useAppSelector(trackerEventsData);
  const [postTrackerEvent] = usePostTrackerEventMutation();
  const [patchTrackerEvent] = usePatchTrackerEventMutation();

  const lastTrackerEvent = React.useMemo(() => {
    const date = day.toLocaleString(DateTime.DATE_SHORT);
    return (trackerEvents[date] || {})[tracker.id];
  }, [trackerEvents, day, tracker.id]);

  const canUpdate = React.useMemo(() => {
    const ago = daysAgo(day);
    if (tracker.type === TrackerType.TIMER) {
      return ago < 1;
    }
    return (
      ago < (user.subscribed_at ? 4 : 2) // TODO: `user.can_update_older_entries && user.subscribed_at`
    );
  }, [day, user, tracker]);

  const postNewTrackerEvent = (newTrackerEvent: NewTrackerEvent) => {
    postTrackerEvent(newTrackerEvent)
      .unwrap()
      .then((response: TrackerEventResponse) => {
        dispatch(addTrackers([response.tracker]));
        dispatch(addTrackerEvents([response.tracker_event]));
      })
      .catch((error) => {
        showNetworkError(error?.data?.message);
      });
  };

  const patchExistingTrackerEvent = (
    trackerEventId: string,
    patchedTrackerEvent: PatchedTrackerEvent
  ) => {
    patchTrackerEvent({ trackerEvent: patchedTrackerEvent, id: trackerEventId })
      .unwrap()
      .then((response: TrackerEventResponse) => {
        dispatch(addTrackers([response.tracker]));
        dispatch(addTrackerEvents([response.tracker_event]));
      })
      .catch((error) => {
        showNetworkError(error?.data?.message);
      });
  };

  const useHover = (
    lastTrackerEvent: TrackerEvent,
    tracker: Tracker,
    canUpdate: boolean
  ) => {
    const [domRect, setDomRect] = React.useState<DOMRect | undefined>(
      undefined
    );
    const [now, setNow] = React.useState<DateTime>(DateTime.now());

    const contextMenuClosed = useAppSelector(contextMenuClosedAt);

    const onMouseEnter = (e: SyntheticEvent) => {
      setDomRect(e.currentTarget.getBoundingClientRect());
    };

    const onMouseLeave = (e: SyntheticEvent) => {
      setDomRect(undefined);
    };

    React.useEffect(() => {
      if (tracker.type === TrackerType.TIMER) {
        setInterval(() => setNow(DateTime.now()), 500);
      }
    }, [tracker]);

    const lastTrackerEventTrackerValue = React.useMemo(() => {
      if (tracker.type === TrackerType.DAILY && lastTrackerEvent) {
        return lastTrackerEvent.value;
      }
      if (
        tracker.type === TrackerType.TIMER &&
        lastTrackerEvent &&
        lastTrackerEvent.type === TrackerEventType.TIMER_START
      ) {
        const ago = daysAgo(day);
        if (ago === 0) {
          return (
            diffBetweenNowAndTrackerEventCreatedAt(lastTrackerEvent, now) +
            lastTrackerEvent.value
          );
        }
        // TODO(alwx): rename function; simplify
        return (
          diffBetweenNowAndTrackerEventCreatedAt(lastTrackerEvent, DateTime.fromISO(lastTrackerEvent.created_at).endOf("day")) +
          lastTrackerEvent.value
        );
      }
      if (
        tracker.type === TrackerType.TIMER &&
        lastTrackerEvent &&
        lastTrackerEvent.type === TrackerEventType.TIMER_STOP
      ) {
        return lastTrackerEvent.value;
      }
      return tracker.default_value;
    }, [lastTrackerEvent, tracker, now]);

    const currentFulfillmentProgress = React.useMemo(() => {
      const progress = TrackerUtils.fulfillmentProgress(
        tracker,
        lastTrackerEventTrackerValue
      );
      if (progress) {
        return Math.max(0, Math.min(progress, 1));
      }
      return CANNOT_BE_FULFILLED;
    }, [tracker, lastTrackerEventTrackerValue]);

    const nextFulfillmentProgress = React.useMemo(() => {
      const nextValue = TrackerUtils.nextValue(
        tracker,
        lastTrackerEventTrackerValue
      );
      const progress = TrackerUtils.fulfillmentProgress(tracker, nextValue);
      if (progress) {
        return Math.max(0, Math.min(progress, 1));
      }
      return CANNOT_BE_FULFILLED;
    }, [tracker, lastTrackerEventTrackerValue]);

    const hoverText = React.useMemo<string>(() => {
      if (!canUpdate || !domRect) {
        if (tracker.type === TrackerType.TIMER) {
          return toHHMMSS(lastTrackerEventTrackerValue);
        }
        return "" + lastTrackerEventTrackerValue;
      }
      // hover, finally
      if (
        tracker.type === TrackerType.TIMER &&
        (!lastTrackerEvent ||
          lastTrackerEvent.type === TrackerEventType.TIMER_STOP)
      ) {
        return "►";
      }
      if (
        tracker.type === TrackerType.TIMER &&
        lastTrackerEvent &&
        lastTrackerEvent.type === TrackerEventType.TIMER_START
      ) {
        return "■";
      }
      if (tracker.type === TrackerType.DAILY) {
        return (
          "" + TrackerUtils.nextValue(tracker, lastTrackerEventTrackerValue)
        );
      }
      return "";
    }, [
      tracker,
      lastTrackerEvent,
      lastTrackerEventTrackerValue,
      domRect,
      canUpdate,
    ]);

    const extraCellClass = React.useMemo(() => {
      if (hoverText.length > 5) {
        return " cell-item--smaller";
      }
      return "";
    }, [hoverText]);

    const textColor = (() => {
      if (
        TrackerUtils.totalEventsRequiredToFulfill(tracker) === 1 &&
        !tracker.is_infinite
      ) {
        return "transparent";
      }
      if (currentFulfillmentProgress || lastTrackerEventTrackerValue !== 0) {
        return chroma(tracker.color).darken(2).hex();
      }
      return "transparent";
    })();

    const hoverTextColor = (() => {
      if (
        TrackerUtils.totalEventsRequiredToFulfill(tracker) === 1 &&
        !tracker.is_infinite
      ) {
        return "transparent";
      }
      if (nextFulfillmentProgress) {
        return chroma(tracker.color).darken(nextFulfillmentProgress).hex();
      }
      return "transparent";
    })();

    const backgroundColor = (() => {
      if (currentFulfillmentProgress) {
        return chroma(tracker.color).alpha(currentFulfillmentProgress).hex();
      }
      return "transparent";
    })();

    const hoverBackgroundColor = (() => {
      if (nextFulfillmentProgress) {
        return chroma(tracker.color)
          .alpha(nextFulfillmentProgress * 0.75)
          .hex();
      }
      return "transparent";
    })();

    const hoverStyle =
      !domRect || !canUpdate
        ? {
            backgroundColor: backgroundColor,
            color: textColor,
          }
        : {
            backgroundColor: hoverBackgroundColor,
            color: hoverTextColor,
          };

    const onCellClick = (e: React.MouseEvent) => {
      if (!contextMenuClosed) {
        return;
      }

      if (!canUpdate) {
        return;
      }

      // timers are different / simpler and can be either started or stopped
      if (tracker.type === TrackerType.TIMER) {
        if (
          !lastTrackerEvent ||
          lastTrackerEvent.type === TrackerEventType.TIMER_STOP
        ) {
          const newTrackerEvent = {
            type: TrackerEventType.TIMER_START,
            tracker_id: tracker.id,
            value: lastTrackerEvent ? lastTrackerEvent.value : 0,
            assigned_to_date: trackerEventAssignedTo(day),
          };
          postNewTrackerEvent(newTrackerEvent);
          return;
        }

        if (
          lastTrackerEvent &&
          lastTrackerEvent.type === TrackerEventType.TIMER_START
        ) {
          const newTrackerEvent = {
            type: TrackerEventType.TIMER_STOP,
            tracker_id: tracker.id,
            value:
              diffBetweenNowAndTrackerEventCreatedAt(lastTrackerEvent) +
              lastTrackerEvent.value,
            assigned_to_date: trackerEventAssignedTo(day),
          };
          postNewTrackerEvent(newTrackerEvent);
          return;
        }
      }

      // tracker events can always be added to
      // 1) infinite trackers
      // 2) trackers with totalEventsRequiredToFulfill == 1 (basically an INCREASE/DECREASE switch)
      // tracker events cannot also be added to finite trackers that reached their goal state
      const totalEventsRequiredToFulfill =
        TrackerUtils.totalEventsRequiredToFulfill(tracker);
      if (
        !tracker.is_infinite &&
        totalEventsRequiredToFulfill &&
        totalEventsRequiredToFulfill > 1 &&
        lastTrackerEventTrackerValue === tracker.goal_value
      ) {
        onCellRightClick(e);
        return;
      }

      let nextValue;
      if (
        !tracker.is_infinite &&
        totalEventsRequiredToFulfill === 1 &&
        lastTrackerEventTrackerValue === tracker.goal_value
      ) {
        // in this case we just reset to default because it's a "switch" tracker
        nextValue = tracker.default_value;
      } else {
        nextValue = TrackerUtils.nextValue(
          tracker,
          lastTrackerEventTrackerValue
        );
      }

      if (nextValue === lastTrackerEventTrackerValue) {
        // it means tracker is fulfilled
        return;
      }

      const newTrackerEvent = {
        type: TrackerEventType.SET,
        tracker_id: tracker.id,
        value: nextValue,
        assigned_to_date: trackerEventAssignedTo(day),
      };

      if (!lastTrackerEvent) {
        postNewTrackerEvent(newTrackerEvent);
      } else {
        patchExistingTrackerEvent(lastTrackerEvent.id, newTrackerEvent);
      }
    };

    const updateTrackerValue = (newTrackerEvent: NewTrackerEvent) => {
      if (!lastTrackerEvent) {
        postNewTrackerEvent(newTrackerEvent);
      } else {
        patchExistingTrackerEvent(lastTrackerEvent.id, newTrackerEvent);
      }
    };

    const onCellRightClick = (e: React.MouseEvent | undefined) => {
      if (!domRect) {
        return;
      }

      e?.preventDefault();

      if (!canUpdate) {
        return;
      }

      if (TrackerUtils.totalEventsRequiredToFulfill(tracker) === 1) {
        return;
      }

      if (tracker.type === TrackerType.TIMER) {
        return;
      }

      dispatch(
        updateContextMenu({
          position: {
            type: ContextMenuPositionType.POSITION,
            x: domRect.right - 2,
            y: domRect.bottom,
            width: domRect.width * 5,
          },
          options: [
            {
              type: ContextMenuType.TRACKER_VALUE_CHOOSER,
              data: {
                cellWidth: domRect.width,
                tracker: tracker,
                currentValue: lastTrackerEventTrackerValue,
                onValueChoose: (value: number) => {
                  updateTrackerValue({
                    type: TrackerEventType.SET,
                    tracker_id: tracker.id,
                    value: value,
                    assigned_to_date: trackerEventAssignedTo(day),
                  });
                  dispatch(closeContextMenu());
                },
              },
            },
            {
              type: ContextMenuType.CLICKABLE,
              data: {
                label: `Fulfill (set to ${tracker.goal_value})`,
                action: () => {
                  updateTrackerValue({
                    type: TrackerEventType.SET,
                    tracker_id: tracker.id,
                    value: tracker.goal_value,
                    assigned_to_date: trackerEventAssignedTo(day),
                  });
                  dispatch(closeContextMenu());
                },
              },
            },
            {
              type: ContextMenuType.CLICKABLE,
              data: {
                label: `Clear (set to ${tracker.default_value})`,
                action: () => {
                  updateTrackerValue({
                    type: TrackerEventType.SET,
                    tracker_id: tracker.id,
                    value: tracker.default_value,
                    assigned_to_date: trackerEventAssignedTo(day),
                  });
                  dispatch(closeContextMenu());
                },
              },
            },
          ],
        })
      );

      return false;
    };

    return {
      hoverStyle,
      hoverText,
      onCellClick,
      onCellRightClick,
      onMouseEnter,
      onMouseLeave,
      extraCellClass,
    };
  };

  const {
    hoverStyle,
    hoverText,
    onCellClick,
    onCellRightClick,
    onMouseEnter,
    onMouseLeave,
    extraCellClass,
  } = useHover(lastTrackerEvent, tracker, canUpdate);

  const { onMouseLeave: onLongPressMouseLeave, ...longPress } = useLongPress(
    (e) => {
      onCellRightClick(undefined);
    }
  );

  return (
    <div
      className={
        "cell-item" +
        (!canUpdate ? " cell-item--non-updatable" : "") +
        extraCellClass
      }
      style={hoverStyle}
      onClick={onCellClick}
      onContextMenu={onCellRightClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={(e) => {
        onMouseLeave(e);
        onLongPressMouseLeave(e);
      }}
      {...longPress}
    >
      {hoverText}
    </div>
  );
};
