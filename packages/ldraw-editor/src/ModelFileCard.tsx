import React, { ReactElement } from 'react';
import { SingleFile } from 'ldraw';
import useStyles from './ModelFileCard.style';
import { Box, IconButton, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

export interface ModelFileCardProps {
  file: SingleFile;
}
const ModelFileCard = ({ file }: ModelFileCardProps): ReactElement => {
  const link = `https://www.ldraw.org/parts/official-part-lookup.html?partid=${file.name}`;
  const imageName = file.name.replace('.dat', '.png');
  const image = `https://www.ldraw.org/library/official/images/parts/${imageName}`;
  const classes = useStyles();

  return (
    <div className={classes.card}>
      <div
        style={{
          width: 240,
          height: 170,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img className={classes.img} src={image} alt="" />
      </div>
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
          <Typography
            style={{
              color: 'white',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '1rem',
            }}
          >
            {file.name}
          </Typography>
          <Typography
            style={{
              color: 'white',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '0.75rem',
            }}
          >
            {file.description}
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
