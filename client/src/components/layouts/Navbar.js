import React from 'react';
import { Link, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history'

import login from '../auth/Login';
import register from '../auth/Register';

const newHistory = createBrowserHistory();
const Navbar = () => {
  return (
    <Router history={newHistory}>
    <nav className="navbar bg-dark">
      <h1>
        <Link to='/'><i className="fas fa-code"></i> PortFolio Manager</Link>
      </h1>
      <ul>
        <li><a href="!#">Developers</a></li>
        <li><Link to='/register'>Register</Link></li>
        <li><Link to='/login'>Login</Link></li>
      </ul>
    </nav>
    </Router>
  )
}

export default Navbar
