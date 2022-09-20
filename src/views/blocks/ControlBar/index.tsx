import React from "react";
import { useHistory } from "react-router";
import { useContextMenuHelpers } from "../../../hooks/contextMenu";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
  updateContextMenu,
  closeContextMenu,
} from "../../../store/contextMenu";
import { hasActiveQueries } from "../../../store/network";
import { currentUser, logUserOut } from "../../../store/users";
import { removeAllTrackers, trackersData } from "../../../store/trackers";
import { removeAllTrackerEvents } from "../../../store/trackerEvents";
import { usePatchUserMutation } from "../../../services";
import {
  ContextMenuPositionType,
  ContextMenuType,
  StateMessageType,
} from "../../../types/contextMenu";

import Breadcrumbs, { BreadcrumbsPage } from "../Breadcrumbs";
import Spinner from "../Spinner";

import { ReactComponent as IconSingleNeutral } from "../../../icons/navigation-menu.svg";
import { ReactComponent as IconAlertDiamond } from "../../../icons/alert-diamond.svg";

import "./ControlBar.scss";

export interface Props {
  page: string;
  children?: React.ReactNode;
  breadcrumbsPages?: (BreadcrumbsPage | null)[];
  isHidden?: boolean;
}

export default function ControlBar({
  page,
  children,
  breadcrumbsPages,
  isHidden,
}: Props) {
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const { showConfirmation, showPremiumBlocked } = useContextMenuHelpers();

  const user = useAppSelector(currentUser);
  const trackers = useAppSelector(trackersData);
  const hasActiveNetworkQueries = useAppSelector(hasActiveQueries);

  const [patchUser] = usePatchUserMutation();

  const hasExclamation = React.useMemo(() => {
    return user && (!user.email || !user.is_email_confirmed);
  }, [user]);

  const openEmailConfirmationContextMenu = React.useCallback(() => {
    dispatch(
      updateContextMenu({
        options: [
          {
            type: ContextMenuType.EMAIL_CONFIRMATION,
            data: {
              action: (code: string) => {
                patchUser({ email_confirmation_token: code })
                  .unwrap()
                  .then((_) => {
                    showConfirmation(
                      "Done! ✨",
                      "Your e-mail address has been verified. Thanks!"
                    );
                  })
                  .catch((error) => {
                    dispatch(
                      updateContextMenu({
                        data: { stateMessage: error?.data?.message },
                      })
                    );
                  });
              },
              resendAction: () => {
                patchUser({ email: user?.email })
                  .unwrap()
                  .then((_) => {
                    dispatch(
                      updateContextMenu({
                        data: {
                          stateMessage:
                            "We've just sent you an e-mail with the new confirmation code. " +
                            "Please, check your inbox!",
                          stateMessageType: StateMessageType.INFO,
                        },
                      })
                    );
                  })
                  .catch((error) => {
                    dispatch(
                      updateContextMenu({
                        data: { stateMessage: error?.data?.message },
                      })
                    );
                  });
              },
            },
          },
        ],
      })
    );
  }, [dispatch, patchUser, showConfirmation, user?.email]);

  const openLogOutPromptContextMenu = React.useCallback(() => {
    dispatch(
      updateContextMenu({
        options: [
          {
            type: ContextMenuType.PROMPT,
            data: {
              title: "Are you sure?",
              buttons: [
                {
                  text: "Yes, log me out",
                  action: () => {
                    dispatch(logUserOut());
                    dispatch(removeAllTrackers());
                    dispatch(removeAllTrackerEvents());
                    dispatch(closeContextMenu());
                    push("/", false);
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
  }, [dispatch, push]);

  const openUserMenu = React.useCallback(
    (e) => {
      const confirmEmail = {
        data: {
          label: "Confirm your email",
          icon: <IconAlertDiamond fill="rgb(200, 0, 0)" />,
          action: () => {
            openEmailConfirmationContextMenu();
          },
        },
      };
      const newTracker = {
        data: {
          label: "Add new tracker...",
          action: () => {
            if (user && !user.subscribed_at && trackers.length >= 3) {
              showPremiumBlocked(
                "Go Premium to be able to add more than 3 trackers!"
              );
              return;
            }
            push("/trackers", true);
            dispatch(closeContextMenu());
          },
        },
      };
      const settings = {
        data: {
          label: "Settings",
          action: () => {
            push("/settings", true);
            dispatch(closeContextMenu());
          },
        },
      };
      const premium = {
        data: {
          label: "Premium subscription",
          action: () => {
            push("/premium", true);
            dispatch(closeContextMenu());
          },
        },
      };
      const trackInPublic = {
        data: {
          label: "Public page & APIs",
          action: () => {
            push("/public", true);
            dispatch(closeContextMenu());
          },
        },
      };
      const endSession = {
        data: {
          label: "Log out",
          action: () => {
            openLogOutPromptContextMenu();
          },
        },
      };

      const options = [
        user?.email && !user.is_email_confirmed ? confirmEmail : null,
        newTracker,
        page !== "settings" ? settings : null,
        !user?.subscribed_at && page !== "premium" ? premium : null,
        trackInPublic,
        endSession,
      ];

      dispatch(
        updateContextMenu({
          position: {
            type: ContextMenuPositionType.USER_BUTTON,
          },
          options: options,
        })
      );
    },
    [
      dispatch,
      push,
      openEmailConfirmationContextMenu,
      openLogOutPromptContextMenu,
      page,
      user,
      showPremiumBlocked,
      trackers,
    ]
  );

  return (
    <div className="control-bar">
      <div id="control-bar__content" className="control-bar__content">
        <div className="control-bar__left">
          {!isHidden && (
            <button
              id="control-bar__user-button"
              disabled={hasActiveNetworkQueries || !user}
              className="control-bar__button control-bar__button--user control-bar-user"
              onClick={openUserMenu}
            >
              <span className="control-bar__menu-icon">
                <IconSingleNeutral />
              </span>
              {hasExclamation && (
                <span className="control-bar__exclamation-icon">
                  <IconAlertDiamond fill="rgb(200, 0, 0)" />
                </span>
              )}
            </button>
          )}
        </div>

        <Breadcrumbs pages={breadcrumbsPages} />

        <div className="control-bar__right">
          {children}
          <div className={"control-bar__spinner control-bar__spinner--alone"}>
            <Spinner isActive={hasActiveNetworkQueries} />
          </div>
        </div>
      </div>
    </div>
  );
}
