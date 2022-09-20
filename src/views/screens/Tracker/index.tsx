import React from "react";
import { Redirect, useHistory } from "react-router";
import { useLocation, useRouteMatch } from "react-router-dom";

import { useContextMenuHelpers } from "../../../hooks/contextMenu";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
  useGetTrackerQuery,
  usePostTrackerMutation,
  usePatchTrackerMutation,
  useDeleteTrackerMutation,
} from "../../../services";
import {
  trackersData,
  addTrackers,
  removeTrackerById,
} from "../../../store/trackers";
import {
  defaultNewTracker,
  NewTracker,
  TrackerResponse,
  TrackerType,
} from "../../../types/trackers";
import { TrackerUtils } from "../../../utils/trackers";

import ControlBar from "../../blocks/ControlBar";
import { TitleEntry } from "../../blocks/Entries";
import ExpandableContainer from "../../blocks/ExpandableContainer";
import Footer from "../../blocks/Footer";
import {
  Button,
  Checkbox,
  ColorPicker,
  Radio,
  TextInput,
} from "../../blocks/StyledControls";

import "./Tracker.scss";
import {
  closeContextMenu,
  updateContextMenu,
} from "../../../store/contextMenu";
import {
  ContextMenuPositionType,
  ContextMenuType,
} from "../../../types/contextMenu";

export interface SampleTrackersMatchParams {
  id?: string;
}

