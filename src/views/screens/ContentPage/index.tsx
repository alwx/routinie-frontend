import React from "react";
import ControlBar from "../../blocks/ControlBar";
import Footer from "../../blocks/Footer";

import "./ContentPage.scss";
import { marked } from "marked";

export function TermsOfUse() {
  return (
    <div className="content-page">
      <ControlBar
        page="terms-of-use"
        breadcrumbsPages={[{ id: "home", title: "Home", link: "/" }]}
      />

      <div className="content-page__content">
        <div
          className="content-page__text"
          dangerouslySetInnerHTML={{
            __html: marked(
              "# Terms Of Use.\n" +
                "**Left empty for the open source version.**"
            ),
          }}
        ></div>
      </div>
      <Footer isNarrow={false} />
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <div className="content-page">
      <ControlBar
        page="privacy-policy"
        breadcrumbsPages={[{ id: "home", title: "Home", link: "/" }]}
      />

      <div className="content-page__content">
        <div
          className="content-page__text"
          dangerouslySetInnerHTML={{
            __html: marked(
              "# Terms Of Use.\n" +
                "**Left empty for the open source version.**"
            ),
          }}
        ></div>
      </div>
      <Footer isNarrow={false} />
    </div>
  );
}
