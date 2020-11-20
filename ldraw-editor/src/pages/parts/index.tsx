import React, { ReactElement } from 'react';
import { Routes, Route } from 'react-router-dom';
import PartsList from './PartsList';
import PartView from './PartView';
import NotFound from './NotFound';

const Index = (): ReactElement => {
  console.log('parts/Index');
  return (
    <Routes>
      <Route path="/" element={<PartsList />} />
      <Route path=":id" element={<PartView />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Index;