export default function Tracker() {
  const { state } = useLocation();
  const { params } = useRouteMatch<SampleTrackersMatchParams>();
  const { push } = useHistory();
  const dispatch = useAppDispatch();

  const trackers = useAppSelector(trackersData);
  const [postTracker] = usePostTrackerMutation();
  const [patchTracker] = usePatchTrackerMutation();
  const [deleteTracker] = useDeleteTrackerMutation();
  const { showNetworkError } = useContextMenuHelpers();

  const titleRef = React.useRef<HTMLInputElement | null>(null);
  const defaultValueRef = React.useRef<HTMLInputElement | null>(null);
  const defaultChangeRef = React.useRef<HTMLInputElement | null>(null);
  const goalValueRef = React.useRef<HTMLInputElement | null>(null);
  const isInfiniteValueRef = React.useRef<HTMLInputElement | null>(null);
  const isPublicValueRef = React.useRef<HTMLInputElement | null>(null);

  const suppliedTracker = {
    ...defaultNewTracker,
    ...(state && typeof state === "object" ? state : {}),
  };
  const initialTrackerState = {
    ...suppliedTracker,
    goal_value:
      suppliedTracker.goal_value /
      (suppliedTracker.type === TrackerType.TIMER ? 60 : 1),
  };
  const [tracker, setTracker] = React.useState<NewTracker>(initialTrackerState);
  const [isSampleTrackerUsed, setIsSampleTrackerUsed] = React.useState<boolean>(
    initialTrackerState.title !== ""
  );

  const editingID = params.id;
  const { data, isLoading, isError } = useGetTrackerQuery(
    {
      id: editingID || "",
    },
    { skip: !editingID, refetchOnMountOrArgChange: true }
  );

  React.useEffect(() => {
    if (data?.tracker) {
      setIsSampleTrackerUsed(data.tracker.title !== "");
      const tracker = data.tracker;
      if (tracker.type === TrackerType.TIMER) {
        setTracker({ ...tracker, goal_value: tracker.goal_value / 60 });
      } else {
        setTracker(tracker);
      }
    }
  }, [data?.tracker, setTracker]);

  React.useEffect(() => {
    setTimeout(() => titleRef?.current?.focus(), 50);
  }, []);

  const createTracker = React.useCallback(() => {
    const lastTrackerRank =
      trackers && trackers.length > 0
        ? trackers[trackers.length - 1].rank
        : defaultNewTracker.rank;

    const newTracker: NewTracker = {
      ...tracker,
      rank: TrackerUtils.generateRank(lastTrackerRank, ""),
      goal_value:
        tracker.type === TrackerType.TIMER
          ? tracker.goal_value * 60
          : tracker.goal_value,
    };

    postTracker(newTracker)
      .unwrap()
      .then((response: TrackerResponse) => {
        dispatch(addTrackers([response.tracker]));
        push("/", false);
      })
      .catch((error) => {
        showNetworkError(error?.data?.message);
      });
  }, [trackers, tracker, postTracker, dispatch, push, showNetworkError]);

  const updateTracker = React.useCallback(() => {
    if (!editingID) {
      return;
    }
    const patchedTracker = {
      ...tracker,
      goal_value:
        tracker.goal_value * (tracker.type === TrackerType.TIMER ? 60 : 1),
    };
    patchTracker({ patchedTracker: patchedTracker, id: editingID?.toString() })
      .unwrap()
      .then((response: TrackerResponse) => {
        dispatch(addTrackers([response.tracker]));
        push("/", false);
      })
      .catch((error) => {
        showNetworkError(error?.data?.message);
      });
  }, [tracker, editingID, patchTracker, dispatch, push, showNetworkError]);

  const removeTracker = React.useCallback(() => {
    if (!editingID) {
      return;
    }
    deleteTracker({ id: editingID?.toString() })
      .unwrap()
      .then((response: TrackerResponse) => {
        dispatch(removeTrackerById(editingID.toString()));
        push("/", false);
      })
      .catch((error) => {
        showNetworkError(error?.data?.message);
      });
  }, [editingID, deleteTracker, dispatch, push, showNetworkError]);

  const promptToRemoveTracker = React.useCallback(() => {
    dispatch(
      updateContextMenu({
        position: {
          type: ContextMenuPositionType.CENTER,
        },
        options: [
          {
            type: ContextMenuType.PROMPT,
            data: {
              title: "Are you sure?",
              text:
                "In fact, we don't delete trackers but archive them instead. " +
                "But we currently don't offer an option to see the list of " +
                "archived trackers which means you also won't be able to " +
                "check them again or restore (at least for a while).",
              buttons: [
                {
                  text: "Yes, delete",
                  action: () => {
                    removeTracker();
                    dispatch(closeContextMenu());
                  },
                },
                {
                  text: "No",
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
  }, [dispatch, removeTracker]);

  if (isError) {
    return <Redirect to="/" push={false} />;
  }

  return (
    <div className="tracker">
      <ControlBar
        page="tracker"
        breadcrumbsPages={[
          { id: "home", title: "Home", link: "/" },
          editingID
            ? null
            : {
                id: "sample-trackers",
                title: "New tracker",
                link: "/trackers",
              },
        ]}
      />

      <div className="tracker__content">
        <div className="tracker__details">
          <TitleEntry
            title={
              editingID
                ? "Let's update the details"
                : "Let's specify the details"
            }
          />

          <div className="tracker__columns">
            <div className="tracker__column-basic">
              <div className="expandable-container__form">
                <TextInput
                  inputRef={titleRef}
                  htmlId="name"
                  label="Name:"
                  defaultValue={tracker.title}
                  isDisabled={isLoading}
                  onChange={(e) => {
                    setTracker({ ...tracker, title: e.target.value });
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setTimeout(() => defaultValueRef?.current?.focus(), 50);
                    }
                  }}
                />

                <ColorPicker
                  htmlId="color"
                  label="Color"
                  isDisabled={isLoading}
                  defaultValue={tracker.color}
                  onChange={(color: string) => {
                    setTracker({ ...tracker, color: color });
                  }}
                />

                <Checkbox
                  inputRef={isPublicValueRef}
                  htmlId="is_public"
                  label={
                    <div className="two-line-label">
                      <div className="two-line-label__title">
                        Make it public
                      </div>
                      <div className="two-line-label__text">
                        Show this tracker on your public page and return with
                        API (if enabled)
                      </div>
                    </div>
                  }
                  defaultValue={tracker.is_public}
                  isDisabled={isLoading}
                  onChange={(e) => {
                    setTracker({
                      ...tracker,
                      is_public: !tracker.is_public,
                    });
                  }}
                />
              </div>
            </div>

            <div className="tracker__column-additional">
              <ExpandableContainer
                title="Additional options"
                isExpandedByDefault={!isSampleTrackerUsed || Boolean(editingID)}
              >
                <div className="expandable-container__form">
                  <Radio
                    inputRef={isInfiniteValueRef}
                    htmlId="type"
                    values={[
                      { key: TrackerType.DAILY, label: "Counter" },
                      { key: TrackerType.TIMER, label: "Timer" },
                    ]}
                    defaultValue={tracker.type}
                    isDisabled={isLoading || Boolean(editingID)}
                    onChange={(v) => {
                      setTracker({
                        ...tracker,
                        type: v,
                        default_value:
                          v === TrackerType.TIMER ? 0 : tracker.default_value,
                        default_change:
                          v === TrackerType.TIMER ? 1 : tracker.default_change,
                      });
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                  />

                  {tracker.type !== TrackerType.TIMER && (
                    <TextInput
                      inputRef={defaultValueRef}
                      htmlId="default_value"
                      label="Default value:"
                      type="number"
                      defaultValue={tracker.default_value.toString()}
                      isDisabled={isLoading}
                      onChange={(e) => {
                        setTracker({
                          ...tracker,
                          default_value: parseInt(e.target.value),
                        });
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setTimeout(
                            () => defaultChangeRef?.current?.focus(),
                            50
                          );
                        }
                      }}
                    />
                  )}

                  {tracker.type !== TrackerType.TIMER && (
                    <TextInput
                      inputRef={defaultChangeRef}
                      htmlId="default_change"
                      label="Step:"
                      type="number"
                      defaultValue={tracker.default_change.toString()}
                      isDisabled={isLoading}
                      onChange={(e) => {
                        setTracker({
                          ...tracker,
                          default_change: parseInt(e.target.value),
                        });
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setTimeout(() => goalValueRef?.current?.focus(), 50);
                        }
                      }}
                    />
                  )}

                  <TextInput
                    inputRef={goalValueRef}
                    htmlId="goal_value"
                    label={
                      tracker.type === TrackerType.TIMER
                        ? "Goal value (in minutes):"
                        : "Goal value:"
                    }
                    type="number"
                    defaultValue={tracker.goal_value.toString()}
                    isDisabled={isLoading}
                    onChange={(e) => {
                      setTracker({
                        ...tracker,
                        goal_value: parseInt(e.target.value),
                      });
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setTimeout(
                          () => isInfiniteValueRef?.current?.focus(),
                          50
                        );
                      }
                    }}
                  />

                  {tracker.type !== TrackerType.TIMER && (
                    <Checkbox
                      inputRef={isInfiniteValueRef}
                      htmlId="is_infinite"
                      label="Infinite tracker"
                      defaultValue={tracker.is_infinite}
                      isDisabled={isLoading}
                      onChange={(e) => {
                        setTracker({
                          ...tracker,
                          is_infinite: !tracker.is_infinite,
                        });
                      }}
                    />
                  )}
                </div>
              </ExpandableContainer>
            </div>

            <div className="tracker__buttons">
              <div className="tracker__buttons-left">
                <Button
                  isDisabled={isLoading}
                  onClick={() => {
                    if (editingID) {
                      updateTracker();
                    } else {
                      createTracker();
                    }
                  }}
                >
                  {editingID ? "Update" : "Add tracker"}
                </Button>

                <Button
                  onClick={() => {
                    push("/", false);
                  }}
                >
                  Cancel
                </Button>
              </div>

              {editingID && (
                <Button
                  isDisabled={isLoading}
                  onClick={() => {
                    promptToRemoveTracker();
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
