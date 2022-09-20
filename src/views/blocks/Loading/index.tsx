import React from "react";
import Spinner from "../Spinner";
import "./Loading.scss";

export default function Loading() {
  return (
    <div className="loading">
      <Spinner isActive={true} />
    </div>
  );
}
