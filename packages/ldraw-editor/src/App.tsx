import React, { ReactElement } from 'react';
import Home from './Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PartView from './PartView';
import { LDraw } from 'ldraw';
import { LDrawProvider } from 'ldraw-react';

const ldraw = new LDraw({
  folders: ['/library/parts/'],
});

const App = (): ReactElement => (
  <React.StrictMode>
    <LDrawProvider ldraw={ldraw}>
      <Router>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/parts/:id">
            <PartView />
          </Route>
        </Switch>
      </Router>
    </LDrawProvider>
  </React.StrictMode>
);

export default App;
