export type SampleTracker = {
  id: string;
  title: string;
  description: string;
  emoji?: string;
  tags?: string[];
  data?: any;
};

export type SampleTrackerResponse = {
  sample_trackers: SampleTracker[];
};
