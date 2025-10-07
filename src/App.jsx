import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Layout from './Layout';
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
import { spawn, Thread, Worker } from "threads";
import PlaylistCreationForm from './components/playlists/PlaylistCreationForm';


window.env ||= { "environment":import.meta.env.MODE };



const userLoader = async ({ params }) => {
  const response = await fetch(routeToAPI(`/api/users/@${params.username.replaceAll("@", "")}`));
  
  if(response.ok) {
    const data = await response.json();
    return data
  } else {
    throw response
  }
}

const trackLoader = async ({ params }) => {

  const response = await fetch(routeToAPI(`/api/users/@${params.username.replaceAll("@", "")}/tracks/${params.title}`)).catch((reasons) => {throw reasons})
  
  
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
    errorElement: <Layout><ErrorPage /></Layout>,
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
        path: "/signup",
        element: <SignUpForm />
      },
      {
        path: '/upload',
        element: <TrackUploadForm />
      },
      {
        path: '/create-playlist',
        element: <PlaylistCreationForm />
      },
      {
        path: '/:username',
        
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
  },
], {
  basename: import.meta.env.MODE === "production" ? "/wavecave" : "/",
  future: {
    // This helps maintain state during error transitions
    v7_partialHydration: true,
  }
});
 

function App() {
  return <RouterProvider router={router} />;
}

export default App;

