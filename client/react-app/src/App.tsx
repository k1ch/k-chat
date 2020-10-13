import React from 'react';
import './App.scss';
import { Header, Login, Home } from './components'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


export default class App extends React.Component<{ location?}> {
  render() {
    return (
      <Router>
        <Header />
        <Switch>
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Home}></Route>
        </Switch>
      </Router>
    )
  }
}

