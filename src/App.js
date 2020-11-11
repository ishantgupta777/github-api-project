import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import index from './components/homePage';
import commits from './components/commits';

export default function App() {
  return (
    <main>
      <Switch>
        <Route path='/' component={index} exact />
        <Route path='/commits' component={commits} />
      </Switch>
    </main>
  );
}
