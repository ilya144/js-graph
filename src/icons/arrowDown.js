import React from "react";
import { Icon } from "@material-ui/core";
import iconStyles from "./styles";

const ArrowDownIcon = ({ isDark = false, ...props }) => {
  const classes = iconStyles();
  return (
    <Icon
      className={`${classes.icon} ${props.className}`}
      onClick={props.onClick}
    >
      <svg
        width="10"
        height="7"
        viewBox="0 0 10 7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683418 0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L0.292893 1.70711ZM5 5L5.70711 5.70711L5 6.41421L4.29289 5.70711L5 5ZM8.29289 0.292893C8.68342 -0.0976312 9.31658 -0.0976312 9.70711 0.292893C10.0976 0.683417 10.0976 1.31658 9.70711 1.70711L8.29289 0.292893ZM1.70711 0.292893L5.70711 4.29289L4.29289 5.70711L0.292893 1.70711L1.70711 0.292893ZM4.29289 4.29289L8.29289 0.292893L9.70711 1.70711L5.70711 5.70711L4.29289 4.29289Z"
          fill="white"
        />
      </svg>
    </Icon>
  );
};

export default ArrowDownIcon;
