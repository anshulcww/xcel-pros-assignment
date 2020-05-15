import React, { Component } from 'react';
import './App.css';
import history from './history';
import { connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import LoginComponent from './components/DashboardComponent/LoginComponent'
import DashboardComponent from './components/DashboardComponent/DashboardComponent'
import RegistrationComponent from './components/DashboardComponent/RegistrationComponent'



class App extends Component {
  async componentDidMount(){
   
  }
  
  render() {
    const App = () => (
      <Router history={history}>
        <div className='container-fluid'>
          <Switch>
            <Route exact path='/' component={DashboardComponent} />
            <Route exact path='/login' component={LoginComponent} />
            <Route exact path='/signup' component={RegistrationComponent} />
            
          </Switch>
        </div>
      </Router>
    )
    return (
      <Switch>
        <App />
      </Switch>
    )
  }
}

export default connect(null, {})(App)

