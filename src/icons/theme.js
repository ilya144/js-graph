import React from "react";
import { Icon } from "@material-ui/core";
import iconStyles from "./styles";

const ThemeIcon = ({ isDark = false, ...props }) => {
  const classes = iconStyles();
  return (
    <Icon
      className={`${classes.icon} ${props.className}`}
      onClick={props.onClick}
    >
      <svg
        width="46"
        height="24"
        viewBox="0 0 46 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="46" height="24" rx="12" fill="#1D2336" />
        <circle cx="33" cy="12" r="10" fill="white" />
        <circle opacity="0.1" cx="13" cy="12" r="2" fill="white" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M38.4143 17.8897C37.9536 17.9624 37.4812 18.0001 37 18.0001C32.0294 18.0001 28 13.9707 28 9.00014C28 7.62348 28.3091 6.31901 28.8617 5.15234C26.547 6.55419 25 9.09654 25 12.0002C25 16.4185 28.5817 20.0002 33 20.0002C35.0883 20.0002 36.9897 19.2001 38.4143 17.8897Z"
          fill="#302551"
        />
      </svg>
    </Icon>
  );
};

export default ThemeIcon;
