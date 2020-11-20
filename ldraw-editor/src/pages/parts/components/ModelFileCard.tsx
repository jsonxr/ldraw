import React, { ReactElement } from 'react';
import { Box, IconButton, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import clsx from 'clsx';
import { LDrawFileType, SingleFile } from 'ldraw';
import useStyles from './ModelFileCard.style';
import { Link } from 'react-router-dom';
import unknown from './unknown.jpg';

interface ModelFileCardProps {
  file: SingleFile;
}
const ModelFileCard = ({ file }: ModelFileCardProps): ReactElement => {
  const link = `https://www.ldraw.org/parts/official-part-lookup.html?partid=${file.name}`;
  const imageName = file.name.replace('.dat', '.png');
  const image =
    file.type === LDrawFileType.Part
      ? `https://www.ldraw.org/library/official/images/parts/${imageName}`
      : unknown;
  const classes = useStyles();

  return (
    <div className={classes.card}>
      <Link
        to={file.name}
        style={{
          width: 240,
          height: 170,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img className={classes.img} src={image} alt="" />
      </Link>
      <Box
        style={{
          bottom: 0,
          display: 'flex',
          justifyContent: 'space-evenly',

          height: 70,
          background: 'rgba(0, 0, 0, 0.5)',
          alignItems: 'center',
          padding: 0,
          //border: '1px solid red',
        }}
      >
        <Box
          style={{
            width: '160px',
            overflow: 'hidden',
          }}
        >
          <Typography className={clsx([classes.text, classes.filename])}>
            {file.name}
          </Typography>
          <Typography className={clsx([classes.text, classes.description])}>
            {file.meta.description}
          </Typography>
        </Box>
        <IconButton
          target="_blank"
          href={link}
          style={{
            color: 'white',
          }}
        >
          <InfoIcon />
        </IconButton>
      </Box>
    </div>
  );
};

export default ModelFileCard;
