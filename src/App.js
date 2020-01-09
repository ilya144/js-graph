import React, { useState } from "react";
import { Container, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import SideBar from "./components/sideBar";
import SlideMenu from "./components/slideMenu";
import GraphPage from "./components/graphPage";
import Header from "./components/header";
import Minimap from "./components/minimap";

import Legend from "./icons/legend/legend.svg";

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
  const [showLegend, setShowLegend] = useState(false);
  const toggleLegend = () => setShowLegend(!showLegend);
  const [isVertical, setVertical] = useState(false);

  return (
    <Container className={classes.app}>
      <Header
        zoom={zoom}
        useCallback={useCallback}
        showLegend={showLegend}
        toggleLegend={toggleLegend}
        isVertical={isVertical}
        setVertical={setVertical}
      />

      {showLegend ? (
        <Box maxWidth="100%" overflow="scroll">
          <img src={Legend} alt="legend" />
        </Box>
      ) : (
        <Box className={classes.content}>
          <SlideMenu useCallback={useCallback} />
          <GraphPage
            setZoom={setZoom}
            useCallback={useCallback}
            setCallback={setCallback}
            isVertical={isVertical}
          />
          <SideBar useCallback={useCallback} showLegend={toggleLegend} />
          <Minimap zoom={zoom} setZoom={setZoom} useCallback={useCallback} />
        </Box>
      )}
    </Container>
  );
};

export default App;
