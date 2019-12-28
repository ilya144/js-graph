import React from "react";
import { Icon } from "@material-ui/core";
import iconStyles from "./styles";

const ArrowsIcon = ({ isDark = false, ...props }) => {
  const classes = iconStyles();
  return (
    <Icon
      className={`${classes.icon} ${props.className}`}
      onClick={props.onClick}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="17.1201"
          y="11.001"
          width="15.4389"
          height="2.80708"
          transform="rotate(90 17.1201 11.001)"
          fill={isDark ? "#5A6487" : "white"}
        />
        <path
          d="M11.3388 22.1182L15.7894 23.2817L20.2401 22.1182L15.7896 29.2466L11.3388 22.1182Z"
          fill={isDark ? "#5A6487" : "white"}
        />
        <rect
          x="22.8799"
          y="29.2461"
          width="15.4389"
          height="2.80708"
          transform="rotate(-90 22.8799 29.2461)"
          fill={isDark ? "#5A6487" : "white"}
        />
        <path
          d="M28.6612 18.1288L24.2106 16.9653L19.7599 18.1288L24.2104 11.0004L28.6612 18.1288Z"
          fill={isDark ? "#5A6487" : "white"}
        />
      </svg>
    </Icon>
  );
};

export default ArrowsIcon;
