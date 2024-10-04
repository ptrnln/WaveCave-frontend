import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import LoginForm from './components/session/LoginForm';
import SignUpForm from './components/session/SignUpForm';
import Navigation from './components/navigation/Navigation';
import * as sessionActions from './store/session';
import * as trackActions from './store/track';
import UserView from './components/users/UserView';
import AudioPlayer from './components/audio_player/AudioPlayer';
import TrackView from './components/tracks/TrackView';
import TrackUploadForm from './components/tracks/TrackUploadForm';
import TrackUpdateForm from './components/tracks/TrackUpdateForm';
import HomePage from './HomePage';
import TrackIndex from './components/tracks/TrackIndex';
import ErrorPage from './ErrorPage';
import './app.css'
import routeToAPI from './store/api';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreSession()).then(() => {
      setIsLoaded(true)
    });
    dispatch(trackActions.reloadTracksLocally());
  }, [dispatch]);

  

  // const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry/i.test(navigator.userAgent) || window.matchQuery('(max-width: 720px)');

  return (
    <>
      <div className='app'>
        <Navigation />
        <div className='content'>
          {isLoaded && <Outlet />}
        </div>
        <LoginForm />
        <AudioPlayer />
      </div>
      <div id='dev-links-container'>
        <a id='git-link' className='dev-link' href='https://github.com/ptrnln'><i className='fa-brands fa-github' /></a>
        <a className='dev-link' href='https://www.linkedin.com/in/peter-nolan-45828b2ab'><i className='fa-brands fa-linkedin' /></a>
        <a href="https://ph4se.dev" className="dev-link"><i className="fa-solid fa-address-card"></i></a>
        <br />
        <span className='dev-cred'>Developed by Peter Nolan 2024</span>
      </div>
    </>
  );
}


const userLoader = async ({ params }) => {
  window.env ||= { "environment":import.meta.env.MODE}
  const response = await fetch(routeToAPI(`/api/users/@${params.username}`));
  
  if(response.ok) {
    const data = await response.json();
    return data
  } else {
    throw response
  }
}

const trackLoader = async ({ params }) => {
  const response = await fetch(routeToAPI(`/api/users/${params.username}/tracks/${params.title}`)).catch((reasons) => {throw reasons})
  
  
  if(response.ok) {
    const data = await response.json();
    
    return data.track
  } else {
    throw response
  }
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: '/feed',
        element: <TrackIndex />
      },
      {
        path: "/login",
        element: <LoginForm />
      },
      {
        path: "/signup",
        element: <SignUpForm />
      },
      {
        path: '/upload',
        element: <TrackUploadForm />
      },
      {
        path: '/@/:username',
        loader: userLoader,
        element: <UserView />,
        children: [
          {
            path: ':title',
            loader: trackLoader,
            element: <TrackView />,
            children: [
              {
                path: 'update',
                element: <TrackUpdateForm />,
              }
            ]
          }
        ]
      },
    ],
    errorElement: <ErrorPage />,
  },
], {
  basename: import.meta.env.MODE === "production" ? "/wavecave" : "/"
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;
