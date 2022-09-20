import React from "react";
import { useHistory } from "react-router";

import { useContextMenuHelpers } from "../../../hooks/contextMenu";
import { useAppDispatch } from "../../../hooks/store";
import {
  useCreateUserMutation,
  useLoginMutation,
  useRemindPasswordMutation,
  useSetPasswordMutation,
} from "../../../services";
import {
  closeContextMenu,
  updateContextMenu,
} from "../../../store/contextMenu";
import {
  ContextMenuPositionType,
  ContextMenuType,
} from "../../../types/contextMenu";
import { setIsJustRegistered } from "../../../store/users";

import { Button } from "../StyledControls";

import "./Index.scss";
import "../StyledControls/Button/Button.scss";
import Routinie from "./routinie.jpg";
import RoutinieDark from "./routinie-dark.jpg";
import RoutinieMobile from "./routinie-mobile.jpg";
import RoutinieMobileDark from "./routinie-mobile-dark.jpg";

function Top() {
  const emojis = ["🏄🏻‍♀️", "🏄🏾‍♂️", "🏋🏿‍♂️", "🏋🏻‍♀️", "🪂", "⛹🏽‍♀️", "⛹️‍♂️"];
  const randEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  return (
    <div className="top">
      <h1 className="top__title">
        <span>Productivity awaits.</span> {randEmoji}
      </h1>
      <div className="top__text">
        <span>Routinie</span> is a new simple solution to help you stay
        efficient and productive.
      </div>
      <div className="top__text-explanation">
       Trackers and timers, streaks and public pages — it's packed with
       features that will allow you to efficiently work on improving yourself.
      </div>
      <Buttons />
    </div>
  );
}

function Screenshot() {
  return (
    <div className="screenshot">
      <div className="screenshot__content screenshot__content--desktop-light">
        <img src={Routinie} alt="How it looks" />
      </div>
      <div className="screenshot__content screenshot__content--desktop-dark">
        <img src={RoutinieDark} alt="How it looks" />
      </div>
      <div className="screenshot__content screenshot__content--mobile-light">
        <img src={RoutinieMobile} alt="How it looks" />
      </div>
      <div className="screenshot__content screenshot__content--mobile-dark">
        <img src={RoutinieMobileDark} alt="How it looks" />
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="features">
      <div className="features__content">
        <div className="features__row">
          <div className="feature">
            <h3 className="feature__title">
              <span>Track.</span> 🤸‍♀️️
            </h3>
            <div className="feature__text">
              Build different types of good habits and track you progress as well
              as the time you spend working on improving yourself. Of course, both on desktop
              and on mobile.
            </div>
          </div>
          <div className="feature">
            <h3 className="feature__title">
              <span>Challenge.</span> 🏅
            </h3>
            <div className="feature__text">
              Set your public profile, post your progress on Twitter or use our API
              to publish your progress elsewhere. The power of #trackinpublic
              will help you achieving goals faster.
            </div>
          </div>
        </div>
        <div className="features__row">
          <div className="feature">
            <h3 className="feature__title">
              <span>Analyze.</span> 📈
            </h3>
            <div className="feature__text">
              <div className="feature__badge">
                <span>Available soon</span>
              </div>
              See advanced statistics, analyze how well you're progressing
              toward your goals and use all the charts and analytical tools to
              get better.
            </div>
          </div>
          <div className="feature">
            <h3 className="feature__title">
              <span>Repeat.</span> 🔁
            </h3>
            <div className="feature__text">
              Extend it and use not only for simple habits but also for
              timers and personal goals.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Buttons() {
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const { showConfirmation } = useContextMenuHelpers();
  const [createUser] = useCreateUserMutation();
  const [remindPassword] = useRemindPasswordMutation();
  const [setPassword] = useSetPasswordMutation();
  const [login] = useLoginMutation();

  const onSignUpClick = React.useCallback(() => {
    dispatch(
      updateContextMenu({
        position: {
          type: ContextMenuPositionType.CENTER,
        },
        isBlockingView: true,
        options: [
          {
            type: ContextMenuType.SIGN_UP,
            data: {
              action: (
                email: string,
                login: string,
                password: string
              ) => {
                createUser({
                  email,
                  login,
                  password
                })
                  .unwrap()
                  .then((_) => {
                    push("/trackers", true);
                    dispatch(setIsJustRegistered(true));
                    dispatch(closeContextMenu());
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
  }, [dispatch, createUser, push]);

  const onSetPassword = React.useCallback(
    (email?: string) => {
      dispatch(
        updateContextMenu({
          position: {
            type: ContextMenuPositionType.CENTER,
          },
          isBlockingView: true,
          options: [
            {
              type: ContextMenuType.SET_PASSWORD,
              data: {
                email: email,
                action: (email: string, code: string, password: string) => {
                  setPassword({ email, remind_password_token: code, password })
                    .unwrap()
                    .then((_) => {
                      showConfirmation(
                        "Done! ✨",
                        "Your new password has been set."
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
    },
    [dispatch, setPassword, showConfirmation]
  );

  const onRemindPassword = React.useCallback(
    (email: string) => {
      dispatch(
        updateContextMenu({
          position: {
            type: ContextMenuPositionType.CENTER,
          },
          isBlockingView: true,
          options: [
            {
              type: ContextMenuType.REMIND_PASSWORD,
              data: {
                email: email,
                action: (email: string) => {
                  remindPassword({ email })
                    .unwrap()
                    .then((_) => {
                      onSetPassword(email);
                    })
                    .catch((error) => {
                      dispatch(
                        updateContextMenu({
                          data: { stateMessage: error?.data?.message },
                        })
                      );
                    });
                },
                alreadyHaveCodeAction: () => {
                  onSetPassword();
                },
              },
            },
          ],
        })
      );
    },
    [dispatch, remindPassword, onSetPassword]
  );

  const onSignInClick = React.useCallback(() => {
    dispatch(
      updateContextMenu({
        position: {
          type: ContextMenuPositionType.CENTER,
        },
        isBlockingView: true,
        options: [
          {
            type: ContextMenuType.SIGN_IN,
            data: {
              action: (email: string, password: string) => {
                login({ email, password })
                  .unwrap()
                  .then((_) => {
                    dispatch(closeContextMenu());
                  })
                  .catch((error) => {
                    dispatch(
                      updateContextMenu({
                        data: { stateMessage: error?.data?.message },
                      })
                    );
                  });
              },
              remindPasswordAction: (email: string) => {
                onRemindPassword(email);
              },
            },
          },
        ],
      })
    );
  }, [dispatch, login, onRemindPassword]);

  return (
    <div className="buttons">
      <div className="buttons__content">
        <div className="buttons__actions">
          <Button onClick={onSignUpClick}>
            Sign up
          </Button>
          <span className="buttons__actions-separator">or</span>
          <Button onClick={onSignInClick}>
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <div className="index">
      <Top />
      <Screenshot />
      <Features />
    </div>
  );
}