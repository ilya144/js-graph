import React, { useState } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  ArrowsIcon,
  GroupIcon,
  PictogramIcon,
  QuestionIcon,
  TargetIcon,
  ArrowsToCenterIcon,
  MoreIcon,
  DocumentsIcon,
  ChainIcon
} from "../icons";

const useClasses = makeStyles(() => ({
  sidebar: {
    width: "56px",

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    background: "#2B3250",
    borderRadius: "8px",

    position: "absolute",
    top: "64px",
    right: "8px",

    "& span": {
      width: "40px",
      height: "40px",
      margin: "4px auto",
      "&:hover": {
        cursor: "pointer"
      }
    }
  }
}));

const SideBar = props => {
  const classes = useClasses();

  return (
    <Box className={classes.sidebar}>
      <QuestionIcon isDark />
      <PictogramIcon />
      <ArrowsIcon />
      <GroupIcon />
      <ArrowsToCenterIcon isDark />
      <TargetIcon isDark />
      <MoreIcon isDark />
      <DocumentsIcon />
      <ChainIcon />
    </Box>
  );
};

export default SideBar;
