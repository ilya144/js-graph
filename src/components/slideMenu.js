import React, { useState } from "react";
import { Typography, Icon, Box, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useClasses = makeStyles(theme => ({
  first: {
    "&:hover": {
      cursor: "pointer"
    }
  }
}));

const SlideMenu = props => {
  const classes = useClasses();
  const [open, setopen] = useState(false);

  return (
    <div
      style={{
        width: open ? "320px" : "56px",
        minWidth: open ? "320px" : "56px",
        height: "100%",
        // position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        background: "#2B3250",
        boxShadow: "0px 16px 40px rgba(11, 16, 40, 0.94)"
      }}
    >
      <div
        className={classes.first}
        style={{ background: "#29367A", height: "160px" }}
      >
        <Icon
          style={{
            position: "absolute",
            // top: "18px",
            // left: open ? "120px" : "0px",
            top: "72px",
            left: open ? "284px" : "18px",
            width: "20px",
            height: "40px",
            zIndex: "777"
          }}
          onClick={() => {
            if (typeof props.useCallback.callResize === "function") {
              // TODO сделать более плавный и надежный способ ресайза
              setTimeout(props.useCallback.callResize, 100);
              setopen(!open);
            }
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            transform={open ? "rotate(180)" : "none"}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.07107 2L15 10L7.07107 18L5 15.9104L10.8579 10L5 4.08963L7.07107 2Z"
              fill="#5872DA"
            />
          </svg>
        </Icon>
        {open ? (
          <Box>
            <Typography
              style={{
                position: "relative",
                top: "24px",
                left: "24px",
                color: "#859DE0",
                textAlign: "left",
                fontFamily: "Fira Sans",
                fontWeight: "bold",
                fontSize: "14px",
                lineHeight: "18px"
              }}
            >
              Наименование товара:
            </Typography>
            <Typography
              style={{
                position: "relative",
                top: "32px",
                left: "24px",
                color: "#fff",
                textAlign: "left",
                fontFamily: "Fira Sans",
                fontWeight: "500",
                fontSize: "20px",
                lineHeight: "28px",
                width: "256px"
              }}
            >
              {props.Data.detail.p_name}
            </Typography>
          </Box>
        ) : (
          <Typography
            style={{
              position: "absolute",
              top: "142px", // initial 52px, 54px

              height: "22px",
              width: "84px",
              left: "-16px",
              fontFamily: "Fira Code",
              fontStyle: "normal",
              fontWeight: "500",
              fontSize: "15px", // initial 14px
              lineHeight: "22px",
              userSelect: "none",

              color: "#5872DA",
              transform: "rotate(-90deg)"
            }}
            onClick={() => {
              if (typeof props.useCallback.callResize === "function") {
                // TODO сделать более плавный и надежный способ ресайза
                setTimeout(props.useCallback.callResize, 100);
                setopen(true);
              }
            }}
          >
            Развернуть
          </Typography>
        )}
      </div>
      <div style={{ background: "#5872DA", height: "80px", opacity: "0.6" }}>
        {open ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-around"
            height="100%"
            padding="10px 0px"
          >
            <Grid container alignItems="center">
              <Typography
                component="span"
                style={{
                  color: "#FFFFFF",
                  opacity: "0.6",
                  textAlign: "left",
                  marginLeft: "24px",
                  fontFamily: "Fira Sans",
                  fontWeight: "normal",
                  fontSize: "14px",
                  lineHeight: "18px"
                }}
              >
                РНПТ:
              </Typography>
              <Typography
                component="span"
                style={{
                  color: "#FFFFFF",
                  marginLeft: "4px",
                  fontFamily: "Fira Code",
                  fontWeight: "500",
                  fontSize: "14px",
                  lineHeight: "22px"
                }}
              >
                {props.Data.detail.ipt}
              </Typography>
            </Grid>
            <Grid container alignItems="center">
              <Typography
                component="span"
                style={{
                  color: "#FFFFFF",
                  opacity: "0.6",
                  textAlign: "left",
                  marginLeft: "24px",
                  fontFamily: "Fira Sans",
                  fontWeight: "normal",
                  fontSize: "14px",
                  lineHeight: "18px"
                }}
              >
                ИНН:
              </Typography>
              <Typography
                component="span"
                style={{
                  color: "#FFFFFF",
                  marginLeft: "4px",
                  fontFamily: "Fira Code",
                  fontWeight: "500",
                  fontSize: "14px",
                  lineHeight: "22px"
                }}
              >
                {props.Data.detail.fr_inn}
              </Typography>
            </Grid>
          </Box>
        ) : null}
      </div>
      <div style={{ height: "calc(100% - 240px)", overflow: "hidden" }}>
        {open ? (
          <Box
            height="fit-content"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
          >
            <Grid
              container
              direction="column"
              style={{ marginTop: "24px", marginLeft: "24px" }}
            >
              <Typography
                style={{
                  color: "#859DE0",
                  textAlign: "left",
                  fontFamily: "Fira Sans",
                  fontWeight: "normal",
                  fontSize: "14px",
                  lineHeight: "18px"
                }}
              >
                Выпущено по ДТ:
              </Typography>
              <Typography
                style={{
                  color: "#fff",
                  textAlign: "left",
                  fontFamily: "Fira Code",
                  fontWeight: "500",
                  fontSize: "14px",
                  lineHeight: "22px"
                }}
              >
                {`${props.Data.detail.imp_cnt} ${props.Data.detail.unit_name}`}
              </Typography>
            </Grid>

            <Grid
              container
              direction="column"
              style={{ marginTop: "24px", marginLeft: "24px" }}
            >
              <Typography
                style={{
                  color: "#859DE0",
                  textAlign: "left",
                  fontFamily: "Fira Sans",
                  fontWeight: "normal",
                  fontSize: "14px",
                  lineHeight: "18px"
                }}
              >
                Минимальная цена:
              </Typography>
              <Typography
                style={{
                  color: "#fff",
                  textAlign: "left",
                  fontFamily: "Fira Code",
                  fontWeight: "500",
                  fontSize: "14px",
                  lineHeight: "22px"
                }}
              >
                {`${props.Data.detail.price_min} ₽`}
              </Typography>
            </Grid>

            <Grid
              container
              direction="column"
              style={{ marginTop: "24px", marginLeft: "24px" }}
            >
              <Typography
                style={{
                  color: "#859DE0",
                  textAlign: "left",
                  fontFamily: "Fira Sans",
                  fontWeight: "normal",
                  fontSize: "14px",
                  lineHeight: "18px"
                }}
              >
                Максимальная цена:
              </Typography>
              <Typography
                style={{
                  color: "#fff",
                  textAlign: "left",
                  fontFamily: "Fira Code",
                  fontWeight: "500",
                  fontSize: "14px",
                  lineHeight: "22px"
                }}
              >
                {`${props.Data.detail.price_max} ₽`}
              </Typography>
            </Grid>
          </Box>
        ) : null}
      </div>
    </div>
  );
};

export default SlideMenu;
