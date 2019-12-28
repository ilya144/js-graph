import React from "react";
import { Icon } from "@material-ui/core";
import iconStyles from "./styles";

const TargetIcon = ({ isDark = false, ...props }) => {
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21.3662 8H18.6338V10.759C16.6464 11.0537 14.8026 11.9823 13.3804 13.4124C11.9588 14.842 11.0407 16.69 10.7567 18.6782H8V21.4105H10.7569C11.0429 23.4057 11.9676 25.2594 13.3984 26.6902C14.8292 28.121 16.6829 29.0457 18.6782 29.3318V32H21.4105V29.2853C23.3979 28.9906 25.2417 28.062 26.6639 26.6319C28.0855 25.2024 29.0036 23.3543 29.2877 21.3662H32V18.6338H29.2853C28.9906 16.6464 28.062 14.8026 26.6319 13.3804C25.2024 11.9588 23.3543 11.0407 21.3662 10.7567V8ZM15.3323 15.3323C16.239 14.4255 17.387 13.805 18.6338 13.5404V16.0492H21.3662V13.5404C22.613 13.805 23.761 14.4255 24.6677 15.3323C25.5745 16.239 26.195 17.387 26.4596 18.6338H23.9508V21.3662H26.4596C26.195 22.613 25.5745 23.761 24.6677 24.6677C23.761 25.5745 22.613 26.195 21.3662 26.4596V23.9508H18.6338V26.4596C17.387 26.195 16.239 25.5745 15.3323 24.6677C14.4255 23.761 13.805 22.613 13.5404 21.3662H16.0492V18.6338H13.5404C13.805 17.387 14.4255 16.239 15.3323 15.3323Z"
          fill={isDark ? "#5A6487" : "white"}
        />
        <path
          d="M20 22C21.1046 22 22 21.1046 22 20C22 18.8954 21.1046 18 20 18C18.8954 18 18 18.8954 18 20C18 21.1046 18.8954 22 20 22Z"
          fill={isDark ? "#5A6487" : "white"}
        />
      </svg>
    </Icon>
  );
};

export default TargetIcon;
