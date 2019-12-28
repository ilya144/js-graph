import React, { useState } from "react";
import { Container, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import SideBar from "./components/sideBar";
import SlideMenu from "./components/slideMenu";
import GraphPage from "./components/graphPage";
import Header from "./components/header";
import Minimap from "./components/minimap";

const useClasses = makeStyles(() => ({
  app: {
    width: "100%",
    maxWidth: "100%",
    height: "100vh",
    maxHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "0",
    margin: "0",

    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    textAlign: "center"
  },
  content: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row"
  }
}));

const App = () => {
  const classes = useClasses();
  const [zoom, setZoom] = useState(1);
  const [useCallback, setCallback] = useState(null);

  return (
    <Container className={classes.app}>
      <Header zoom={zoom} useCallback={useCallback} />

      <Box className={classes.content}>
        <SlideMenu useCallback={useCallback} />
        <GraphPage
          setZoom={setZoom}
          useCallback={useCallback}
          setCallback={setCallback}
        />
        <SideBar />
        <Minimap zoom={zoom} setZoom={setZoom} />
      </Box>
    </Container>
  );
};

export default App;
