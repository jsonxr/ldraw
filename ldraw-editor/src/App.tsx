import React, { ReactElement } from 'react';
import { LDraw } from 'ldraw';
import { LDrawProvider } from 'react-ldraw';
import Header from './Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Parts from './pages/parts';

const ldraw = new LDraw();
window.ldraw = ldraw;

const App = (): ReactElement => {
  return (
    <LDrawProvider ldraw={ldraw}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/parts/*" element={<Parts />} />
        </Routes>
      </Router>
    </LDrawProvider>
  );
};

export default App;
