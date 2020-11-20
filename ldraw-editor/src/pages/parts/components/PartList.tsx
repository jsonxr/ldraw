import React, { ReactElement } from 'react';
import { SingleFile } from 'ldraw';
import ModelFileCard from './ModelFileCard';
import useStyles from './PartList.styles';

interface PartListProps {
  parts: SingleFile[];
}
const PartList = ({ parts }: PartListProps): ReactElement => {
  const classes = useStyles();
  console.log('parts: ', parts);

  return (
    <div className={classes.gridList}>
      {parts.map((file: SingleFile) => (
        <ModelFileCard key={file.name} file={file} />
      ))}
    </div>
  );
};

export default PartList;
