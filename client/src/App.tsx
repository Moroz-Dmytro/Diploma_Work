import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
import { MainContent } from './pages/MainContent';
import { MainPage } from './pages/MainPage';

function App() {
  return (
    <Switch>
      <Route path="/" component={MainPage} exact />
      <Route path="/account" component={MainContent} />
    </Switch>
  );
}

export default App;
