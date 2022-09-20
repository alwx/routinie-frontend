import React from "react";
import { useAppSelector } from "../../../hooks/store";
import { currentUser } from "../../../store/users";

import ControlBar from "../../blocks/ControlBar";
import Index from "../../blocks/Index";
import TrackersTable from "./TrackersTable";

import "./Home.scss";
import Footer from "../../blocks/Footer";

export default function Home() {
  const user = useAppSelector(currentUser);

  return (
    <div className="home">
      <ControlBar page="home" isHidden={!user} />

      <div className={"home__content" + (user ? " home__content--padded" : "")}>
        {user ? <TrackersTable user={user} /> : <Index />}
      </div>

      <Footer isNarrow={!user} />
    </div>
  );
}