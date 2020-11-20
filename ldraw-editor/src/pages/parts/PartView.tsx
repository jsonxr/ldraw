import React, { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

const PartView = (): ReactElement => {
  console.log('PartsView');
  const { id } = useParams();
  return <div>Part id: {id}</div>;
};

export default PartView;
