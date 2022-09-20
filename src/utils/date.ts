import { DateTime } from "luxon";
import { TrackerEvent } from "../types/trackerEvents";

// `MAX_DATES_TO_SHOW` indicates how many date columns can be visible on the screen
// and how big is the since-until window for GET /tracker_events
export const MAX_DATES_TO_SHOW = 10;

export const getCurrentLocalDate = () => {
  return DateTime.local().startOf("day");
};

export const getCurrentLocalDateOffsetInSeconds = () => {
  return getCurrentLocalDate().offset * 60;
};

export const getCurrentDateInUTC = () => {
  return DateTime.local({ zone: "utc" }).startOf("day");
};

export const daysAgo = (date: DateTime) => {
  const diff = getCurrentLocalDate().diff(date, "days");
  return diff.days;
};

export const trackerEventAssignedTo = (day: DateTime) => {
  return `${day.toISODate()}T00:00:00.000+00:00`;
};

export const isEU = () => {
  const tz = getCurrentLocalDate().zoneName;
  switch (tz) {
    case 'Europe/Vienna':
      return true;
    case 'Europe/Brussels':
      return true;
    case 'Europe/Sofia':
      return true;
    case 'Europe/Zagreb':
      return true;
    case 'Asia/Famagusta':
      return true;
    case 'Asia/Nicosia':
      return true;
    case 'Europe/Prague':
      return true;
    case 'Europe/Copenhagen':
      return true;
    case 'Europe/Tallinn':
      return true;
    case 'Europe/Helsinki':
      return true;
    case 'Europe/Paris':
      return true;
    case 'Europe/Berlin':
      return true;
    case 'Europe/Busingen':
      return true;
    case 'Europe/Athens':
      return true;
    case 'Europe/Budapest':
      return true;
    case 'Europe/Dublin':
      return true;
    case 'Europe/Rome':
      return true;
    case 'Europe/Riga':
      return true;
    case 'Europe/Vilnius':
      return true;
    case 'Europe/Luxembourg':
      return true;
    case 'Europe/Malta':
      return true;
    case 'Europe/Amsterdam':
      return true;
    case 'Europe/Warsaw':
      return true;
    case 'Atlantic/Azores':
      return true;
    case 'Atlantic/Madeira':
      return true;
    case 'Europe/Lisbon':
      return true;
    case 'Europe/Bucharest':
      return true;
    case 'Europe/Bratislava':
      return true;
    case 'Europe/Ljubljana':
      return true;
    case 'Africa/Ceuta':
      return true;
    case 'Atlantic/Canary':
      return true;
    case 'Europe/Madrid':
      return true;
    case 'Europe/Stockholm':
      return true;
    default:
      return false;
  }
}

export const diffBetweenNowAndTrackerEventCreatedAt = (
  trackerEvent: TrackerEvent,
  now?: DateTime
) => {
  return Math.round(
    (now || DateTime.now()).diff(
      DateTime.fromISO(trackerEvent.created_at),
      "seconds"
    ).seconds
  );
};

export const toHHMMSS = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds - h * 3600) / 60);
  const s = seconds - h * 3600 - m * 60;

  const h_str = h < 10 ? "0" + h : h;
  const m_str = m < 10 ? "0" + m : m;
  const s_str = s < 10 ? "0" + s : s;

  if (h < 1) {
    return m_str + ":" + s_str;
  } else {
    return h_str + ":" + m_str + ":" + s_str;
  }
};

export class DateSpecification {
  userCreatedDate: DateTime;
  daysFitIntoTable: number;
  scrollTo: DateTime;

  constructor(
    userCreatedData: DateTime,
    daysFitIntoTable: number,
    scrollTo: DateTime
  ) {
    this.userCreatedDate = userCreatedData;
    this.daysFitIntoTable = daysFitIntoTable;
    this.scrollTo = scrollTo;
  }

  get firstDateForUser(): DateTime {
    const minDate = getCurrentLocalDate().minus({
      days: MAX_DATES_TO_SHOW - 1,
    });
    return this.userCreatedDate < minDate ? this.userCreatedDate : minDate;
  }

  get daysBetweenFirstDayAndToday(): number {
    return getCurrentLocalDate().diff(this.firstDateForUser, "days").days + 1;
  }

  get dayToStart(): DateTime {
    const today = getCurrentLocalDate();

    if (
      this.daysBetweenFirstDayAndToday <= this.daysFitIntoTable ||
      this.scrollTo < this.firstDateForUser
    ) {
      return this.firstDateForUser;
    }
    const daysBetweenScrollToAndToday =
      today.diff(this.scrollTo, "days").days + 1;
    if (daysBetweenScrollToAndToday <= this.daysFitIntoTable) {
      return today.minus({ days: this.daysFitIntoTable - 1 });
    }
    return this.scrollTo;
  }

  get daysToShow(): number {
    return Math.min(this.daysBetweenFirstDayAndToday, this.daysFitIntoTable);
  }
}
