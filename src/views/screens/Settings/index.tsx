import React from "react";
import { useHistory, Redirect } from "react-router";
import { useContextMenuHelpers } from "../../../hooks/contextMenu";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { usePatchUserMutation } from "../../../services";
import { currentUser } from "../../../store/users";
import {
  closeContextMenu,
  updateContextMenu,
} from "../../../store/contextMenu";
import {
  ContextMenuPositionType,
  ContextMenuType,
} from "../../../types/contextMenu";

import ControlBar from "../../blocks/ControlBar";
import Footer from "../../blocks/Footer";
import {
  ClickableEntry,
  SeparatorEntry,
  TitleEntry,
} from "../../blocks/Entries";

import "./Settings.scss";
import { DateTime } from "luxon";

const STRIPE_URL =
  process.env.REACT_APP_STRIPE_URL || "http://localhost:3001/stripe";

export default function Settings() {
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const { showConfirmation } = useContextMenuHelpers();

  const [patchUser] = usePatchUserMutation();
  const user = useAppSelector(currentUser);

  const manageSubscriptionFormRef = React.useRef<HTMLFormElement | null>(null);

  const onChangePasswordClick = React.useCallback(() => {
    dispatch(
      updateContextMenu({
        position: {
          type: ContextMenuPositionType.CENTER,
        },
        isBlockingView: true,
        options: [
          {
            type: ContextMenuType.CHANGE_PASSWORD,
            data: {
              action: (password: string, newPassword: string) => {
                patchUser({ old_password: password, password: newPassword })
                  .unwrap()
                  .then((_) => {
                    showConfirmation(
                      "Done! ✨",
                      "Your password has been updated."
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
              cancelAction: () => {
                dispatch(closeContextMenu());
              },
            },
          },
        ],
      })
    );
  }, [dispatch, patchUser, showConfirmation]);

  const onChangeEmailClick = React.useCallback(() => {
    dispatch(
      updateContextMenu({
        position: {
          type: ContextMenuPositionType.CENTER,
        },
        isBlockingView: true,
        options: [
          {
            type: ContextMenuType.CHANGE_TEXT_FIELD,
            data: {
              title: "Change e-mail",
              fieldLabel: "New e-mail:",
              action: (email: string) => {
                patchUser({ email: email })
                  .unwrap()
                  .then((_) => {
                    showConfirmation(
                      "Done! ✨",
                      "Your e-mail address has been updated."
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
              cancelAction: () => {
                dispatch(closeContextMenu());
              },
            },
          },
        ],
      })
    );
  }, [dispatch, patchUser, showConfirmation]);

  const onChangeLoginClick = React.useCallback(() => {
    dispatch(
      updateContextMenu({
        position: {
          type: ContextMenuPositionType.CENTER,
        },
        isBlockingView: true,
        options: [
          {
            type: ContextMenuType.CHANGE_TEXT_FIELD,
            data: {
              title: "Change nickname",
              fieldLabel: "New nickname:",
              action: (login: string) => {
                patchUser({ login: login })
                  .unwrap()
                  .then((_) => {
                    showConfirmation(
                      "Done! ✨",
                      "Your nickname has been updated."
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
              cancelAction: () => {
                dispatch(closeContextMenu());
              },
            },
          },
        ],
      })
    );
  }, [dispatch, patchUser, showConfirmation]);

  if (!user) {
    return <Redirect to="/" push={false} />;
  }

  return (
    <div className="settings">
      <ControlBar
        page="settings"
        breadcrumbsPages={[{ id: "home", title: "Home", link: "/" }]}
      />

      <div className="settings__content">
        <ul className="settings__list">
          <TitleEntry title="Settings" />

          <ClickableEntry
            title="Your e-mail"
            description={user.email}
            links={[
              {
                key: "update",
                title: "Update",
                onClick: onChangeEmailClick,
              },
            ]}
          />

          <ClickableEntry
            title="Your nickname"
            description={user.login}
            links={[
              {
                key: "update",
                title: "Update",
                onClick: onChangeLoginClick,
              },
            ]}
          />

          <ClickableEntry
            title="Your password"
            description="•••••••••"
            links={[
              {
                key: "upgrade",
                title: "Update",
                onClick: onChangePasswordClick,
              },
            ]}
          />

          <SeparatorEntry />

          {!user.subscribed_at && (
            <ClickableEntry
              title="Membership"
              description="You're using Routinie Free — with the limited number of habits to track and without some nice bonuses."
              links={[
                {
                  key: "upgrade",
                  title: "Read more & upgrade",
                  onClick: () => push("/premium", false),
                },
              ]}
            />
          )}

          {user.subscribed_at && (
            <ClickableEntry
              title="Membership"
              description={
                "You've upgraded to Premium " +
                DateTime.fromISO(user.subscribed_at).toRelativeCalendar() +
                ". Thanks for supporting us!"
              }
              links={[
                {
                  key: "manage_subscription",
                  title: "Manage subscription",
                  onClick: () => {
                    manageSubscriptionFormRef.current?.submit();
                  },
                },
              ]}
            />
          )}
        </ul>
      </div>

      <form
        ref={manageSubscriptionFormRef}
        action={STRIPE_URL + `/create-portal-session`}
        method="POST"
        style={{ display: "none" }}
      >
        <input type="hidden" name="sessionId" value={user.stripe_session_id} />
        <button type="submit">Manage subscription</button>
      </form>

      <Footer />
    </div>
  );
}
