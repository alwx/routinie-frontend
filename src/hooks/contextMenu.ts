import * as React from "react";
import { ContextMenuPositionType, ContextMenuType } from "../types/contextMenu";
import { closeContextMenu, updateContextMenu } from "../store/contextMenu";
import { useAppDispatch } from "./store";
import { useHistory } from "react-router";

export function useContextMenuHelpers() {
  const dispatch = useAppDispatch();
  const { push } = useHistory();

  const showConfirmation = React.useCallback(
    (title, text) => {
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
                title: title,
                text: text,
                buttons: [
                  {
                    text: "OK",
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

  const showNetworkError = React.useCallback(
    (text?: string) => {
      showConfirmation(
        "Error 😢",
        text ||
          "Was unable to perform the operation. Please, check your internet connection and try again."
      );
    },
    [showConfirmation]
  );

  const showPremiumBlocked = React.useCallback(
    (text?: string) => {
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
                title: text,
                text:
                  "But it's is more than just that! " +
                  "Premium users can enjoy more flexibility + get an access to our API and better analytics.",
                buttons: [
                  {
                    text: "Get premium",
                    action: () => {
                      push("/premium", true);
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
    [dispatch, push]
  );

  return {
    showConfirmation,
    showNetworkError,
    showPremiumBlocked,
  };
}
