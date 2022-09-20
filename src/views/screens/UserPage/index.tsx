import React from "react";
import { Redirect } from "react-router";
import { Link, useRouteMatch } from "react-router-dom";

import { useAppSelector } from "../../../hooks/store";
import { currentUser } from "../../../store/users";
import { useGetPublicUserQuery } from "../../../services";
import { PublicUser } from "../../../types/publicUsers";
import { TrackerEvent } from "../../../types/trackerEvents";
import { Tracker } from "../../../types/trackers";
import { User } from "../../../types/users";

import TrackersTable from "./TrackersTable";
import ControlBar from "../../blocks/ControlBar";
import Spinner from "../../blocks/Spinner";

import "./UserPage.scss";

type UserPageProps = {
  currentUser?: User;
  user: PublicUser;
  trackers: Tracker[];
  tracker_events: TrackerEvent[];
};

function UserPageContent({
  currentUser,
  user,
  trackers,
  tracker_events,
}: UserPageProps) {
  return (
    <div className="user-page__content">
      <div className="user-page__header">
        <div className="user-page__header-content">
          <h1 className="user-page__title">
            {user.public?.title || `@${user.login} tracks in public.`}
          </h1>

          {!currentUser && (
            <div className="user-page__subtitle">
              <Link to={"/"}>Get your Routinie page</Link> to track your habits!
            </div>
          )}
        </div>
      </div>

      <div className="user-page__trackers">
        <TrackersTable trackers={trackers} trackerEvents={tracker_events} />
      </div>
    </div>
  );
}

export interface UserPageParams {
  name: string;
}

export default function UserPage() {
  const user = useAppSelector(currentUser);

  const { params } = useRouteMatch<UserPageParams>();

  const { data, isLoading, isError } = useGetPublicUserQuery(
    { name: params.name },
    { skip: false }
  );

  if (isError || (data?.user && !data.user?.public?.is_public_page_enabled)) {
    return <Redirect to="/" push={false} />;
  }

  return (
    <div className="user-page">
      <ControlBar
        page="user-page"
        breadcrumbsPages={[
          { id: "home", title: user ? "Home" : "Routinie", link: "/" },
        ]}
        isHidden={!user}
      />

      {isLoading && (
        <div className="user-page__loading">
          <Spinner isActive={true} />
        </div>
      )}

      {data && (
        <UserPageContent
          currentUser={user}
          user={data.user}
          trackers={data.trackers}
          tracker_events={data.tracker_events}
        />
      )}
    </div>
  );
}
