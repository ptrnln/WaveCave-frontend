import csrfFetch, { storeCSRFToken } from "./csrf";
import routeToAPI from "./api";

const SET_USER = 'session/SET_USER'
const REMOVE_USER = 'session/REMOVE_USER'
const SHOW_MODAL = 'session/SHOW_MODAL'
const HIDE_MODAL = 'session/HIDE_MODAL'
const SET_ERRORS = 'session/SET_ERRORS'
const CLEAR_ERRORS = 'session/CLEAR_ERRORS'

const initialState = { 
    user: null,
    showModal: false,
    errors: {
        credential: [],
        password: [],
        overall: []
    }
};

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
    } catch {
        return
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
        dispatch(setUser(data.user))
    } else if(data.errors) dispatch(setErrors(data.errors))
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

const sessionReducer = (state = initialState, action) => {
    Object.freeze(state)
    

    switch(action.type) {
        case SET_USER:
            return { ...state, user: action.payload }
        case REMOVE_USER:
            return { ...state, user: null }
        case SHOW_MODAL:
            return { ...state, showModal: true }
        case HIDE_MODAL:
            return { ...state, errors: initialState.errors, showModal: false }
        case SET_ERRORS:
            return { ...state, errors: action.errors }
        case CLEAR_ERRORS:
            return { ...state, errors: initialState.errors }
        default:
            return state;
    }
}

export default sessionReducer;