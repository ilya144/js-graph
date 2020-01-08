import React from "react";
import { Icon } from "@material-ui/core";
import iconStyles from "./styles";

const HorizontalIcon = ({ isDark = false, ...props }) => {
  const classes = iconStyles();
  return (
    <Icon
      className={`${classes.icon} ${props.className}`}
      onClick={props.onClick}
    >
      <svg
        width="28"
        height="18"
        viewBox="0 0 28 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 9H26"
          stroke={isDark ? "#5A6487" : "white"}
          strokeWidth="2"
        />
        <path d="M23 13L28 9L23 5V13Z" fill={isDark ? "#5A6487" : "white"} />
        <rect
          width="18"
          height="7"
          rx="3.5"
          fill={isDark ? "#5A6487" : "white"}
        />
        <rect
          y="11"
          width="18"
          height="7"
          rx="3.5"
          fill={isDark ? "#5A6487" : "white"}
        />
      </svg>
    </Icon>
  );
};

export default HorizontalIcon;
