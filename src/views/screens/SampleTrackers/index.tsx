import React, { ChangeEvent } from "react";

import { Redirect, useHistory } from "react-router";
import { useAppSelector } from "../../../hooks/store";
import { currentUser } from "../../../store/users";
import { useGetSampleTrackersQuery } from "../../../services";
import { SampleTracker } from "../../../types/sampleTrackers";

import ControlBar from "../../blocks/ControlBar";
import { TitleEntry } from "../../blocks/Entries";
import Footer from "../../blocks/Footer";
import { TextInput } from "../../blocks/StyledControls";

import "./SampleTrackers.scss";
import { trackersData } from "../../../store/trackers";

interface SampleTrackerSuggestionProps {
  sampleTracker: SampleTracker;
  isHighlighted?: boolean;
  isCustom?: boolean;
  onTrackerChoose: (data: any) => any;
}

function SampleTrackerSuggestion({
  sampleTracker,
  isHighlighted,
  isCustom,
  onTrackerChoose,
}: SampleTrackerSuggestionProps) {
  const className =
    "suggestion" + (isHighlighted ? " suggestion--highlighted" : "");

  return (
    <li
      className={className}
      onClick={() => {
        onTrackerChoose({
          ...sampleTracker.data,
          title: isCustom ? "" : sampleTracker.title,
        });
      }}
    >
      <h3 className="suggestion__title">
        {sampleTracker.emoji} {sampleTracker.title}
      </h3>
      <div className="suggestion__description">{sampleTracker.description}</div>
    </li>
  );
}

export default function SampleTrackers() {
  const { push } = useHistory();
  const trackers = useAppSelector(trackersData);
  const user = useAppSelector(currentUser);
  const [skipLoading, setSkipLoading] = React.useState<boolean>(false);
  const [tag, setTag] = React.useState<string>("");
  const tagRef = React.useRef<HTMLInputElement | null>(null);

  const changeHandler = React.useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTag(e.target.value);
      setSkipLoading(true);
      setTimeout(() => setSkipLoading(false), 500);
    },
    [setTag]
  );

  const { data } = useGetSampleTrackersQuery(
    { tag: tag },
    {
      skip: !user || skipLoading,
    }
  );

  const onTrackerChoose = React.useCallback(
    (data: any) => {
      push({ pathname: "/trackers/new", state: data });
    },
    [push]
  );

  React.useEffect(() => {
    setTimeout(() => tagRef?.current?.focus(), 50);
  }, []);

  if (!user) {
    return <Redirect to="/" push={false} />;
  }

  return (
    <div className="sample-trackers">
      <ControlBar
        page="sample-trackers"
        breadcrumbsPages={[{ id: "home", title: "Home", link: "/" }]}
      />
      <div className="sample-trackers__content">
        <div className="sample-trackers__block-add">
          <TitleEntry
            title={
              trackers.length > 0
                ? "What do you want to track?"
                : "Let's create your first tracker!"
            }
          />

          <div className="sample-trackers__input">
            <TextInput
              inputRef={tagRef}
              htmlId="name"
              defaultValue={tag}
              placeholder="try 'coffee', 'gym' or 'learn'"
              onChange={changeHandler}
            />
          </div>
        </div>

        <ul className="sample-trackers__block-suggestions">
          {data?.sample_trackers.map((t) => {
            return (
              <SampleTrackerSuggestion
                key={"sample-tracker_" + t.id}
                sampleTracker={t}
                onTrackerChoose={onTrackerChoose}
              />
            );
          })}
          <SampleTrackerSuggestion
            sampleTracker={{
              id: "",
              title: "Create your own tracker",
              description:
                "Choose this option to create a tracker from scratch",
            }}
            isHighlighted={true}
            isCustom={true}
            onTrackerChoose={onTrackerChoose}
          />
        </ul>
      </div>

      <Footer />
    </div>
  );
}
