import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import './LoginForm.css'
import { useNavigate, useSearchParams } from "react-router-dom";


function LoginForm() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [loginAttempt, setLoginAttempt] = useState(false);
  const passwordErrors = useSelector(state => state.session.errors?.password || []);
  const credentialErrors = useSelector(state => state.session.errors?.credential || []);
  const overallErrors = useSelector(state => state.session.errors?.overall || []);
  const currentUser = useSelector(state => state.session.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const [modalState, setModalState] = useState('credential');
  
  const showModal = useSelector(state => state.session.showModal);
  
    const activateGreyout = () => {
    const greyout = document.querySelector("div#greyout");
    greyout.classList.add("active");
    if(greyout.classList.contains("inactive")) greyout.classList.remove("inactive");
    return true
  }

  const deactivateGreyout = () => {
    const greyout = document.querySelector("div#greyout");
    if(greyout.classList.contains("active")) greyout.classList.remove("active");
    greyout.classList.add("inactive");
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(sessionActions.clearErrors());
    let hasErrors = false;
    if(credential.length === 0) {
      dispatch(sessionActions.addError('credential', 'Username/email field cannot be blank.'));
      hasErrors = true;
    }
    if(password.length === 0) {
      dispatch(sessionActions.addError('password', 'Password field cannot be blank.'));
      hasErrors = true;
    }
    if(hasErrors) return;
    setLoginAttempt(true);
    dispatch(sessionActions.login({credential, password}));
    setLoginAttempt(false);
  }

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setLoginAttempt(true);
    dispatch(sessionActions.login({
      credential: 'Demo-lition',
      password: 'password'
    }))
  }

  
  useEffect(() => {
    const handleClick = (e) => {
      const modal = document.querySelector(".login.modal");
      if (modal && 
          !modal.classList.contains('hidden') &&
          !modal.contains(e.target) && 
          !e.target.matches('.queue-control button, .queue-control button *') && 
          !e.target.matches('.nav-link.login, .nav-link.login *')) {
        dispatch(sessionActions.hideModal());
      }
    };

    if (showModal) {
      activateGreyout();
      document.addEventListener('click', handleClick);
    } else {
      deactivateGreyout();
    }

    return () => {
      document.removeEventListener('click', handleClick);
      if (showModal) {
        deactivateGreyout();
      }
    };
  }, [dispatch, showModal]);

  

   

  useEffect(() => {
    if(currentUser) {
      setCredential('');
      setPassword('');
      dispatch(sessionActions.hideModal());
      const loginRedirect = searchParams.get("login-redirect");
      if(loginRedirect) {
        console.log(decodeURIComponent(loginRedirect));
        navigate(decodeURIComponent(loginRedirect));
      }
    }
  }, [currentUser, dispatch, navigate, searchParams]);

  useEffect(() => {
    if(currentUser) {
      setLoginAttempt(false);
    }
    if(credentialErrors.length > 0 || passwordErrors.length > 0 || overallErrors.length > 0) {
      // Only focus if there are actual errors and we're not already focused
      const inputWithError = document.querySelector('.login-form input:has(~.errors:not(:empty))');
      if (inputWithError && document.activeElement !== inputWithError) {
        inputWithError.focus();
      }
      setLoginAttempt(false);
    }
  },[credentialErrors, passwordErrors, overallErrors, currentUser])
  
  // useEffect(() => {
  //   if(Object.keys(errors).some(key => errors[key].length > 0)) {
  //     document
  //       .querySelectorAll('.login-form button')
  //       .forEach(button => button.disabled = false);
  //   }
  // }, [errors])

  return (
    <>
      {showModal ? 
      <div className="login modal">
        <button className="close button" 
          onClick={() => dispatch(sessionActions.hideModal())}
        ><i className="fa-solid fa-xmark" style={{ fontSize: '1rem' }}/>
        </button>
        <form className='login-form'>
        <h1>Log In</h1>
          <label>
            Username or Email:
            <input
              id="credential"
              name="credential"
              className="credential"
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              disabled={!!currentUser || !!loginAttempt}
              required
            />
            <ul className="errors credential">
                {credentialErrors.map((error, i) => <li className={"credential error"} key={i}>* {error}</li>)}
            </ul>
          </label>
          <label>
            Password:
            <input
              id="password"
              name="password"
              className="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!!currentUser || !!loginAttempt}
              required
            />
            <ul className="errors password">
              {passwordErrors.map((error, i) => <li className={"password error"} key={i}>* {error}</li>)}
            </ul>
          </label>
          <ul className="errors overall">
            {overallErrors.map((error, i) => <li className={"overall error"} key={i}>* {error}</li>)}
          </ul>
          <button 
            className="login button"
            type="submit"
            onClick={handleSubmit}
            disabled={!!currentUser || !!loginAttempt}
          >Log In</button>
          <button 
            className="login button demo"
            onClick={handleDemoLogin}
            disabled={!!currentUser || !!loginAttempt}
            >Demo Log In</button>
        </form>
      </div>
      :
      <div className="login modal hidden">
        <button className="close button" 
          onClick={() => dispatch(sessionActions.hideModal())}
          ><i className="fa-solid fa-xmark" style={{ fontSize: '1rem' }}/>
        </button>
        <form className='login-form'>
        <h1>Log In</h1>
          <label>
            Username or Email:
            <input
              type="text"
              className="credential"
              name="credential"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
              disabled={!!currentUser || !!loginAttempt}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              className="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={!!currentUser || !!loginAttempt}
            />
          </label>
          <ul className="error messages">
          </ul>
          <button 
            className="login button"
            type="submit"
            onClick={handleSubmit}
            disabled={!!currentUser || !!loginAttempt}
            >Log In</button>
          <button 
            className="login button demo"
            onClick={handleDemoLogin}
            disabled={!!currentUser || !!loginAttempt}
            >Demo Log In</button>
        </form>
      </div>
    }
    </>
  );
}

export default LoginForm;