import React, { useState } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useClasses = makeStyles(() => ({
  minimap: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    display: "flex",
    flexDirection: "column",
    background: "#2B3250",
    boxShadow: "0px 16px 40px rgba(11, 16, 40, 0.94)",
    borderRadius: "8px"
  },
  zoomBar: {
    height: "56px",
    display: "flex",
    alignItems: "center"
  },
  clickable: {
    "&:hover": {
      cursor: "pointer"
    }
  },
  close: {
    position: "absolute",
    top: "16px",
    right: "16px",
    padding: "4px",
    width: "24px",
    height: "24px"
  }
}));

const Minimap = ({ zoom, ...props }) => {
  const classes = useClasses();
  const [showMap, setShowMap] = useState(false);
  const [isDrag, setDrag] = useState(false);
  const setZoom = k => {
    if (isNaN(k)) return;
    if (k > 2.5) k = 2.5;
    if (k < 0.8) k = 0.8;

    props.useCallback.setZoom(k);
    props.setZoom(k);
  };

  return (
    <Box className={classes.minimap}>
      <div
        className="minimap"
        style={{
          width: "248px",
          height: "130px",
          margin: "16px",
          display: showMap ? "block" : "none"
        }}
      />
      <svg
        className={[classes.close, classes.clickable].join(" ")}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => setShowMap(false)}
        style={{ display: showMap ? "block" : "none" }}
      >
        <path
          d="M2.20746 0.118324L16 13.9285L13.9311 16L0.138579 2.18985L2.20746 0.118324Z"
          fill="#5A6487"
        />
        <path
          d="M15.8614 2.07152L2.06888 15.8817L0 13.8102L13.7925 0L15.8614 2.07152Z"
          fill="#5A6487"
        />
      </svg>
      <Box className={classes.zoomBar}>
        <svg
          className={classes.clickable}
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ margin: "8px" }}
          onClick={() => {
            setZoom(zoom - 0.1);
          }}
        >
          <path d="M13 18H27V21H13V18Z" fill="white" />
        </svg>
        <svg
          width="168"
          // height="11"
          height="40"
          viewBox="0 0 168 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onMouseMove={e =>
            isDrag && setZoom((e.nativeEvent.offsetX + 0.74 * 92.25) / 92.25)
          }
          onMouseLeave={() => setDrag(false)}
        >
          <rect
            opacity="0.6"
            y="3"
            width="168"
            height="3"
            rx="1.5"
            fill="#5A6487"
          />
          <rect
            y="3"
            width={(zoom - 0.8) * 100}
            height="3"
            rx="1.5"
            fill="#859DE0"
          />
          <circle
            className={classes.clickable}
            cx={(zoom - 0.74) * 92.25}
            cy="5.5"
            r="5.5"
            fill="#859DE0"
            onMouseDown={() => setDrag(true)}
            onMouseUp={() => setDrag(false)}
          />
        </svg>
        <svg
          className={classes.clickable}
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginLeft: "8px", [showMap && "marginRight"]: "8px" }}
          onClick={() => {
            setZoom(zoom + 0.1);
          }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.4 18.0004V12.4004H18.4V18.0004H13V21.0004H18.4V26.4004H21.4V21.0004H27V18.0004H21.4Z"
            // fill="#5A6487"
            fill="#fff"
          />
        </svg>
        {showMap ? null : (
          <svg
            className={classes.clickable}
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ margin: "8px 8px 8px 0px" }}
            onClick={() => setShowMap(true)}
          >
            <path
              d="M10.6175 31.8423C10.8049 31.9481 11.0169 32.0024 11.232 31.9997C11.4471 31.9971 11.6577 31.9376 11.8425 31.8273L17.1949 28.6099L22.5623 31.8248C22.7511 31.9381 22.9671 31.9979 23.1873 31.9979C23.4074 31.9979 23.6235 31.9381 23.8123 31.8248L29.7997 28.2349C29.9796 28.1261 30.1284 27.9728 30.2317 27.7898C30.3351 27.6067 30.3895 27.4001 30.3897 27.1899V13.3301C30.3895 13.1146 30.3323 12.9031 30.2238 12.7169C30.1154 12.5307 29.9595 12.3766 29.7722 12.2701C29.5839 12.1673 29.3723 12.1147 29.1577 12.1173C28.9432 12.1199 28.7329 12.1777 28.5472 12.2851L23.1948 15.5001L21.0998 14.2501L20.2473 16.5776L22.0848 17.6801V28.6949L18.3349 26.4449V19.9625C17.921 20.2048 17.4518 20.3365 16.9724 20.345H16.9324C16.6547 20.3452 16.3784 20.3048 16.1124 20.225V26.4349L12.445 28.6324V17.6101L13.6249 16.9026L13.1424 15.7501L11.75 15.1776L10.59 15.8726C10.4101 15.9813 10.2613 16.1346 10.1579 16.3177C10.0546 16.5007 10.0002 16.7074 10 16.9176V30.7823C10.0001 30.9978 10.0574 31.2094 10.1658 31.3956C10.2743 31.5818 10.4301 31.7359 10.6175 31.8423ZM24.2998 17.6751L27.9447 15.4801V26.4999L24.2998 28.6949V17.6751Z"
              // fill="#5A6487"
              fill="#fff"
            />
            <path
              d="M11.0496 12.7149L14.6845 14.2149L16.1845 17.8498C16.2446 17.9946 16.3468 18.118 16.4778 18.2041C16.6089 18.2901 16.7628 18.3348 16.9195 18.3323C17.0755 18.3309 17.2275 18.2824 17.3555 18.1932C17.4835 18.104 17.5816 17.9782 17.637 17.8323L20.8494 9.04748C20.9004 8.90783 20.9106 8.75653 20.8787 8.61131C20.8468 8.46609 20.7743 8.33296 20.6694 8.2275C20.5226 8.08157 20.324 7.99977 20.117 8C20.0257 7.9998 19.9351 8.01589 19.8495 8.0475L11.0796 11.2499C10.9337 11.3053 10.8079 11.4034 10.7187 11.5314C10.6295 11.6594 10.581 11.8114 10.5796 11.9674C10.5739 12.1248 10.6157 12.2802 10.6995 12.4135C10.7834 12.5468 10.9053 12.6518 11.0496 12.7149Z"
              // fill="#5A6487"
              fill="#fff"
            />
          </svg>
        )}
      </Box>
    </Box>
  );
};

export default Minimap;
