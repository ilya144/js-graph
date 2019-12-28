import React from "react";
import { Icon } from "@material-ui/core";
import iconStyles from "./styles";

const PictogramIcon = ({ isDark = false, ...props }) => {
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
        <path
          d="M21.527 20.4695L20.6768 20.9616V29.8066L28.333 25.3861V16.541L21.527 20.4695Z"
          fill={isDark ? "#5A6487" : "white"}
        />
        <path
          d="M22.9129 12.5375L19.9684 10.833L12.0996 15.3756L15.048 17.08L22.9129 12.5375Z"
          fill={isDark ? "#5A6487" : "white"}
        />
        <path
          d="M27.8333 15.3751L24.4401 13.4424L16.5752 17.985L17.0239 18.2172L19.9684 19.9177L22.897 18.229L27.8333 15.3751Z"
          fill={isDark ? "#5A6487" : "white"}
        />
        <path
          d="M15.9808 21.2368L14.5716 20.5125V18.2609L11.6665 16.5879V25.37L19.2677 29.759V20.977L15.9808 19.0836V21.2368Z"
          fill={isDark ? "#5A6487" : "white"}
        />
        <circle
          cx="30"
          cy="14"
          r="5"
          // fill="#F2696D"
          fill={isDark ? "#5A6487" : "#F2696D"}
          stroke="#2A3151"
          strokeWidth="2"
        />
      </svg>
    </Icon>
  );
};

export default PictogramIcon;
