import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { App } from "./views";
import { store } from "./store";
import * as serviceWorker from "./serviceWorker";
import { getUserDataFromLocalStorage } from "./store/users";

// initial dispatch
store.dispatch(getUserDataFromLocalStorage());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
