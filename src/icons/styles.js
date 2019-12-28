import { makeStyles } from "@material-ui/core/styles";

const iconStyles = makeStyles(theme => ({
  icon: {
    width: "fit-content",
    height: "fit-content",

    display: "flex",
    alignContent: "center"
    // width: "40px",
    // height: "40px",
    // margin: "4px auto",
    // "&:hover": {
    //   cursor: "pointer"
    // }
  }
}));

export default iconStyles;
