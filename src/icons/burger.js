import React from "react";
import { Icon } from "@material-ui/core";
import iconStyles from "./styles";

const BurgerIcon = ({ isDark = false, ...props }) => {
  const classes = iconStyles();
  return (
    <Icon
      className={`${classes.icon} ${props.className}`}
      onClick={props.onClick}
    >
      <svg
        width="19"
        height="14"
        viewBox="0 0 19 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2V0ZM18 2C18.5523 2 19 1.55228 19 1C19 0.447715 18.5523 0 18 0V2ZM1 6C0.447715 6 0 6.44772 0 7C0 7.55228 0.447715 8 1 8V6ZM18 8C18.5523 8 19 7.55228 19 7C19 6.44772 18.5523 6 18 6V8ZM1 12C0.447715 12 0 12.4477 0 13C0 13.5523 0.447715 14 1 14V12ZM18 14C18.5523 14 19 13.5523 19 13C19 12.4477 18.5523 12 18 12V14ZM1 2H18V0H1V2ZM1 8H18V6H1V8ZM1 14H18V12H1V14Z"
          fill="white"
        />
      </svg>
    </Icon>
  );
};

export default BurgerIcon;
