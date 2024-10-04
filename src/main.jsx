import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import configureStore from './store/store';
import csrfFetch, { restoreCSRF } from './store/csrf';
import * as sessionActions from './store/session';
import * as userActions from './store/user'
import * as trackActions from './store/track'
import * as audioPlayerActions from './store/audioPlayer';

const store = configureStore();
window.env = { "environment":import.meta.env.MODE }
if (import.meta.env.MODE !== 'production') {
  restoreCSRF();
  window.store = store;
  store.dispatch(sessionActions.restoreSession())
  window.csrfFetch = csrfFetch;
  window.sessionActions = sessionActions;
  window.userActions = userActions;
  window.trackActions = trackActions;
  window.audioPlayerActions = audioPlayerActions;
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
