import { Tracker } from "./trackers";
import { TrackerEvent } from "./trackerEvents";

export type PublicUser = {
  login: string;
  public?: {
    is_public_page_enabled?: boolean;
    title?: string;
    is_api_enabled?: boolean;
  };
};

export type GetPublicUserResponse = {
  user: PublicUser;
  trackers: Tracker[];
  tracker_events: TrackerEvent[];
};
