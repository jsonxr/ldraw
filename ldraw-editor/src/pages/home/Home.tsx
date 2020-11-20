import React, { ReactElement } from 'react';
import useStyles from './Home.styles';

const Home = (): ReactElement => {
  const classes = useStyles();

  return <div className={classes.root}>Home!</div>;
};

export default Home;
