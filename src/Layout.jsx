import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import * as sessionActions from "./store/session"
import * as trackActions from "./store/track"
import Navigation from "./components/navigation/Navigation";
import LoginForm from "./components/session/LoginForm";
import AudioPlayer from "./components/audio_player/AudioPlayer";
import { Outlet } from "react-router-dom";

export default function Layout({children}) {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const audioPlayerRef = useRef(null);
  
    useEffect(() => {
      dispatch(sessionActions.restoreSession()).then(() => {
        setIsLoaded(true)
      });
      dispatch(trackActions.reloadTracksLocally());
    }, [dispatch]);

    const audioPlayer = audioPlayerRef.current || (audioPlayerRef.current = <AudioPlayer />);

    return (
        <>
        <div className='app'>
          <Navigation />
          <div className='content'>
            <main className="hero">
              { isLoaded && (children || <Outlet />) }
            </main>
          </div>
          <LoginForm />
          {audioPlayer}
        </div>
        <div id='dev-links-container'>
          <a id='git-link' className='dev-link' href='https://github.com/ptrnln'><i className='fa-brands fa-github' /></a>
          <a className='dev-link' href='https://www.linkedin.com/in/peter-nolan-45828b2ab'><i className='fa-brands fa-linkedin' /></a>
          <a href="https://ph4se.dev/portfolio" className="dev-link"><i className="fa-solid fa-address-card"></i></a>
          <br />
          <span className='dev-cred'>Developed by Peter Nolan 2024</span>
        </div>
      </>
    );
}


