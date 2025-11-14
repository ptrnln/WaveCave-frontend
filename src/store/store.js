import { legacy_createStore as createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import sessionReducer from './session';
import userReducer from './user';
import { audioPlayerReducer } from './audioPlayer';
import trackReducer from './track';
import playlistReducer from './playlist';


const rootReducer = combineReducers({
    session: sessionReducer,
    users: userReducer,
    audio: audioPlayerReducer,
    tracks: trackReducer,
    playlists: playlistReducer
});

let enhancer;
if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState = {}) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;