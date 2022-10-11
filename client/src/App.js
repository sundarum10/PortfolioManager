import React , {Fragment, useEffect } from 'react' ;
import './App.css';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import { BrowserRouter as Router,Route,Switch } from 'react-router-dom';
import register from './components/auth/Register';
import login from './components/auth/Login';
import { createBrowserHistory } from 'history'
//Redux 
import { Provider } from 'react-redux';
import store from './store';
import Alert from './components/layouts/Alert';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthtoken';

const newHistory = createBrowserHistory();

if(localStorage.token) {
  setAuthToken(localStorage.token)
}
const App = () => {

  useEffect(()=>{
    store.dispatch(loadUser());
  },[]);

  return (
  <Provider store = {store} >
  <Router history={newHistory}>
    <Fragment>
      <Navbar />
      {/* <Landing /> */}
      <Route exact path='/' component={Landing} />
      <section className='container'>
        <Alert />
        <Switch>
          <Route exact path ='/register' component={register} />
          <Route exact path ='/login' component={login} />
        </Switch>
      </section>
  </Fragment>
  </Router>
  </Provider>
)};

export default App;
