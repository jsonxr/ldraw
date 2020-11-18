import React, { ReactElement } from 'react';
import { SingleFile } from 'ldraw';
import ModelFileCard from './ModelFileCard';
import useStyles from './PartList.styles';

export default function PartList({ parts }: { parts: SingleFile[] }): ReactElement {
  const classes = useStyles();

  return (
    <div className={classes.gridList}>
      {parts.map((file: SingleFile) => (
        <ModelFileCard key={file.name} file={file} />
      ))}
    </div>
  );
}
