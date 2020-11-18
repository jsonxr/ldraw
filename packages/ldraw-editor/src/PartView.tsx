import React, { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

const PartView = (): ReactElement => {
  let { id } = useParams<{ id: string }>();
  return <div>Part id: {id}</div>;
};

export default PartView;
