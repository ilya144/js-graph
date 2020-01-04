import React from "react";
import { Icon } from "@material-ui/core";
import iconStyles from "./styles";

const QuestionSmallIcon = ({ isDark = false, ...props }) => {
  const classes = iconStyles();
  return (
    <Icon
      className={`${classes.icon} ${props.className}`}
      onClick={props.onClick}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.5 0C4.80558 0 1 3.75291 1 8.38235C1 11.9488 3.25852 14.995 6.44204 16.2059L2.5 19L11.6882 16.4843C15.3222 15.5323 18 12.2657 18 8.38235C18 3.75291 14.1944 0 9.5 0Z"
          fill={isDark ? "#5A6487" : "white"}
        />
        <path
          d="M9.5983 4.50391C10.1423 4.50391 10.6063 4.59591 10.9903 4.77991C11.3743 4.95591 11.6623 5.19591 11.8543 5.49991C12.0463 5.79591 12.1423 6.11991 12.1423 6.47191C12.1423 6.79991 12.0863 7.07991 11.9743 7.31191C11.8623 7.54391 11.7263 7.73191 11.5663 7.87591C11.4063 8.01191 11.1943 8.17191 10.9303 8.35591C10.6103 8.57191 10.3703 8.77191 10.2103 8.95591C10.0583 9.13191 9.98231 9.36391 9.98231 9.65191V10.0119H8.4103V9.59191C8.4103 9.22391 8.4663 8.91191 8.5783 8.65591C8.6983 8.39991 8.8383 8.19591 8.9983 8.04391C9.1663 7.89191 9.3743 7.73191 9.6223 7.56391C9.8783 7.39591 10.0623 7.24791 10.1743 7.11991C10.2943 6.99191 10.3543 6.82791 10.3543 6.62791C10.3543 6.37991 10.2703 6.19191 10.1023 6.06391C9.9423 5.92791 9.7183 5.85991 9.4303 5.85991C8.8863 5.85991 8.3983 6.11191 7.9663 6.61591L6.8623 5.76391C7.2143 5.35591 7.6143 5.04391 8.0623 4.82791C8.5103 4.61191 9.0223 4.50391 9.5983 4.50391ZM9.2143 11.1399C9.5023 11.1399 9.7463 11.2399 9.9463 11.4399C10.1463 11.6399 10.2463 11.8799 10.2463 12.1599C10.2463 12.4399 10.1463 12.6839 9.9463 12.8919C9.7463 13.0919 9.5023 13.1919 9.2143 13.1919C8.9263 13.1919 8.6823 13.0919 8.4823 12.8919C8.2903 12.6919 8.1943 12.4479 8.1943 12.1599C8.1943 11.8799 8.2903 11.6399 8.4823 11.4399C8.6823 11.2399 8.9263 11.1399 9.2143 11.1399Z"
          fill="#302551"
        />
      </svg>
    </Icon>
  );
};

export default QuestionSmallIcon;
