import React , { Fragment , useState }from 'react'
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
  const initialState = {
    name: "",
    email: "",
    password: "",
  };
  const [formData , setformData] = useState(initialState) ;

  const { name,email,password } = formData;
  const onChange = e =>
     setformData({...formData, [e.target.name]: e.target.value });
  const onSubmit = async e => {
    e.preventDefault();
    login(email, password);
  }

  //Redirect if logged in 
  if(isAuthenticated) {
    console.log("Redirected")
    return <Redirect to='/dashboard' />
  }
  return (
    <Fragment>
    <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i class="fas fa-user"></i> Login to Your Account</p>
      <form className="form" onSubmit = {e => onSubmit(e)}>
        <div className="form-group">
          <input 
            type="email" 
            placeholder="Email Address" 
            name="email" 
            value={email}
            onChange={e => onChange(e)}
            required
            />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            required
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
      </Fragment>
  )
}

login.propTypes = {
  login : PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}

const mapStatetoProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStatetoProps, {login})(Login) ;