import React, { Fragment } from "react";
import { MAX_DATES_TO_SHOW, getCurrentDateInUTC } from "../utils/date";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/store";
import { useGetTrackerEventsQuery, useGetUserQuery } from "../services";
import { setWindowSize } from "../store/app";
import { currentUser } from "../store/users";

import ContextMenu from "./blocks/ContextMenu";
import Loading from "./blocks/Loading";
import { PrivacyPolicy, TermsOfUse } from "./screens/ContentPage";
import Home from "./screens/Home";
import Premium from "./screens/Premium";
import Settings from "./screens/Settings";
import SampleTrackers from "./screens/SampleTrackers";
import Public from "./screens/Public";
import Tracker from "./screens/Tracker";
import UserPage from "./screens/UserPage";

import "./App.scss";

const ScrollToTop = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
};

export default function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(currentUser);

  const { isLoading: isGetUserQueryInProgess } = useGetUserQuery(null, {
    skip: !user,
    refetchOnMountOrArgChange: true,
  });
  const { isLoading: isTrackerEventsQueryInProgress } =
    useGetTrackerEventsQuery(
      {
        since: getCurrentDateInUTC()
          .minus({ days: MAX_DATES_TO_SHOW * 2 })
          .toSeconds(),
        until: getCurrentDateInUTC().toSeconds(),
      },
      { skip: !user, refetchOnMountOrArgChange: true }
    );

  React.useEffect(() => {
    function handleResize() {
      dispatch(
        setWindowSize({
          height: window.innerHeight,
          width: window.innerWidth,
        })
      );
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  if (isGetUserQueryInProgess || isTrackerEventsQueryInProgress) {
    return <Loading />;
  }

  return (
    <Fragment>
      <Router>
        <ScrollToTop>
          <main>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/settings" component={Settings} />
              <Route exact path="/trackers" component={SampleTrackers} />
              <Route exact path="/trackers/new" component={Tracker} />
              <Route exact path="/trackers/:id" component={Tracker} />
              <Route exact path="/public" component={Public} />
              <Route exact path="/premium" component={Premium} />
              <Route exact path="/terms-of-use" component={TermsOfUse} />
              <Route exact path="/privacy-policy" component={PrivacyPolicy} />
              <Route exact path="/@:name" component={UserPage} />

              <Route component={Home} />
            </Switch>
          </main>
        </ScrollToTop>
      </Router>
      <ContextMenu />
    </Fragment>
  );
}
