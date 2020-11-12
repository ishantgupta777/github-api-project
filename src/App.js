import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage';
import CommitteesPage from './pages/CommitteesPage';

export default function App() {
  return (
    <main>
      <Switch>
        <Route path='/' component={HomePage} exact />
        <Route path='/committees' component={CommitteesPage} />
      </Switch>
    </main>
  );
}
