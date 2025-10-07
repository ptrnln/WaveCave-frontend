import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import './LoginForm.css'
import { useNavigate, useSearchParams } from "react-router-dom";
import  { TextField, Button, Typography, Box,  } from "@mui/material";
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)({
    '& .MuiFormLabel-root': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      whiteSpace: 'nowrap'
    },
    '& .MuiFormLabel-asterisk': {
      display: 'inline-block',
      lineHeight: 'inherit',
      margin: 0,
      padding: 0
    }
  });


const CredentialField = ({value, onChange, disabled, error, dataErrors}) => (
  <Box sx={{ mb: 2 }}>
    <StyledTextField
      id="credential"
      name="credential"
      label="Username or Email"
      fullWidth
      variant="outlined"
      size="small"
      value={value}
      onChange={onChange}
      disabled={disabled}
      error={error}
      helperText={dataErrors.map((error, i) => (
        <span key={i}>* {error}</span>
      ))}
      required
    />
  </Box>
)


function LoginForm() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempt, setLoginAttempt] = useState(false);
  const passwordErrors = useSelector(state => state.session.errors?.password ?? []);
  const credentialErrors = useSelector(state => state.session.errors?.credential ?? []);
  const generalErrors = useSelector(state => state.session.errors?.overall ?? []);
  const currentUser = useSelector(state => state.session.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const [modalState, setModalState] = useState('credential');
  
  const showModal = useSelector(state => state.session.showModal);

  const activateModalBackdrop = useCallback(() => {
    const modalBackdrop = document.querySelector("div#modalBackdrop");
    modalBackdrop.classList.add("active");
    if(modalBackdrop.classList.contains("inactive")) modalBackdrop.classList.remove("inactive");
    return true
  }, []);

  const deactivateModalBackdrop = useCallback(() => {
    const modalBackdrop = document.querySelector("div#modalBackdrop");
    if(modalBackdrop.classList.contains("active")) modalBackdrop.classList.remove("active");
      modalBackdrop.classList.add("inactive");
    return true
  }, []);

  const handleSubmit = useCallback(async (e) => {
    console.log(credential, password)
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
  }, [credential, password, dispatch]);

  const handleDemoLogin = useCallback(async (e) => {
    e.preventDefault();
    setLoginAttempt(true);
    dispatch(sessionActions.login({
      credential: 'Demo-lition',
      password: 'password'
    }))
  }, [dispatch]);

  
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
      activateModalBackdrop();
      document.addEventListener('pointerdown', handleClick);
    } else {
      deactivateModalBackdrop();
    }

    return () => {
      document.removeEventListener('pointerdown', handleClick);
      if (showModal) {
        deactivateModalBackdrop();
      }
    };
  }, [dispatch, showModal, activateModalBackdrop, deactivateModalBackdrop]);
   

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
    if(credentialErrors.length > 0 || passwordErrors.length > 0 || generalErrors.length > 0) {
      const inputWithError = document.querySelector('.login-form input:has(~.errors:not(:empty))');
      if (inputWithError && document.activeElement !== inputWithError) {
        inputWithError.focus();
      }
      setLoginAttempt(false);
    }
  },[credentialErrors, passwordErrors, generalErrors, currentUser])
  
  // useEffect(() => {
  //   if(Object.keys(errors).some(key => errors[key].length > 0)) {
  //     document
  //       .querySelectorAll('.login-form button')
  //       .forEach(button => button.disabled = false);
  //   }
  // }, [errors])

  return (
    <>
      <div className={"login modal" + (showModal ? "" : " hidden")}>
        <button className="close button" 
          onClick={() => dispatch(sessionActions.hideModal())}
        ><i className="fa-solid fa-xmark" style={{ fontSize: '1rem' }}/>
        </button>
        <form className='login-form'>
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            Log In
          </Typography>
          <CredentialField
              value={credential}
              onChange={(e) => {
                dispatch(sessionActions.clearErrors()); 
                setCredential(e.target.value)}}
              disabled={!!currentUser || !!loginAttempt}
              error={credentialErrors.length > 0}
              dataErrors={credentialErrors}
          />
          <Box sx={{ mb: 2 }}>
            <StyledTextField
              id="password"
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              size="small"
              value={password}
              onChange={(e) => {
                dispatch(sessionActions.clearErrors()); 
                setPassword(e.target.value)
              }}
              disabled={!!currentUser || !!loginAttempt}
              error={passwordErrors.length > 0}
              helperText={passwordErrors.map((error, i) => (
                <span key={i}>* {error}</span>
              ))}
              required
            />
          </Box>
          {generalErrors.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography color="error" variant="body2">
                {generalErrors.map((error, i) => (
                  <div key={i}>* {error}</div>
                ))}
              </Typography>
            </Box>
          )}
          <Button 
            variant="contained"
            fullWidth
            type="submit"
            onClick={handleSubmit}
            disabled={!!currentUser || !!loginAttempt}
            sx={{ mb: 1 }}
          >
            Log In
          </Button>
          <Button 
            variant="outlined"
            fullWidth
            onClick={handleDemoLogin}
            disabled={!!currentUser || !!loginAttempt}
          >
            Demo Log In
          </Button>
        </form>
        <p fontSize="10px">{"Don't have an account? "}
          <a href="">{"Sign Up for one!"}</a>
        </p>
      </div>
      <div id="modal-backdrop" className={showModal ? "active" : ""}></div>
    </>
  );
}

export default LoginForm;