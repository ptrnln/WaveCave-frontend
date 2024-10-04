import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import { Navigate } from "react-router-dom";
import './SignUpForm.css'

const SignUpForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({
        username: [],
        email: [],
        password: []
    });
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    if (sessionUser) return <Navigate to='/' replace={true} />

    const handleSubmit = e => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors({
                username: [],
                email: [],
                password: []
            });
            dispatch(sessionActions.signUp({ email, username, password }))
                .catch(async res => {
                    let data;
                    try  {
                        data = await res.clone().json();
                    } catch {
                        data = await res.text();
                    }
                    if (data.errors) {
                        const usernameErrors = data.errors.filter(error => !!error.toLowerCase().match(/username/));
                        const emailErrors = data.errors.filter(error => !!error.toLowerCase().match(/email/));
                        const passwordErrors = data.errors.filter(error => !!error.toLowerCase().match(/password/));
                        setErrors({
                            username: usernameErrors,
                            email: emailErrors,
                            password: passwordErrors
                        })
                    } else if (data) setErrors([data]);
                    else setErrors([res.statusText]);
                })
        } else setErrors({
            ...errors,
            password: ['Confirm Password field must contain the same value as the Password field']
        })
    }

    return (
        <>
            <form className='SignUpForm' onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <label htmlFor="email">Email:
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <ul className="email errors">
                    {errors.email.map((error, i) => <li key={`email error-${i}`}>* {error}</li>)}
                </ul>
                <label htmlFor="username">Username:
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </label>
                <ul className="username errors">
                    {errors.username.map((error, i) => <li key={`username error-${i}`}>* {error}</li>)}
                </ul>
                <label htmlFor="password">Password:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <label htmlFor="confirmPassword">Confirm Password:
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </label>
                <ul className="password errors">
                    {errors.password.map((error, i) => <li key={`password error-${i}`}>* {error}</li>)}
                </ul>
                <button type="submit">Sign Up</button>
            </form>
        </>
    )
}


export default SignUpForm