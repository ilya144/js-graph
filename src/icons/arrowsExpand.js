import React from "react";
import { Icon } from "@material-ui/core";
import iconStyles from "./styles";

const ArrowsExpandIcon = ({ isDark = false, ...props }) => {
  const classes = iconStyles();
  return (
    <Icon
      className={`${classes.icon} ${props.className}`}
      onClick={props.onClick}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="-5.96046e-08"
          y="-0.707107"
          width="7.28082"
          height="1.97737"
          transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 16.1953 12.0937)"
          fill="white"
          stroke="white"
        />
        <path
          d="M19.6152 8.5637L21.4453 11.6893L22.99 5.01037L16.3109 6.55482L19.4364 8.38486L19.5492 8.45091L19.6152 8.5637Z"
          fill="white"
          stroke="white"
        />
        <rect
          x="5.96046e-08"
          y="0.707107"
          width="7.28082"
          height="1.97737"
          transform="matrix(-0.707107 0.707107 0.707107 0.707107 10.8047 14.9063)"
          fill="white"
          stroke="white"
        />
        <path
          d="M8.38428 19.4363L6.55421 16.3107L5.00949 22.9896L11.6886 21.4452L8.56312 19.6151L8.45033 19.5491L8.38428 19.4363Z"
          fill="white"
          stroke="white"
        />
      </svg>
    </Icon>
  );
};

export default ArrowsExpandIcon;
