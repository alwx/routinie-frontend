import React from "react";
import { DateTime } from "luxon";

import { generateColumns } from "./generateColumns";

import { Tracker } from "../../../../types/trackers";
import { TrackerEvent } from "../../../../types/trackerEvents";
import { processTrackerEvents } from "../../../../utils/trackerEvents";
import {
  DateSpecification,
  getCurrentLocalDate,
  MAX_DATES_TO_SHOW,
} from "../../../../utils/date";

import { Cell } from "./Cell";
import { Table } from "./Table";
import { Title } from "./Title";

type Props = {
  trackers: Tracker[];
  trackerEvents: TrackerEvent[];
};

const TrackersTable = ({ trackers, trackerEvents }: Props) => {
  const dateSpecification = React.useMemo(() => {
    return new DateSpecification(
      getCurrentLocalDate(),
      MAX_DATES_TO_SHOW,
      getCurrentLocalDate()
    );
  }, []);

  const renderCell = React.useCallback(
    (tracker: Tracker, day: DateTime, index: number) => {
      return (
        <Cell
          tracker={tracker}
          trackerEvents={processTrackerEvents(trackerEvents, {})}
          day={day}
        />
      );
    },
    [trackerEvents]
  );

  const renderTitle = React.useCallback((tracker: Tracker) => {
    return <Title tracker={tracker} />;
  }, []);

  const columns = React.useMemo(() => {
    return generateColumns(dateSpecification, renderCell, renderTitle);
  }, [dateSpecification, renderCell, renderTitle]);

  return <Table columns={columns} data={trackers} />;
};

export default TrackersTable;
