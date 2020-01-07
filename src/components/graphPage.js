import React, { useRef, useEffect } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Graph } from "../d3utils";
import Data from "../d3utils/graph-data";

const useClasses = makeStyles(() => ({
  entryContainer: {
    width: "100%",
    height: "100%",
    background: "#1c2436",
    overflow: "hidden",

    display: "flex",
    flexDirection: "row"
  },
  pieDigit: {
    position: "relative",
    width: "40px",
    height: "84px",
    left: "16px",
    top: "0px",

    fontFamily: `"Roboto"`,
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "64px",
    lineHeight: "84px",

    color: "#5A6487",
    opacity: "0.08",
    userSelect: "none"
  }
}));

const GraphPage = props => {
  const graphRef = useRef(null);
  const classes = useClasses();

  useEffect(() => {
    if (graphRef) {
      const graph = new Graph(graphRef.current, props, Data.data);
      // eslint-disable-next-line no-console
      console.log(graph);
    }
  }, [graphRef]);

  return (
    <Box
      className={classes.entryContainer}
      ref={graphRef}
      onWheel={e => {
        graphRef.current.scrollBy(e.deltaX, 0);
      }}
    />
  );
};

export default GraphPage;
