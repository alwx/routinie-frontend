import React, { ChangeEvent } from "react";
import { TimeoutId } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/types";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";

import ControlBar from "../../blocks/ControlBar";
import { TitleEntry } from "../../blocks/Entries";
import ExpandableContainer from "../../blocks/ExpandableContainer";
import Footer from "../../blocks/Footer";
import { Checkbox, TextInput } from "../../blocks/StyledControls";
import { currentUser } from "../../../store/users";

import "./Public.scss";
import {
  closeContextMenu,
  updateContextMenu,
} from "../../../store/contextMenu";
import { usePatchUserMutation } from "../../../services";
import { UserPublic } from "../../../types/users";
import {
  ContextMenuPositionType,
  ContextMenuType,
} from "../../../types/contextMenu";

export interface SampleTrackersMatchParams {
  id?: string;
}

export default function Public() {
  const dispatch = useAppDispatch();

  const [patchUser] = usePatchUserMutation();
  const user = useAppSelector(currentUser);

  const isPublicPageEnabledRef = React.useRef<HTMLInputElement | null>(null);
  const titleRef = React.useRef<HTMLInputElement | null>(null);
  const isAPIEnabledRef = React.useRef<HTMLInputElement | null>(null);

  const [isPublicPageEnabled, setIsPublicPageEnabled] = React.useState<boolean>(
    user?.public?.is_public_page_enabled || false
  );
  const [isAPIEnabled, setIsAPIEnabled] = React.useState<boolean>(
    user?.public?.is_api_enabled || false
  );

  const [title, setTitle] = React.useState<string>(user?.public?.title || "");
  const [titleChangeTimeout, setTitleChangeTimeout] =
    React.useState<TimeoutId | null>(null);

  const patchUserPublic = React.useCallback(
    (userPublic: UserPublic) => {
      patchUser({ public: userPublic })
        .unwrap()
        .then((_) => {})
        .catch((error) => {
          dispatch(
            updateContextMenu({
              data: { stateMessage: error?.data?.message },
            })
          );
        });
    },
    [dispatch, patchUser]
  );

  const titleChangeHandler = React.useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!user) {
        return;
      }
      setTitle(e.target.value);
      if (titleChangeTimeout) {
        clearTimeout(titleChangeTimeout);
      }
      setTitleChangeTimeout(
        setTimeout(() => {
          patchUserPublic({
            ...user.public,
            title: e.target.value,
          });
        }, 500)
      );
    },
    [setTitle, titleChangeTimeout, setTitleChangeTimeout, user, patchUserPublic]
  );

  const showAPINeedsToBeEnabled = React.useCallback(
    ({ onEnable }: { onEnable: () => any }) => {
      dispatch(
        updateContextMenu({
          isBlockingView: false,
          position: {
            type: ContextMenuPositionType.CENTER,
          },
          options: [
            {
              type: ContextMenuType.PROMPT,
              data: {
                title: "API needs to be enabled",
                text:
                  "Public page uses the API to extract the data, which means the API needs to " +
                  "be enabled to make your page accessible. Would you like to enable it?",
                buttons: [
                  {
                    text: "Yes, enable",
                    action: () => {
                      onEnable();
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
    },
    [dispatch]
  );

  const showPublicPageWillBeDisabled = React.useCallback(
    ({ onDisable }: { onDisable: () => any }) => {
      dispatch(
        updateContextMenu({
          isBlockingView: false,
          position: {
            type: ContextMenuPositionType.CENTER,
          },
          options: [
            {
              type: ContextMenuType.PROMPT,
              data: {
                title: "Public page will also be disabled",
                text:
                  "Public page uses the API to extract the data, which means " +
                  "disabling the API will also disable the public page. Would you like to " +
                  "proceed?",
                buttons: [
                  {
                    text: "Yes, disable the page",
                    action: () => {
                      onDisable();
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
    },
    [dispatch]
  );

  if (!user) {
    return <Redirect to="/" push={false} />;
  }

  return (
    <div className="public">
      <ControlBar
        page="tracker"
        breadcrumbsPages={[{ id: "home", title: "Home", link: "/" }]}
      />

      <div className="public__content">
        <div className="public__details">
          <TitleEntry title="#trackinpublic" />

          <ExpandableContainer title="Public page" isExpandedByDefault={true}>
            <div className="expandable-container__form">
              <Checkbox
                inputRef={isPublicPageEnabledRef}
                htmlId="is_public_page_enabled"
                label="Enabled"
                defaultValue={isPublicPageEnabled}
                onChange={(e) => {
                  if (!isPublicPageEnabled && !isAPIEnabled) {
                    showAPINeedsToBeEnabled({
                      onEnable: () => {
                        setIsPublicPageEnabled(true);
                        setIsAPIEnabled(true);
                        patchUserPublic({
                          ...user.public,
                          is_public_page_enabled: true,
                          is_api_enabled: true,
                        });
                      },
                    });
                  } else {
                    setIsPublicPageEnabled(!isPublicPageEnabled);
                    patchUserPublic({
                      ...user.public,
                      is_public_page_enabled: !isPublicPageEnabled,
                    });
                  }
                }}
              />

              <TextInput
                inputRef={titleRef}
                htmlId="title"
                label="Page title:"
                placeholder={"@" + user.login + " tracks in public."}
                defaultValue={title}
                onChange={titleChangeHandler}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />

              <div className="public__info">
                {isPublicPageEnabled && (
                  <p>
                    Your public page is available as{" "}
                    <Link to={"/@" + user.login}>
                      https://routinie.com/@{user.login}
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </ExpandableContainer>

          <ExpandableContainer title="API (beta)" isExpandedByDefault={false}>
            <div className="expandable-container__form">
              <Checkbox
                inputRef={isAPIEnabledRef}
                htmlId="is_api_enabled"
                label="Enabled"
                defaultValue={isAPIEnabled}
                onChange={(e) => {
                  if (isAPIEnabled && isPublicPageEnabled) {
                    showPublicPageWillBeDisabled({
                      onDisable: () => {
                        setIsPublicPageEnabled(false);
                        setIsAPIEnabled(false);
                        patchUserPublic({
                          ...user.public,
                          is_public_page_enabled: false,
                          is_api_enabled: false,
                        });
                      },
                    });
                  } else {
                    setIsAPIEnabled(!isAPIEnabled);
                    patchUserPublic({
                      ...user.public,
                      is_api_enabled: !isAPIEnabled,
                    });
                  }
                }}
              />

              <div className="public__info">
                {isAPIEnabled && (
                  <>
                    <p>
                      The currently available API methods:
                    </p>
                    <ul>
                      <li><code>GET https://go.routinie.com/api/users/{user.login}</code></li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </ExpandableContainer>

          <ExpandableContainer
            title="Twitter integration"
            isExpandedByDefault={false}
          >
            <div className="expandable-container__form">
              <div className="public__tab-content">
                Twitter integration will be available for{" "}
                <Link to="/premium">Premium</Link> customers later in January.
              </div>
            </div>
          </ExpandableContainer>
        </div>
      </div>

      <Footer />
    </div>
  );
}
