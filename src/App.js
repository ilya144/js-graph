import React from 'react';
import {
  Box,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import HeightIcon from '@material-ui/icons/Height';

const useClasses = makeStyles(theme => ({
  icon: {
    color: "white"
  },
  topBar: {
    width: "100%",
    backgroundColor: "#2b3151"
  }
}));

const App = props => {
  const classes = useClasses();

  return(
    <Box 
      className={classes.topBar}
      display="flex"
      flexDirection="row"
    >
      <MenuRoundedIcon className={classes.icon} />
      <ContactSupportIcon className={classes.icon} />

    </Box>
  )
}

export default App;