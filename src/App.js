import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage';
import CommitsPage from './pages/CommitsPage';

export default function App() {
  return (
    <main>
      <Switch>
        <Route path='/' component={HomePage} exact />
        <Route path='/commits' component={CommitsPage} />
      </Switch>
    </main>
  );
}
