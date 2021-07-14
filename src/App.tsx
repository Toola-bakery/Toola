import * as React from "react";
import { Provider } from "react-redux";
import Box from "@material-ui/core/Box";
import { Page } from "./features/editor/components/Page";
import { store } from "./redux";

export default function App(): JSX.Element {
  return (
    <Provider store={store}>
      <Box sx={{ display: "flex" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Page />
        </Box>
      </Box>
    </Provider>
  );
}
