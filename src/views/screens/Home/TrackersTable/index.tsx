import React from "react";
import { DateTime } from "luxon";
import { useHistory } from "react-router";

import { DateSpecification, MAX_DATES_TO_SHOW } from "../../../../utils/date";
import { generateColumns } from "./generateColumns";

import { useContextMenuHelpers } from "../../../../hooks/contextMenu";
import { useAppDispatch, useAppSelector } from "../../../../hooks/store";
import {
  setTableScrollTo,
  addTrackers,
  updateTracker,
  trackersData,
  trackersTableScrollTo,
} from "../../../../store/trackers";
import {
  useGetTrackerEventsQuery,
  usePatchTrackerMutation,
} from "../../../../services";
import { isJustRegistered, setIsJustRegistered } from "../../../../store/users";
import { User } from "../../../../types/users";
import { Tracker, TrackerResponse } from "../../../../types/trackers";
import { TrackerUtils } from "../../../../utils/trackers";

import { Cell } from "./Cell";
import { Table } from "./Table";
import { Title } from "./Title";

import "./TrackersTable.scss";
import "./Cells.scss";
import {
  closeContextMenu,
  updateContextMenu,
} from "../../../../store/contextMenu";
import {
  ContextMenuPositionType,
  ContextMenuType,
} from "../../../../types/contextMenu";

type Props = {
  user: User;
};

const TrackersTable = ({ user }: Props) => {
  const [loadWindow, setLoadWindow] = React.useState<
    { since: number; until: number } | undefined
  >(undefined);

  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const { showNetworkError, showPremiumBlocked } = useContextMenuHelpers();

  const scrollTo = useAppSelector(trackersTableScrollTo);
  const trackers = useAppSelector(trackersData);
  const isUserJustRegistered = useAppSelector(isJustRegistered);

  const [patchTracker] = usePatchTrackerMutation();

  React.useEffect(() => {
    if (isUserJustRegistered) {
      dispatch(
        updateContextMenu({
          isBlockingView: false,
          position: {
            type: ContextMenuPositionType.CENTER,
          },
          options: [
            {
              type: ContextMenuType.PROMPT,
              data: {
                title: "Welcome to Routinie!",
                text:
                  "*Hello there!*\n" +
                  "\n" +
                  "You've just created your first tracker which means you're ready to go. " +
                  "However, there are certain things you need to know first:\n" +
                  "\n" +
                  "* You can only add events for today and yesterday. This is intentional — if we gave you the " +
                  "ability to add/edit events for all dates, it would become much easier to maintain streaks.\n" +
                  "* It's even more complicated with timers — you can only start today's timers.\n" +
                  "* You're currently limited to three active trackers. Adding more is a [Premium feature](/premium)\n" +
                  "\n" +
                  "*Routinie is still in active development. We kindly ask you to send information about all possible bugs and issues to support@routinie.com*",
                buttons: [
                  {
                    text: "OK",
                    action: () => {
                      dispatch(closeContextMenu());
                    },
                  },
                ],
              },
            },
          ],
        })
      );
      dispatch(setIsJustRegistered(false));
    }
  }, [isUserJustRegistered, dispatch]);

  // this is to load tracker events when the new `loadWindow` is specified
  useGetTrackerEventsQuery(
    {
      since: loadWindow?.since || 0,
      until: loadWindow?.until || 0,
    },
    { skip: !loadWindow }
  );

  const dateSpecification = React.useMemo(() => {
    return new DateSpecification(
      DateTime.fromISO(user.created_at).startOf("day"),
      MAX_DATES_TO_SHOW,
      scrollTo
    );
  }, [user, scrollTo]);

  const onLeftClick = React.useCallback(() => {
    const newDate = dateSpecification.dayToStart.minus({
      days: MAX_DATES_TO_SHOW,
    });
    setLoadWindow({
      since: newDate.minus(MAX_DATES_TO_SHOW).toUTC().toSeconds(),
      until: newDate.plus(MAX_DATES_TO_SHOW).toUTC().toSeconds(),
    });
    dispatch(setTableScrollTo(newDate.valueOf()));
  }, [dateSpecification.dayToStart, dispatch]);

  const onRightClick = React.useCallback(() => {
    const newDate = dateSpecification.dayToStart.plus({
      days: MAX_DATES_TO_SHOW,
    });
    dispatch(setTableScrollTo(newDate.valueOf()));
  }, [dateSpecification.dayToStart, dispatch]);

  const onAddNewTrackerClick = React.useCallback(() => {
    if (!user.subscribed_at && trackers.length >= 3) {
      showPremiumBlocked("Go Premium to be able to add more than 3 trackers!");
      return;
    }
    push("/trackers", true);
  }, [push, trackers, user, showPremiumBlocked]);

  const onMoveRow = (dragIndex: number, hoverIndex: number) => {
    const draggableTracker = trackers[dragIndex];
    const newRank = TrackerUtils.rankFromTrackers(
      trackers,
      dragIndex,
      hoverIndex
    );

    dispatch(updateTracker([draggableTracker.id, { rank: newRank }]));
  };

  const onDropRow = (dragIndex: number) => {
    const draggableTracker = trackers[dragIndex];

    patchTracker({
      patchedTracker: { rank: draggableTracker.rank },
      id: draggableTracker.id,
    })
      .unwrap()
      .then((response: TrackerResponse) => {
        dispatch(addTrackers([response.tracker]));
      })
      .catch((error) => {
        showNetworkError(error?.data?.message);
      });
  };

  const renderCell = React.useCallback(
    (tracker: Tracker, day: DateTime, index: number) => {
      return <Cell tracker={tracker} day={day} user={user} />;
    },
    [user]
  );

  const renderTitle = React.useCallback(
    (tracker: Tracker) => {
      return <Title tracker={tracker} allTrackers={trackers} />;
    },
    [trackers]
  );

  const columns = React.useMemo(() => {
    return generateColumns(
      dateSpecification,
      renderCell,
      renderTitle,
      onLeftClick,
      onRightClick,
      onAddNewTrackerClick
    );
  }, [
    dateSpecification,
    renderCell,
    renderTitle,
    onLeftClick,
    onRightClick,
    onAddNewTrackerClick,
  ]);

  return (
    <Table
      columns={columns}
      data={trackers}
      onMoveRow={onMoveRow}
      onDropRow={onDropRow}
    />
  );
};

export default TrackersTable;
