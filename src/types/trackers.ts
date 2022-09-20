export enum TrackerType {
  DAILY = "daily",
  TIMER = "timer",
}

export type Tracker = {
  id: string;
  title: string;
  type: string;
  color: string;
  default_value: number;
  goal_value: number;
  measurement?: string;
  default_change: number;
  rank: string;
  is_infinite: boolean;
  is_public: boolean;
  max_streak: number;
  current_streak: number;
};

export type NewTracker = {
  title: string;
  type: string;
  color: string;
  default_value: number;
  goal_value: number;
  measurement?: string;
  default_change: number;
  rank: string;
  is_infinite: boolean;
  is_public: boolean;
};

export type PatchedTracker = {
  title?: string;
  type?: string;
  color?: string;
  default_value?: number;
  goal_value?: number;
  measurement?: string;
  default_change?: number;
  rank?: string;
  is_infinite?: boolean;
  is_public?: boolean;
};

export type TrackerResponse = {
  tracker: Tracker;
};

export const defaultNewTracker: NewTracker = {
  title: "",
  type: "daily",
  color: "rgba(0, 208, 132, 1)",
  default_value: 0,
  goal_value: 1,
  default_change: 1,
  rank: "a",
  is_infinite: false,
  is_public: true,
};
