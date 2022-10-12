import React, { Fragment } from 'react';
import { Link, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;
import { logout } from '../../actions/auth';


import login from '../auth/Login';
import register from '../auth/Register';

const newHistory = createBrowserHistory();
const Navbar = ({ auth: {isAuthenticated, loading}, logout }) => {

  const authLinks = (
    <ul>
      <li>
        <Link to='/login'>
        <i class= "fa fa-user" aria-hidden="true" />{' '}
        <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout}  href='#!'>
        <i class="fa fa-sign-out" aria-hidden="true"></i>{' '}
            <span className= "hide-sm" >Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li><a href="#!">Developers</a></li>
      <li><Link to='/register'>Register</Link></li>
      <li><Link to='/login'>Login</Link></li>
    </ul>
  );
  return (
    <Router history={newHistory}>
    <nav className="navbar bg-dark">
      <h1>
        <Link to='/'><i className="fas fa-code"></i> PortFolio Manager</Link>
      </h1>
     {!loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>) }
    </nav>
    </Router>
  )
}

Navbar.propTypes = {
  logout : PropTypes.func.isRequired,
  auth : PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth : state.auth
});
export default connect(mapStateToProps, {logout})(Navbar)
