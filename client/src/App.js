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
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';

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
          <PrivateRoute exact path = '/dashboard' component={Dashboard} />
          <PrivateRoute exact path = '/create-profile' component={CreateProfile} />
          <PrivateRoute exact path = '/edit-profile' component={EditProfile} />
          <PrivateRoute exact path = 'add-experience' component={AddExperience} />
          <PrivateRoute exact path = '/add-education' component={AddEducation} />
        </Switch>
      </section>
  </Fragment>
  </Router>
  </Provider>
)};

export default App;
