import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <React.StrictMode>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="!top-12"
          />
        </React.StrictMode>
      </PersistGate>
    </Provider>
  );
} else {
  console.error("Root element not found!");
}

// if (window) {
//   window.console.log = () => {};
//   window.console.error = () => {};
//   window.console.warn = () => {};
// }