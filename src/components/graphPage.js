import React, { useRef, useEffect } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import main from "../d3utils";

const useClasses = makeStyles(() => ({
  entryContainer: {
    width: "100%",
    height: "100%",
    background: "#1c2436",
    overflow: "hidden",

    display: "flex",
    flexDirection: "row"
  }
}));

const GraphPage = props => {
  const graphRef = useRef(null);
  const classes = useClasses();

  useEffect(() => {
    if (graphRef) main(graphRef.current, props);
  }, [graphRef]);

  return (
    <Box
      className={classes.entryContainer}
      ref={graphRef}
      onWheel={e => {
        graphRef.current.scrollBy(e.deltaX, 0);
      }}
    >
      <></>
    </Box>
  );
};

export default GraphPage;
