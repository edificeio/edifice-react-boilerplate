import React, { StrictMode } from "react";

import { OdeClientProvider } from "@ode-react-ui/core";
import {
  configurationFramework,
  http,
  notifyFramework,
  sessionFramework,
} from "@shared/constants";
import { createRoot } from "react-dom/client";

import App from "./app/App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line global-require
  import("@axe-core/react").then((axe) => {
    axe.default(React, root, 1000);
  });
}

root.render(
  <StrictMode>
    <OdeClientProvider
      framework={{
        sessionFramework,
        configurationFramework,
        notifyFramework,
        http,
      }}
      params={{ app: "blog" }}
    >
      <App />
    </OdeClientProvider>
  </StrictMode>,
);
