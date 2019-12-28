import React from "react";
import { Icon } from "@material-ui/core";
import iconStyles from "./styles";

const MoreIcon = ({ isDark = false, ...props }) => {
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
          d="M12.5806 22.1613C11.1554 22.1613 10 21.0059 10 19.5806C10 18.1554 11.1554 17 12.5806 17C14.0059 17 15.1613 18.1554 15.1613 19.5806C15.1613 21.0059 14.0059 22.1613 12.5806 22.1613ZM27.4194 22.1613C25.9941 22.1613 24.8387 21.0059 24.8387 19.5806C24.8387 18.1554 25.9941 17 27.4194 17C28.8446 17 30 18.1554 30 19.5806C30 21.0059 28.8446 22.1613 27.4194 22.1613ZM20 22.1613C18.5747 22.1613 17.4194 21.0059 17.4194 19.5806C17.4194 18.1554 18.5747 17 20 17C21.4253 17 22.5806 18.1554 22.5806 19.5806C22.5806 21.0059 21.4253 22.1613 20 22.1613Z"
          fill={isDark ? "#5A6487" : "white"}
        />
      </svg>
    </Icon>
  );
};

export default MoreIcon;
