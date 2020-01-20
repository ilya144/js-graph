/* global document, parseInt */
import React, { useState } from "react";
import { Typography, Icon, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  TargetIcon,
  ArrowsToCenterIcon,
  QuestionSmallIcon,
  HorizontalIcon,
  VerticalIcon,
  BurgerIcon,
  ArrowsExpandIcon,
  ThemeIcon,
  ArrowDownIcon
} from "../icons";

const useClasses = makeStyles(() => ({
  header: {
    width: "100%",
    height: "58px",
    minHeight: "58px",
    background: "#2B3250",

    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  icon: {
    width: "fit-content",
    height: "fit-content",

    display: "flex",
    alignContent: "center"
  },
  clickable: {
    "& *": {
      cursor: "pointer",
      userSelect: "none"
    }
  }
}));

const Header = props => {
  const zoom = parseInt(props.zoom.toFixed(2) * 100, 10) + "%";
  const classes = useClasses();
  const [isFull, setFull] = useState(false);

  const open_fullscreen = () => {
    setFull(true);
    document.body.requestFullscreen();
  };
  const close_fullscreen = () => {
    setFull(false);
    document.exitFullscreen();
  };
  document.onfullscreenchange = () => {
    return document.fullscreen ? setFull(true) : setFull(false);
  };
  const setVertical = () => props.setVertical(true);
  const setHorizontal = () => props.setVertical(false);

  return (
    <Box className={classes.header}>
      <Box
        className={classes.clickable}
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        width="220px"
      >
        <BurgerIcon
          onClick={() => props.useCallback && props.useCallback.callMain()}
        />
        <QuestionSmallIcon
          isDark={props.showLegend}
          onClick={props.toggleLegend}
        />
        <HorizontalIcon isDark={!props.isVertical} onClick={setHorizontal} />
        <VerticalIcon isDark={props.isVertical} onClick={setVertical} />
      </Box>
      <Box className={classes.clickable} display="flex" alignItems="center">
        <Typography
          style={{
            color: "#fff",
            marginRight: "10px",
            fontFamily: "Fira Sans",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "14px",
            lineHeight: "18px"
          }}
        >
          {/* Окружение НП по выбранному... */}
          {/* Общий режим */}
          {props.headerText}
        </Typography>
        <ArrowDownIcon />
      </Box>
      <Box
        className={classes.clickable}
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        width="220px"
      >
        <ThemeIcon />
        <TargetIcon
          onClick={props.useCallback && props.useCallback.goToStart}
        />

        <Typography
          style={{
            color: "#fff",
            textAlign: "center",
            width: "40px"
          }}
        >
          {zoom}
        </Typography>

        {isFull ? (
          <ArrowsToCenterIcon onClick={close_fullscreen} />
        ) : (
          <ArrowsExpandIcon onClick={open_fullscreen} />
        )}
      </Box>
    </Box>
  );
};

export default Header;
