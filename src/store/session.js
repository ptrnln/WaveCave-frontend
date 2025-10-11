import csrfFetch, { storeCSRFToken } from "./csrf";
import routeToAPI from "./api";
import { sessionDefaults } from "./defaults";


const SET_USER = 'session/SET_USER'
const REMOVE_USER = 'session/REMOVE_USER'
const SHOW_MODAL = 'session/SHOW_MODAL'
const HIDE_MODAL = 'session/HIDE_MODAL'
const SET_ERRORS = 'session/SET_ERRORS'
const CLEAR_ERRORS = 'session/CLEAR_ERRORS'
const ADD_ERROR = 'session/ADD_ERROR'


export const setUser = user => {
    return {
        type: SET_USER,
        payload: user
    }
}

export const removeUser = () => {
    return {
        type: REMOVE_USER
    }
}

export const showModal = () => {
    return {
        type: SHOW_MODAL
    }
}

export const hideModal = () => {
    return {
        type: HIDE_MODAL
    }
}

export const setErrors = errors => {
    return {
        type: SET_ERRORS,
        errors
    }
}

export const addError = (field, errorMessage) => {
    return {
        type: ADD_ERROR,
        field,
        errorMessage
    }
}

export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS,
    }
}

export const restoreSession = () => async dispatch => {
    try {
        const response = await fetch(routeToAPI("/api/session"), { credentials: "include" });
        if(response.ok) {
            storeCSRFToken(response);
            const data = await response.json();
            dispatch(setUser(data.user));
        }
        return response;
    } catch (e) {
        return e
    }
}

export const signUp = user => async dispatch => {
    const { username, email, password } = user;
    const response = await csrfFetch(routeToAPI('/api/users'), {
        method: 'POST',
        body: JSON.stringify({
            username,
            email,
            password
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    if(response.ok) {
        dispatch(login({ credential: username || email, password }));
        const data = await response.json()
        return data;
    } else throw response

};

export const login = ({ credential, password }) => async dispatch => {
    const response = await csrfFetch(routeToAPI('/api/session'), {
        method: 'POST',
        body: JSON.stringify({ credential, password }),
        credentials: "include"
    });
    
    const data = await response.json();
    if(data.user)  {
        dispatch(setUser(data.user));
    } else if(data.errors) {
        dispatch(clearErrors());
        dispatch(setErrors(data.errors));
    }
    return data;
}

export const logout = () => async dispatch => {
    const response = await csrfFetch(routeToAPI('/api/session'), {
        method: 'DELETE',
        credentials: "include"
    })

    if(response.ok) {
        dispatch(removeUser())
    }
    return response;
}

export const storeUserData = user => {
    sessionStorage.setItem('user', JSON.stringify(user))
}

const sessionReducer = (state = { ...sessionDefaults }, action) => {
    const newState = { ...Object.freeze(state)}
    
    switch(action.type) {
        case REMOVE_USER:
            newState.user = null;
            return newState;
        case SHOW_MODAL:
            newState.showModal = true;
            return newState;
        case HIDE_MODAL:
            newState.showModal = false;
            return newState;
        case SET_ERRORS:
            newState.errors = action.errors;
            return newState;
        case ADD_ERROR:
            newState.errors[action.field] = [...newState.errors[action.field].filter(error => error !== action.errorMessage), action.errorMessage];
            return newState;
        case SET_USER:
            newState.user = action.payload;
            return newState
        case CLEAR_ERRORS:
            newState.errors = {
                credential: [],
                password: [],
                general: []
            };
            return newState;
        default:
            return state;
    }
}

export default sessionReducer;