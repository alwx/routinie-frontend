import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

export interface Props {
  isNarrow?: boolean;
}

export default function Footer({ isNarrow }: Props) {
  return (
    <div className={"footer" + (isNarrow ? " footer--narrow" : "")}>
      <ul className="footer__ul">
        <li className="footer__li">
          &copy; 2022 Routinie by{" "}
          <a href="https://alwxdev.com" rel="noreferrer" target="_blank">
            alwxdev
          </a>
        </li>
        <li className="footer__li">
          <Link to="/terms-of-use">Terms of Use</Link>
        </li>
        <li className="footer__li">
          <Link to="/privacy-policy">Privacy Policy</Link>
        </li>
      </ul>
    </div>
  );
}
